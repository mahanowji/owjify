import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { supportApiService } from '../services/supportApiService';
import { toLocalizedPair } from '../utils/formatters';
import { useAuth } from './AuthContext';

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const { user, token, hasToken, isProfessional, isAdmin, isMarketplaceMember } = useAuth();

  const [categories, setCategories] = useState(() => marketplaceService.getCategories());
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
  const [supportTickets, setSupportTickets] = useState(() =>
    supportApiService.getTicketsSync()
  );
  const [notifications, setNotifications] = useState(() =>
    marketplaceService.getNotifications()
  );
  const [inquiries, setInquiries] = useState(() => marketplaceService.getInquiries());

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
      const parsedName = toLocalizedPair(targetUser.fullName, 'متخصص اوجیفای', 'OWJIFY Specialist');
      const mappedSkills = (targetUser.skills || []).map((s) => toLocalizedPair(s));

      if (idx === -1) {
        const createdPro = {
          id: targetUser.proId,
          name: parsedName,
          title: toLocalizedPair(
            targetUser.title,
            'متخصص حرفه‌ای در اوجیفای',
            'OWJIFY Specialist'
          ),
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
          bio: toLocalizedPair(
            targetUser.bio,
            'ارائه‌دهنده خدمات تخصصی در اوجیفای.',
            'Verified specialist on OWJIFY.'
          ),
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
              name: {
                fa: parsedName.fa || p.name?.fa,
                en:
                  targetUser.fullName?.includes('|')
                    ? parsedName.en
                    : p.name?.en || parsedName.en,
              },
              title: targetUser.title ? toLocalizedPair(targetUser.title) : p.title,
              avatar: targetUser.avatar || p.avatar,
              locationId: targetUser.locationId || p.locationId,
              experienceYears: Number(targetUser.experienceYears || p.experienceYears || 5),
              bio: targetUser.bio ? toLocalizedPair(targetUser.bio) : p.bio,
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
        ownerUserId: user.id,
        proId: user.proId || 'pro-1',
        categoryId: payload.categoryId || 'technology',
        subcategoryId: payload.subcategoryId || '',
        title: toLocalizedPair(payload.title),
        shortDesc: toLocalizedPair(payload.tagline || payload.shortDesc || payload.title),
        description: toLocalizedPair(payload.description),
        deliverables: (payload.deliverables || [])
          .filter(Boolean)
          .map((d) => toLocalizedPair(d)),
        skills: (payload.skills || []).filter(Boolean).map((s) => toLocalizedPair(s)),
        pricingType: payload.pricingType
          ? toLocalizedPair(payload.pricingType)
          : { fa: 'شروع تعرفه خدمت', en: 'Starting at' },
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
          title: updates.title ? toLocalizedPair(updates.title) : a.title,
          shortDesc:
            updates.tagline || updates.shortDesc
              ? toLocalizedPair(updates.tagline || updates.shortDesc)
              : a.shortDesc,
          description: updates.description
            ? toLocalizedPair(updates.description)
            : a.description,
          deliverables: updates.deliverables
            ? updates.deliverables.filter(Boolean).map((d) => toLocalizedPair(d))
            : a.deliverables,
          skills: updates.skills
            ? updates.skills.filter(Boolean).map((s) => toLocalizedPair(s))
            : a.skills,
          pricingType: updates.pricingType
            ? toLocalizedPair(updates.pricingType)
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

  // Reviews (compatible with both ServiceDetailsPage, ProfessionalProfilePage & DashboardPage)
  const addReview = useCallback(
    ({ adId, proId, rating, comment }) => {
      if (!hasToken || !user) return null;
      const authorObj = toLocalizedPair(user.fullName, 'کاربر اوجیفای', 'OWJIFY Member');
      const newRev = {
        id: `rev_${Date.now()}`,
        adId,
        proId,
        authorUserId: user.id,
        author: authorObj,
        authorName: authorObj,
        role: toLocalizedPair(user.title, 'کارفرما', 'Client'),
        avatar: user.avatar,
        authorAvatar: user.avatar,
        rating: Number(rating || 5),
        comment: toLocalizedPair(comment),
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
    const replyObj = toLocalizedPair(replyText);
    setReviews((prev) => {
      const next = prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: replyObj,
              proReply: replyObj,
              repliedAt: new Date().toISOString(),
            }
          : r
      );
      marketplaceService.saveReviews(next);
      return next;
    });
  }, []);

  const deleteReview = useCallback((reviewId) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== reviewId);
      marketplaceService.saveReviews(next);
      return next;
    });
  }, []);

  // Category Management (Admin)
  const addCategory = useCallback((payload) => {
    const slugBase =
      (payload.nameEn || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const newCat = {
      id: `${slugBase}-${Math.floor(10 + Math.random() * 89)}`,
      slug: slugBase,
      icon: payload.icon || 'Sparkles',
      active: true,
      name: {
        fa: payload.nameFa?.trim() || payload.nameEn?.trim() || 'دسته‌بندی جدید',
        en: payload.nameEn?.trim() || payload.nameFa?.trim() || 'New Category',
      },
      tagline: {
        fa: payload.taglineFa?.trim() || 'خدمات تخصصی منتخب در اوجیفای',
        en: payload.taglineEn?.trim() || 'Curated specialist services on OWJIFY',
      },
      accent: '#C7F36B',
      cover:
        payload.cover ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      subcategories: [
        {
          id: `${slugBase}-general`,
          name: { fa: 'خدمات عمومی و مشاوره', en: 'General & Consulting' },
        },
      ],
      suggestedSkills: [{ fa: 'مشاوره تخصصی', en: 'Specialist Consulting' }],
    };
    setCategories((prev) => {
      const next = [...prev, newCat];
      marketplaceService.saveCategories(next);
      return next;
    });
    return newCat;
  }, []);

  const updateCategory = useCallback((categoryId, patch) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === categoryId ? { ...c, ...patch } : c));
      marketplaceService.saveCategories(next);
      return next;
    });
  }, []);

  const toggleCategoryActive = useCallback((categoryId) => {
    setCategories((prev) => {
      const next = prev.map((c) =>
        c.id === categoryId ? { ...c, active: c.active === false ? true : false } : c
      );
      marketplaceService.saveCategories(next);
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
        text: toLocalizedPair(text.trim()),
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
        text: toLocalizedPair(messageText),
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
        const created = {
          id: targetId,
          threadKind: 'service_inquiry',
          initiatorUserId: user.id,
          initiatorProId: user.proId || null,
          initiatorRole: user.accountType,
          initiatorName: toLocalizedPair(user.fullName, 'کاربر اوجیفای', 'OWJIFY Member'),
          initiatorTitle: toLocalizedPair(user.title, 'کارفرما', 'Client'),
          initiatorAvatar: user.avatar,
          recipientUserId: pro.id === 'pro-1' ? 'user-pro-demo' : `user_${pro.id}`,
          recipientProId: pro.id,
          recipientName: pro.name,
          recipientTitle: pro.title,
          recipientAvatar: pro.avatar,
          online: Boolean(pro.availableNow),
          unreadByInitiator: 0,
          unreadByRecipient: 1,
          serviceTitle: toLocalizedPair(serviceTitle || pro.title),
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
      title: toLocalizedPair(project.title),
      year: project.year || '2026',
      summary: toLocalizedPair(
        project.summary,
        'پروژه اجرایی ثبت‌شده در پورتفولیو',
        'Verified portfolio project'
      ),
      category: toLocalizedPair(project.category, 'پروژه تخصصی', 'Featured Project'),
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
          authorName: authorName || user?.fullName || 'اپراتور پشتیبانی | Support Operator',
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

  const escalateSupportTicket = useCallback(
    async ({ ticketId, reason }) => {
      const nextList = await supportApiService.escalateTicket(
        {
          ticketId,
          reason,
          authorName: user?.fullName || 'اپراتور پشتیبانی | Support Operator',
        },
        token
      );
      setSupportTickets(nextList);
      return nextList;
    },
    [user, token]
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

  const unreadNotificationsCount = useMemo(
    () => (hasToken ? notifications.filter((n) => !n.read).length : 0),
    [notifications, hasToken]
  );

  const unreadMessagesCount = useMemo(
    () => (hasToken ? conversations.reduce((sum, c) => sum + (c.unread || 0), 0) : 0),
    [conversations, hasToken]
  );

  const activeCategories = useMemo(
    () => categories.filter((c) => c.active !== false),
    [categories]
  );

  const openSupportTicketsCount = useMemo(
    () =>
      supportTickets.filter(
        (t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'escalated'
      ).length,
    [supportTickets]
  );

  const escalatedTicketsCount = useMemo(
    () => supportTickets.filter((t) => t.status === 'escalated').length,
    [supportTickets]
  );

  const value = useMemo(
    () => ({
      categories,
      activeCategories,
      advertisements,
      professionals,
      reviews,
      favoriteAds: hasToken ? favoriteAds : [],
      favoritePros: hasToken ? favoritePros : [],
      allConversations,
      conversations,
      supportTickets,
      openSupportTicketsCount,
      escalatedTicketsCount,
      notifications: hasToken ? notifications : [],
      inquiries,
      unreadNotificationsCount,
      unreadMessagesCount,
      addCategory,
      updateCategory,
      toggleCategoryActive,
      toggleFavoriteAd,
      toggleFavoritePro,
      createAdvertisement,
      createAd: createAdvertisement,
      updateAdvertisement,
      updateAd: updateAdvertisement,
      toggleAdvertisementStatus,
      deleteAdvertisement,
      deleteAd: deleteAdvertisement,
      addReview,
      replyToReview,
      deleteReview,
      adminDeleteReview: deleteReview,
      sendMessageInConversation,
      sendMessage: sendMessageInConversation,
      startOrSendConversation,
      markConversationRead,
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
      escalateSupportTicket,
    }),
    [
      categories,
      activeCategories,
      advertisements,
      professionals,
      reviews,
      hasToken,
      favoriteAds,
      favoritePros,
      allConversations,
      conversations,
      supportTickets,
      openSupportTicketsCount,
      escalatedTicketsCount,
      notifications,
      inquiries,
      unreadNotificationsCount,
      unreadMessagesCount,
      addCategory,
      updateCategory,
      toggleCategoryActive,
      toggleFavoriteAd,
      toggleFavoritePro,
      createAdvertisement,
      updateAdvertisement,
      toggleAdvertisementStatus,
      deleteAdvertisement,
      addReview,
      replyToReview,
      deleteReview,
      sendMessageInConversation,
      startOrSendConversation,
      markConversationRead,
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
      escalateSupportTicket,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}
