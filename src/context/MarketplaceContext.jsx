import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { supportApiService } from '../services/supportApiService';
import { useAuth } from './AuthContext';

const MarketplaceContext = createContext(null);

function toLocalized(val) {
  if (!val) return { fa: '', en: '' };
  if (typeof val === 'object') {
    return { fa: val.fa || val.en || '', en: val.en || val.fa || '' };
  }
  const s = String(val);
  return { fa: s, en: s };
}

export function MarketplaceProvider({ children }) {
  const { user, token, hasToken, isProfessional, isAdmin } = useAuth();

  const [advertisements, setAdvertisements] = useState(() =>
    marketplaceService.getAdvertisements()
  );
  const [professionals, setProfessionals] = useState(() =>
    marketplaceService.getProfessionals()
  );
  const [reviews, setReviews] = useState(() => marketplaceService.getReviews());
  const [favoriteAds, setFavoriteAds] = useState(() => marketplaceService.getFavoriteAds());
  const [favoritePros, setFavoritePros] = useState(() => marketplaceService.getFavoritePros());
  const [allConversations, setAllConversations] = useState(() =>
    marketplaceService.getConversations()
  );
  const [allSkillRequests, setAllSkillRequests] = useState(() =>
    marketplaceService.getSkillRequests()
  );
  const [supportTickets, setSupportTickets] = useState(() =>
    supportApiService.getTicketsSync()
  );
  const [notifications, setNotifications] = useState(() =>
    marketplaceService.getNotifications()
  );
  const [inquiries, setInquiries] = useState(() => marketplaceService.getInquiries());

  // Provider Skill Request Modal State
  const [skillModalState, setSkillModalState] = useState({
    open: false,
    presetPro: null,
  });

  const openSkillRequestModal = useCallback((presetPro = null) => {
    setSkillModalState({ open: true, presetPro: presetPro || null });
  }, []);

  const closeSkillRequestModal = useCallback(() => {
    setSkillModalState({ open: false, presetPro: null });
  }, []);

  // Sync Support Tickets from API / Storage
  useEffect(() => {
    supportApiService.fetchTickets(token).then((list) => {
      if (Array.isArray(list)) setSupportTickets(list);
    });
  }, [token]);

  // Ensure a Professional profile record exists for any registered Provider
  const syncUserToProfessional = useCallback((targetUser) => {
    if (!targetUser || targetUser.accountType !== 'professional' || !targetUser.proId) return;
    setProfessionals((prev) => {
      const idx = prev.findIndex((p) => p.id === targetUser.proId);
      const cleanName = targetUser.fullName?.split('|')[0]?.trim() || targetUser.fullName;
      const mappedSkills = (targetUser.skills || []).map((s) => toLocalized(s));

      if (idx === -1) {
        const createdPro = {
          id: targetUser.proId,
          name: { fa: cleanName, en: cleanName },
          title: toLocalized(targetUser.title || 'متخصص حرفه‌ای در اوجیفای'),
          avatar: targetUser.avatar,
          cover: targetUser.cover,
          categoryId: 'technology',
          locationId: targetUser.locationId || 'tehran',
          rating: 5.0,
          reviewCount: 1,
          completedJobs: 12,
          experienceYears: Number(targetUser.experienceYears || 4),
          verified: Boolean(targetUser.emailVerified),
          availableNow: true,
          responseTime: { fa: 'کمتر از ۳۰ دقیقه', en: 'Under 30 mins' },
          bio: toLocalized(targetUser.bio || 'ارائه‌دهنده خدمات تخصصی در اوجیفای.'),
          skills: mappedSkills.length
            ? mappedSkills
            : [{ fa: 'مشاوره تخصصی', en: 'Consulting' }],
          portfolio: [],
          availability: {
            days: ['sat', 'sun', 'mon', 'tue', 'wed'],
            hours: '09:00 - 19:00',
            urgent: true,
            remote: true,
          },
        };
        const next = [createdPro, ...prev];
        marketplaceService.saveProfessionals(next);
        return next;
      }

      const updated = prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              name: { fa: cleanName, en: p.name?.en || cleanName },
              title: targetUser.title ? toLocalized(targetUser.title) : p.title,
              avatar: targetUser.avatar || p.avatar,
              locationId: targetUser.locationId || p.locationId,
              experienceYears: Number(targetUser.experienceYears || p.experienceYears || 5),
              bio: targetUser.bio ? toLocalized(targetUser.bio) : p.bio,
              skills: mappedSkills.length ? mappedSkills : p.skills,
            }
          : p
      );
      marketplaceService.saveProfessionals(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (user?.accountType === 'professional' && user.proId) {
      syncUserToProfessional(user);
    }
  }, [user, syncUserToProfessional]);

  // Favorites / Likes
  const toggleFavoriteAd = useCallback(
    (adId) => {
      if (!hasToken) return false;
      let added = false;
      setFavoriteAds((prev) => {
        const exists = prev.includes(adId);
        added = !exists;
        const next = exists ? prev.filter((id) => id !== adId) : [adId, ...prev];
        marketplaceService.saveFavoriteAds(next);
        return next;
      });
      return added;
    },
    [hasToken]
  );

  const toggleFavoritePro = useCallback(
    (proId) => {
      if (!hasToken) return false;
      let added = false;
      setFavoritePros((prev) => {
        const exists = prev.includes(proId);
        added = !exists;
        const next = exists ? prev.filter((id) => id !== proId) : [proId, ...prev];
        marketplaceService.saveFavoritePros(next);
        return next;
      });
      return added;
    },
    [hasToken]
  );

  // Advertisements CRUD (Provider & Admin)
  const createAdvertisement = useCallback(
    (payload) => {
      if (!hasToken || !isProfessional) {
        throw new Error('PROVIDER_ROLE_REQUIRED');
      }
      syncUserToProfessional(user);
      const priceNum = Number(payload.price || 1500000);
      const newAd = {
        id: `ad_${Date.now()}`,
        proId: user.proId || 'pro-1',
        categoryId: payload.categoryId || 'technology',
        subcategoryId: payload.subcategoryId || '',
        title: toLocalized(payload.title),
        shortDesc: toLocalized(payload.tagline || payload.shortDesc || payload.title),
        description: toLocalized(payload.description),
        deliverables: (payload.deliverables || [])
          .filter(Boolean)
          .map((d) => toLocalized(d)),
        skills: (payload.skills || []).filter(Boolean).map((s) => toLocalized(s)),
        pricingType: toLocalized(payload.pricingType || 'شروع تعرفه خدمت'),
        price: priceNum,
        priceUsd: Math.max(20, Math.round(priceNum / 50000)),
        locationId: payload.locationId || user.locationId || 'tehran',
        remoteAvailable: Boolean(payload.remoteAvailable),
        urgentAvailable: Boolean(payload.urgentAvailable),
        weekendAvailable: Boolean(payload.weekendAvailable),
        availabilityDays: payload.availabilityDays || ['sat', 'sun', 'mon', 'tue', 'wed'],
        availabilityHours: payload.availabilityHours || '09:00 - 20:00',
        images:
          payload.images?.length > 0
            ? payload.images
            : [
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
              ],
        rating: 5.0,
        reviewCount: 0,
        views: 1,
        featured: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setAdvertisements((prev) => {
        const next = [newAd, ...prev];
        marketplaceService.saveAdvertisements(next);
        return next;
      });
      return newAd;
    },
    [hasToken, isProfessional, user, syncUserToProfessional]
  );

  const updateAdvertisement = useCallback((adId, updates) => {
    let updatedItem = null;
    setAdvertisements((prev) => {
      const next = prev.map((a) => {
        if (a.id !== adId) return a;
        updatedItem = {
          ...a,
          ...updates,
          title: updates.title ? toLocalized(updates.title) : a.title,
          shortDesc:
            updates.tagline || updates.shortDesc
              ? toLocalized(updates.tagline || updates.shortDesc)
              : a.shortDesc,
          description: updates.description
            ? toLocalized(updates.description)
            : a.description,
          deliverables: updates.deliverables
            ? updates.deliverables.filter(Boolean).map((d) => toLocalized(d))
            : a.deliverables,
          skills: updates.skills
            ? updates.skills.filter(Boolean).map((s) => toLocalized(s))
            : a.skills,
          pricingType: updates.pricingType
            ? toLocalized(updates.pricingType)
            : a.pricingType,
          price: updates.price !== undefined ? Number(updates.price) : a.price,
        };
        return updatedItem;
      });
      marketplaceService.saveAdvertisements(next);
      return next;
    });
    return updatedItem;
  }, []);

  const toggleAdvertisementStatus = useCallback((adId) => {
    setAdvertisements((prev) => {
      const next = prev.map((a) =>
        a.id === adId
          ? { ...a, status: a.status === 'paused' ? 'active' : 'paused' }
          : a
      );
      marketplaceService.saveAdvertisements(next);
      return next;
    });
  }, []);

  const deleteAdvertisement = useCallback((adId) => {
    setAdvertisements((prev) => {
      const next = prev.filter((a) => a.id !== adId);
      marketplaceService.saveAdvertisements(next);
      return next;
    });
  }, []);

  // Reviews
  const addReview = useCallback(
    ({ adId, proId, rating, comment }) => {
      if (!hasToken || !user) return null;
      const newRev = {
        id: `rev_${Date.now()}`,
        adId,
        proId,
        authorName: toLocalized(user.fullName?.split('|')[0]?.trim() || 'کاربر اوجیفای'),
        authorAvatar: user.avatar,
        rating: Number(rating || 5),
        comment: toLocalized(comment),
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => {
        const next = [newRev, ...prev];
        marketplaceService.saveReviews(next);
        return next;
      });
      return newRev;
    },
    [hasToken, user]
  );

  const replyToReview = useCallback((reviewId, replyText) => {
    setReviews((prev) => {
      const next = prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              proReply: toLocalized(replyText),
              repliedAt: new Date().toISOString(),
            }
          : r
      );
      marketplaceService.saveReviews(next);
      return next;
    });
  }, []);

  // Messaging (Customer -> Provider & Provider <-> Customer / Peer)
  const sendMessageInConversation = useCallback(
    (conversationId, text) => {
      if (!hasToken || !user || !text.trim()) return;
      const now = new Date().toISOString();
      const newMsg = {
        id: `m_${Date.now()}`,
        senderUserId: user.id,
        senderProId: user.proId || null,
        text: toLocalized(text.trim()),
        createdAt: now,
      };
      setAllConversations((prev) => {
        const next = prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                updatedAt: now,
                messages: [...(c.messages || []), newMsg],
              }
            : c
        );
        marketplaceService.saveConversations(next);
        return next;
      });
    },
    [hasToken, user]
  );

  const startOrSendConversation = useCallback(
    ({ pro, serviceTitle, messageText }) => {
      if (!hasToken || !user || !pro) return null;
      const now = new Date().toISOString();
      const msg = {
        id: `m_${Date.now()}`,
        senderUserId: user.id,
        senderProId: user.proId || null,
        text: toLocalized(messageText),
        createdAt: now,
      };

      let targetId = null;
      setAllConversations((prev) => {
        const existing = prev.find(
          (c) =>
            c.initiatorUserId === user.id &&
            c.recipientProId === pro.id &&
            c.threadKind !== 'skill_request'
        );
        if (existing) {
          targetId = existing.id;
          const next = prev.map((c) =>
            c.id === existing.id
              ? { ...c, updatedAt: now, messages: [...(c.messages || []), msg] }
              : c
          );
          marketplaceService.saveConversations(next);
          return next;
        }

        targetId = `conv_${Date.now()}`;
        const cleanSender = user.fullName?.split('|')[0]?.trim() || 'کاربر اوجیفای';
        const created = {
          id: targetId,
          threadKind: 'service_inquiry',
          initiatorUserId: user.id,
          initiatorProId: user.proId || null,
          initiatorRole: user.accountType,
          initiatorName: toLocalized(cleanSender),
          initiatorTitle: toLocalized(user.title || 'کارفرما'),
          initiatorAvatar: user.avatar,
          recipientUserId: pro.id === 'pro-1' ? 'user-pro-demo' : `user_${pro.id}`,
          recipientProId: pro.id,
          recipientName: pro.name,
          recipientTitle: pro.title,
          recipientAvatar: pro.avatar,
          online: Boolean(pro.availableNow),
          unreadByInitiator: 0,
          unreadByRecipient: 1,
          serviceTitle: toLocalized(serviceTitle || pro.title),
          updatedAt: now,
          messages: [msg],
        };
        const next = [created, ...prev];
        marketplaceService.saveConversations(next);
        return next;
      });

      return targetId;
    },
    [hasToken, user]
  );

  const markConversationRead = useCallback(
    (conversationId) => {
      if (!user) return;
      setAllConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id !== conversationId) return c;
          const isInit = c.initiatorUserId === user.id;
          return isInit
            ? { ...c, unreadByInitiator: 0 }
            : { ...c, unreadByRecipient: 0 };
        });
        marketplaceService.saveConversations(next);
        return next;
      });
    },
    [user]
  );

  // Provider-Only Skill Requests
  const createSkillRequest = useCallback(
    (payload) => {
      if (!hasToken || !isProfessional || !user) {
        throw new Error('PROVIDER_ROLE_REQUIRED');
      }
      const now = new Date().toISOString();
      const targetPro = payload.targetProId
        ? professionals.find((p) => p.id === payload.targetProId)
        : null;

      let linkedConvId = null;
      if (payload.requestType === 'specialist_collaboration' && targetPro) {
        linkedConvId = `conv_sr_${Date.now()}`;
        const cleanSender = user.fullName?.split('|')[0]?.trim() || 'متخصص اوجیفای';
        const srConv = {
          id: linkedConvId,
          threadKind: 'skill_request',
          requestedSkill: toLocalized(payload.skillName),
          initiatorUserId: user.id,
          initiatorProId: user.proId || null,
          initiatorRole: 'professional',
          initiatorName: toLocalized(cleanSender),
          initiatorTitle: toLocalized(user.title || 'متخصص'),
          initiatorAvatar: user.avatar,
          recipientUserId: `user_${targetPro.id}`,
          recipientProId: targetPro.id,
          recipientName: targetPro.name,
          recipientTitle: targetPro.title,
          recipientAvatar: targetPro.avatar,
          online: true,
          unreadByInitiator: 0,
          unreadByRecipient: 1,
          serviceTitle: {
            fa: `همکاری تخصصی: ${payload.skillName}`,
            en: `Skill Request: ${payload.skillName}`,
          },
          updatedAt: now,
          messages: [
            {
              id: `m_sr_${Date.now()}`,
              senderUserId: user.id,
              senderProId: user.proId || null,
              text: toLocalized(
                payload.details ||
                  `درخواست همکاری تخصصی در مهارت «${payload.skillName}»`
              ),
              createdAt: now,
            },
          ],
        };
        setAllConversations((prev) => {
          const next = [srConv, ...prev];
          marketplaceService.saveConversations(next);
          return next;
        });
      }

      if (payload.addToMyProfile && user.proId) {
        setProfessionals((prev) => {
          const next = prev.map((p) =>
            p.id === user.proId
              ? { ...p, skills: [...(p.skills || []), toLocalized(payload.skillName)] }
              : p
          );
          marketplaceService.saveProfessionals(next);
          return next;
        });
      }

      const newReq = {
        id: `sr_${Date.now()}`,
        requestType: payload.requestType || 'specialist_collaboration',
        categoryId: payload.categoryId || 'technology',
        skillName: toLocalized(payload.skillName),
        requesterUserId: user.id,
        requesterProId: user.proId || 'pro-1',
        targetProId: targetPro?.id || null,
        targetProName: targetPro?.name || null,
        urgency: payload.urgency || 'normal',
        budget: payload.budget || '',
        details: toLocalized(payload.details || payload.skillName),
        status: 'open',
        conversationId: linkedConvId,
        createdAt: now,
      };

      setAllSkillRequests((prev) => {
        const next = [newReq, ...prev];
        marketplaceService.saveSkillRequests(next);
        return next;
      });

      return newReq;
    },
    [hasToken, isProfessional, user, professionals]
  );

  const updateSkillRequestStatus = useCallback((reqId, status) => {
    setAllSkillRequests((prev) => {
      const next = prev.map((r) => (r.id === reqId ? { ...r, status } : r));
      marketplaceService.saveSkillRequests(next);
      return next;
    });
  }, []);

  // Provider Dashboard Helpers (Availability, Portfolio, Inquiries)
  const updateInquiryStatus = useCallback((inqId, status) => {
    setInquiries((prev) => {
      const next = prev.map((inq) => (inq.id === inqId ? { ...inq, status } : inq));
      marketplaceService.saveInquiries(next);
      return next;
    });
  }, []);

  const updateProfessionalAvailability = useCallback((proId, availabilityPatch) => {
    setProfessionals((prev) => {
      const next = prev.map((p) =>
        p.id === proId
          ? {
              ...p,
              availableNow:
                availabilityPatch.availableNow !== undefined
                  ? availabilityPatch.availableNow
                  : p.availableNow,
              availability: { ...(p.availability || {}), ...availabilityPatch },
            }
          : p
      );
      marketplaceService.saveProfessionals(next);
      return next;
    });
  }, []);

  const addPortfolioProject = useCallback((proId, project) => {
    const newItem = {
      id: `pf_${Date.now()}`,
      title: toLocalized(project.title),
      category: toLocalized(project.category || 'پروژه تخصصی'),
      image:
        project.image ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    };
    setProfessionals((prev) => {
      const next = prev.map((p) =>
        p.id === proId ? { ...p, portfolio: [newItem, ...(p.portfolio || [])] } : p
      );
      marketplaceService.saveProfessionals(next);
      return next;
    });
  }, []);

  const deletePortfolioProject = useCallback((proId, projectId) => {
    setProfessionals((prev) => {
      const next = prev.map((p) =>
        p.id === proId
          ? { ...p, portfolio: (p.portfolio || []).filter((item) => item.id !== projectId) }
          : p
      );
      marketplaceService.saveProfessionals(next);
      return next;
    });
  }, []);

  const adminUpdateSpecialist = useCallback((proId, patch) => {
    setProfessionals((prev) => {
      const next = prev.map((p) => (p.id === proId ? { ...p, ...patch } : p));
      marketplaceService.saveProfessionals(next);
      return next;
    });
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      marketplaceService.saveNotifications(next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      marketplaceService.saveNotifications(next);
      return next;
    });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      marketplaceService.saveNotifications(next);
      return next;
    });
  }, []);

  // Support & Reporting API actions
  const createSupportTicket = useCallback(
    async (payload) => {
      const created = await supportApiService.submitTicket(
        {
          ...payload,
          reporterUserId: payload.reporterUserId ?? user?.id ?? null,
          reporterRole: payload.reporterRole ?? user?.accountType ?? 'guest',
          reporterName: payload.reporterName || user?.fullName || 'کاربر مهمان | Guest',
          reporterEmail: payload.reporterEmail || user?.email || '',
        },
        token
      );
      setSupportTickets(supportApiService.getTicketsSync());
      return created;
    },
    [user, token]
  );

  const replySupportTicket = useCallback(
    async ({ ticketId, replyText, authorName, authorRole, nextStatus }) => {
      const nextList = await supportApiService.replyToTicket(
        {
          ticketId,
          replyText,
          authorName: authorName || user?.fullName || 'Support Operator',
          authorRole: authorRole || user?.accountType || 'operator',
          nextStatus,
        },
        token
      );
      setSupportTickets(nextList);
      return nextList;
    },
    [user, token]
  );

  const updateSupportTicketStatus = useCallback(
    async (ticketId, status) => {
      const nextList = await supportApiService.updateTicketStatus({ ticketId, status }, token);
      setSupportTickets(nextList);
      return nextList;
    },
    [token]
  );

  // Decorated Role-Scoped Conversations for Messenger & Dashboard
  const conversations = useMemo(() => {
    if (!hasToken || !user) return [];

    const relevant = allConversations.filter((c) => {
      if (isProfessional) {
        return (
          c.recipientProId === user.proId ||
          c.recipientUserId === user.id ||
          c.initiatorUserId === user.id ||
          c.initiatorProId === user.proId
        );
      }
      // Customers ONLY see messages they sent to providers
      return c.initiatorUserId === user.id;
    });

    return relevant
      .map((c) => {
        const isInitiator =
          c.initiatorUserId === user.id ||
          (Boolean(user.proId) && c.initiatorProId === user.proId);

        const direction = isInitiator ? 'sent' : 'received';
        const participantName = isInitiator ? c.recipientName : c.initiatorName;
        const participantRole = isInitiator ? c.recipientTitle : c.initiatorTitle;
        const participantAvatar = isInitiator ? c.recipientAvatar : c.initiatorAvatar;
        const proId = isInitiator ? c.recipientProId : c.initiatorProId;
        const unread = isInitiator
          ? Number(c.unreadByInitiator || 0)
          : Number(c.unreadByRecipient || 0);

        const decoratedMessages = (c.messages || []).map((m) => {
          const isMine =
            m.senderUserId === user.id ||
            (Boolean(user.proId) && m.senderProId === user.proId);
          return {
            ...m,
            sender: isMine ? 'me' : 'them',
          };
        });

        return {
          ...c,
          direction,
          participantName,
          participantRole,
          participantAvatar,
          proId,
          unread,
          messages: decoratedMessages,
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [allConversations, hasToken, user, isProfessional]);

  const skillRequests = useMemo(() => {
    if (!hasToken || (!isProfessional && !isAdmin) || !user) return [];
    if (isAdmin) return allSkillRequests;
    return allSkillRequests.filter(
      (r) =>
        r.requesterUserId === user.id ||
        r.requesterProId === user.proId ||
        r.targetProId === user.proId
    );
  }, [allSkillRequests, hasToken, isProfessional, isAdmin, user]);

  const unreadNotificationsCount = useMemo(
    () => (hasToken ? notifications.filter((n) => !n.read).length : 0),
    [notifications, hasToken]
  );

  const unreadMessagesCount = useMemo(
    () => (hasToken ? conversations.reduce((sum, c) => sum + (c.unread || 0), 0) : 0),
    [conversations, hasToken]
  );

  const openSupportTicketsCount = useMemo(
    () =>
      supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
    [supportTickets]
  );

  const value = useMemo(
    () => ({
      advertisements,
      professionals,
      reviews,
      favoriteAds: hasToken ? favoriteAds : [],
      favoritePros: hasToken ? favoritePros : [],
      allConversations,
      conversations,
      skillRequests,
      skillModalState,
      openSkillRequestModal,
      closeSkillRequestModal,
      supportTickets,
      openSupportTicketsCount,
      notifications: hasToken ? notifications : [],
      inquiries,
      unreadNotificationsCount,
      unreadMessagesCount,
      toggleFavoriteAd,
      toggleFavoritePro,
      // Canonical + Shorthand aliases so all pages work seamlessly
      createAdvertisement,
      createAd: createAdvertisement,
      updateAdvertisement,
      updateAd: updateAdvertisement,
      toggleAdvertisementStatus,
      deleteAdvertisement,
      deleteAd: deleteAdvertisement,
      addReview,
      replyToReview,
      sendMessageInConversation,
      sendMessage: sendMessageInConversation,
      startOrSendConversation,
      markConversationRead,
      createSkillRequest,
      updateSkillRequestStatus,
      updateInquiryStatus,
      updateProfessionalAvailability,
      addPortfolioProject,
      deletePortfolioProject,
      syncUserToProfessional,
      syncProProfile: adminUpdateSpecialist,
      adminUpdateSpecialist,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      createSupportTicket,
      replySupportTicket,
      updateSupportTicketStatus,
    }),
    [
      advertisements,
      professionals,
      reviews,
      hasToken,
      favoriteAds,
      favoritePros,
      allConversations,
      conversations,
      skillRequests,
      skillModalState,
      openSkillRequestModal,
      closeSkillRequestModal,
      supportTickets,
      openSupportTicketsCount,
      notifications,
      inquiries,
      unreadNotificationsCount,
      unreadMessagesCount,
      toggleFavoriteAd,
      toggleFavoritePro,
      createAdvertisement,
      updateAdvertisement,
      toggleAdvertisementStatus,
      deleteAdvertisement,
      addReview,
      replyToReview,
      sendMessageInConversation,
      startOrSendConversation,
      markConversationRead,
      createSkillRequest,
      updateSkillRequestStatus,
      updateInquiryStatus,
      updateProfessionalAvailability,
      addPortfolioProject,
      deletePortfolioProject,
      syncUserToProfessional,
      adminUpdateSpecialist,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      createSupportTicket,
      replySupportTicket,
      updateSupportTicketStatus,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}
