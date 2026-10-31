import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Users,
  Briefcase,
  MessageSquare,
  Star,
  AlertTriangle,
  TrendingUp,
  Search,
  BadgeCheck,
  Mail,
  Headset,
  Eye,
  PauseCircle,
  PlayCircle,
  Trash2,
  Save,
  ExternalLink,
  Plus,
  Layers,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import CategoryIcon from '../../components/common/CategoryIcon';
import { getCategoryById } from '../../data/categories';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatNumber, formatPrice, formatRelativeDate } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const { lang, l } = useLanguage();
  const { user, allUsers, adminUpdateUser } = useAuth();
  const {
    categories,
    advertisements,
    professionals,
    reviews,
    allConversations,
    supportTickets,
    escalatedTicketsCount,
    addCategory,
    updateCategory,
    toggleCategoryActive,
    updateAd,
    deleteAd,
    deleteReview,
    adminUpdateSpecialist,
    replySupportTicket,
    updateSupportTicketStatus,
  } = useMarketplace();
  const { showToast } = useToast();

  const [tab, setTab] = useState(0);

  // CRM State
  const [crmSearch, setCrmSearch] = useState('');
  const [crmRoleFilter, setCrmRoleFilter] = useState('all');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [stageDraft, setStageDraft] = useState('Active');

  // Listings Moderation State
  const [adSearch, setAdSearch] = useState('');
  const [adStatusFilter, setAdStatusFilter] = useState('all');

  // Category Management State
  const [newCatFa, setNewCatFa] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newTagFa, setNewTagFa] = useState('');
  const [newTagEn, setNewTagEn] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatFa, setEditCatFa] = useState('');
  const [editCatEn, setEditCatEn] = useState('');

  // Reviews Moderation State
  const [reviewSearch, setReviewSearch] = useState('');

  // Support Admin Reply State
  const [adminReplyDrafts, setAdminReplyDrafts] = useState({});

  // Build Unified CRM Directory (Registered Users + Marketplace Specialists)
  const crmDirectory = useMemo(() => {
    const map = new Map();

    allUsers.forEach((u) => {
      map.set(u.id, {
        id: u.id,
        userId: u.id,
        proId: u.proId || null,
        name: u.fullName,
        email: u.email,
        phone: u.phone || '—',
        role: u.accountType,
        avatar: u.avatar,
        locationId: u.locationId || 'tehran',
        crmStage: u.crmStage || 'Active',
        crmNotes: u.crmNotes || '',
        verified: u.proId
          ? Boolean(professionals.find((p) => p.id === u.proId)?.verified)
          : Boolean(u.emailVerified),
        adsCount: u.proId ? advertisements.filter((a) => a.proId === u.proId).length : 0,
        messagesCount: allConversations.filter(
          (c) => c.initiatorUserId === u.id || c.recipientProId === u.proId
        ).length,
      });
    });

    professionals.forEach((p) => {
      const alreadyLinked = Array.from(map.values()).find((item) => item.proId === p.id);
      if (!alreadyLinked) {
        map.set(`crm_${p.id}`, {
          id: `crm_${p.id}`,
          userId: null,
          proId: p.id,
          name: `${p.name.fa} | ${p.name.en}`,
          email: `${p.id.replace('-', '.')}@owjify-pro.ir`,
          phone: p.phone || '09120000000',
          role: 'professional',
          avatar: p.avatar,
          locationId: p.locationId || 'tehran',
          crmStage: p.verified ? 'Verified' : 'Active',
          crmNotes: p.crmNotes || 'Vetted OWJIFY marketplace specialist.',
          verified: Boolean(p.verified),
          rating: p.rating,
          completedJobs: p.completedJobs,
          adsCount: advertisements.filter((a) => a.proId === p.id).length,
          messagesCount: allConversations.filter(
            (c) => c.recipientProId === p.id || c.proId === p.id
          ).length,
        });
      }
    });

    return Array.from(map.values());
  }, [allUsers, professionals, advertisements, allConversations]);

  const filteredCrm = useMemo(() => {
    const q = crmSearch.trim().toLowerCase();
    return crmDirectory.filter((c) => {
      if (crmRoleFilter !== 'all' && c.role !== crmRoleFilter) return false;
      if (!q) return true;
      return `${c.name} ${c.email} ${c.role} ${c.crmStage}`.toLowerCase().includes(q);
    });
  }, [crmDirectory, crmSearch, crmRoleFilter]);

  const selectedContact =
    crmDirectory.find((c) => c.id === selectedContactId) || filteredCrm[0] || null;

  const handleSelectContact = (c) => {
    setSelectedContactId(c.id);
    setNoteDraft(c.crmNotes || '');
    setStageDraft(c.crmStage || 'Active');
  };

  const handleSaveCrmRecord = () => {
    if (!selectedContact) return;
    if (selectedContact.userId) {
      adminUpdateUser(selectedContact.userId, {
        crmStage: stageDraft,
        crmNotes: noteDraft,
      });
    }
    if (selectedContact.proId) {
      adminUpdateSpecialist(selectedContact.proId, {
        crmNotes: noteDraft,
      });
    }
    showToast({
      title: lang === 'fa' ? 'پرونده CRM بروزرسانی شد' : 'CRM Record Saved',
      message: l(selectedContact.name),
      type: 'success',
    });
  };

  const handleToggleSpecialistVerified = (proId, currentVerified) => {
    adminUpdateSpecialist(proId, { verified: !currentVerified });
    showToast({
      title: !currentVerified
        ? lang === 'fa'
          ? 'نشان تایید تخصصی فعال شد'
          : 'Specialist Verified'
        : lang === 'fa'
        ? 'نشان تایید برداشته شد'
        : 'Verification Removed',
      type: 'info',
    });
  };

  // Executive Analytics Calculations
  const totalViews = useMemo(
    () => advertisements.reduce((sum, a) => sum + (a.views || 0), 0),
    [advertisements]
  );

  const avgRating = useMemo(() => {
    if (!reviews.length) return '4.95';
    const avg =
      reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length;
    return avg.toFixed(2);
  }, [reviews]);

  const categoryBreakdown = useMemo(() => {
    return categories
      .map((cat) => {
        const catAds = advertisements.filter((a) => a.categoryId === cat.id);
        const views = catAds.reduce((s, a) => s + (a.views || 0), 0);
        return {
          id: cat.id,
          name: l(cat.name),
          count: catAds.length,
          views,
          pct: Math.min(100, Math.round((views / Math.max(1, totalViews)) * 100 * 2.2)),
        };
      })
      .sort((a, b) => b.views - a.views);
  }, [categories, advertisements, totalViews, l]);

  // 6-Month Platform Growth Data
  const monthlyGrowth = [
    { monthFa: 'اردیبهشت', monthEn: 'May', connections: 185, newUsers: 94 },
    { monthFa: 'خرداد', monthEn: 'Jun', connections: 240, newUsers: 128 },
    { monthFa: 'تیر', monthEn: 'Jul', connections: 312, newUsers: 165 },
    { monthFa: 'مرداد', monthEn: 'Aug', connections: 390, newUsers: 210 },
    { monthFa: 'شهریور', monthEn: 'Sep', connections: 468, newUsers: 264 },
    { monthFa: 'مهر', monthEn: 'Oct', connections: 584, newUsers: 332 },
  ];

  const filteredAds = useMemo(() => {
    const q = adSearch.trim().toLowerCase();
    return advertisements.filter((a) => {
      if (adStatusFilter === 'active' && a.status === 'paused') return false;
      if (adStatusFilter === 'paused' && a.status !== 'paused') return false;
      if (adStatusFilter === 'featured' && !a.featured) return false;
      if (!q) return true;
      return `${a.title?.fa || ''} ${a.title?.en || ''}`.toLowerCase().includes(q);
    });
  }, [advertisements, adSearch, adStatusFilter]);

  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) =>
      `${r.author?.fa || ''} ${r.author?.en || ''} ${r.comment?.fa || ''} ${
        r.comment?.en || ''
      }`
        .toLowerCase()
        .includes(q)
    );
  }, [reviews, reviewSearch]);

  const sortedSupportTickets = useMemo(() => {
    return [...supportTickets].sort((a, b) => {
      if (a.status === 'escalated' && b.status !== 'escalated') return -1;
      if (b.status === 'escalated' && a.status !== 'escalated') return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [supportTickets]);

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatFa.trim() && !newCatEn.trim()) return;
    addCategory({
      nameFa: newCatFa,
      nameEn: newCatEn,
      taglineFa: newTagFa,
      taglineEn: newTagEn,
      icon: newCatIcon,
    });
    setNewCatFa('');
    setNewCatEn('');
    setNewTagFa('');
    setNewTagEn('');
    showToast({
      title: lang === 'fa' ? 'دسته‌بندی جدید اضافه شد' : 'New Category Created',
      type: 'success',
    });
  };

  const handleSaveCategoryEdit = (catId) => {
    updateCategory(catId, {
      name: {
        fa: editCatFa.trim() || 'دسته‌بندی',
        en: editCatEn.trim() || 'Category',
      },
    });
    setEditingCatId(null);
    showToast({
      title: lang === 'fa' ? 'دسته‌بندی ویرایش شد' : 'Category Updated',
      type: 'success',
    });
  };

  const handleAdminTicketReply = async (ticketId, resolveNow = false) => {
    const txt = (adminReplyDrafts[ticketId] || '').trim();
    if (!txt) return;
    await replySupportTicket({
      ticketId,
      replyText: txt,
      authorName: user?.fullName || 'ماهان اوجی | Mahan Owji',
      authorRole: 'admin',
      nextStatus: resolveNow ? 'resolved' : 'answered',
    });
    setAdminReplyDrafts((prev) => ({ ...prev, [ticketId]: '' }));
    showToast({
      title:
        lang === 'fa'
          ? `پاسخ مدیریت برای ${ticketId} ثبت شد`
          : `Admin Response Sent (${ticketId})`,
      type: 'success',
    });
  };

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 } }}>
        {/* Executive Admin Header — Mahan Owji */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            mb: 3,
            borderRadius: 4,
            background:
              'radial-gradient(circle at 85% 20%, rgba(199,243,107,0.18), transparent 48%), #11120F',
            color: '#F6F5F0',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.8} alignItems="center">
              <Avatar
                src={user?.avatar}
                alt="Mahan Owji"
                sx={{ width: 56, height: 56, border: '2px solid #C7F36B' }}
              />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip
                    size="small"
                    label={
                      lang === 'fa'
                        ? 'مدیر ارشد نرم‌افزار و CRM کل سایت'
                        : 'Platform Admin & Full CRM'
                    }
                    sx={{
                      bgcolor: '#C7F36B',
                      color: '#11120F',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}
                  />
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {lang === 'fa'
                    ? 'مرکز فرماندهی و مدیریت کل اوجیفای — ماهان اوجی'
                    : 'OWJIFY Executive Admin & CRM — Mahan Owji'}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(246,245,240,0.72)' }}>
                  mahanowji1380@gmail.com •{' '}
                  {lang === 'fa'
                    ? 'مدیریت کاربران، احراز هویت متخصصان، آگهی‌ها، دسته‌بندی‌ها، دیدگاه‌ها و پشتیبانی'
                    : 'Users, Verification, Listings, Categories, Reviews & Support Oversight'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Link to="/operator" className="owj-btn owj-btn--lime owj-btn--sm">
                <Headset size={14} />
                <span>
                  {lang === 'fa' ? 'میز پاسخ‌گویی اپراتور' : 'Operator Console'}
                </span>
              </Link>
              <Link to="/about" className="owj-btn owj-btn--outline-light owj-btn--sm">
                <ExternalLink size={14} />
                <span>{lang === 'fa' ? 'صفحه درباره ما' : 'About Us'}</span>
              </Link>
            </Stack>
          </Stack>
        </Paper>

        {/* Escalation Alert Banner if Support Operators escalated tickets */}
        {escalatedTicketsCount > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 1.8,
              mb: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(217,72,72,0.1)',
              border: '1px solid rgba(217,72,72,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AlertTriangle size={18} color="#b83232" />
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: '#8f2222' }}>
                {lang === 'fa'
                  ? `${formatNumber(escalatedTicketsCount, lang)} پرونده فوری توسط اپراتور پشتیبانی به مدیریت ارشد ارجاع شده است.`
                  : `${escalatedTicketsCount} ticket(s) escalated by Support Operators require Admin action.`}
              </Typography>
            </Stack>
            <button
              type="button"
              onClick={() => setTab(5)}
              className="owj-btn owj-btn--danger owj-btn--sm"
            >
              {lang === 'fa' ? 'بررسی ارجاع‌ها' : 'Inspect Escalations'}
            </button>
          </Paper>
        )}

        {/* Top 6 Executive KPIs */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              icon: Users,
              label: lang === 'fa' ? 'کل اعضای CRM سامانه' : 'Total CRM Profiles',
              value: formatNumber(crmDirectory.length, lang),
              sub: lang === 'fa' ? '+۱۸٪ رشد ماهانه' : '+18% MoM',
            },
            {
              icon: Briefcase,
              label: lang === 'fa' ? 'آگهی‌های خدمات ثبت‌شده' : 'Marketplace Listings',
              value: formatNumber(advertisements.length, lang),
              sub: `${formatNumber(totalViews, lang)} ${lang === 'fa' ? 'بازدید کل' : 'total views'}`,
            },
            {
              icon: Layers,
              label: lang === 'fa' ? 'دسته‌بندی‌های فعال' : 'Active Categories',
              value: formatNumber(
                categories.filter((c) => c.active !== false).length,
                lang
              ),
              sub: `${formatNumber(categories.length, lang)} ${lang === 'fa' ? 'کل دسته‌ها' : 'total'}`,
            },
            {
              icon: Star,
              label: lang === 'fa' ? 'میانگین رضایت کل سایت' : 'Platform CSAT Rating',
              value: `${avgRating} ★`,
              sub: `${formatNumber(reviews.length, lang)} ${lang === 'fa' ? 'دیدگاه فعال' : 'reviews'}`,
            },
            {
              icon: AlertTriangle,
              label: lang === 'fa' ? 'تیکت‌ها و گزارش‌های باز' : 'Open Support Reports',
              value: formatNumber(
                supportTickets.filter((t) => t.status !== 'resolved').length,
                lang
              ),
              sub: lang === 'fa' ? 'پایش واحد اعتماد و ایمنی' : 'Trust & Safety queue',
            },
            {
              icon: TrendingUp,
              label: lang === 'fa' ? 'ارتباطات مستقیم شکل‌گرفته' : 'Direct Connections',
              value: formatNumber(allConversations.length * 48 + 540, lang),
              sub: lang === 'fa' ? 'نرخ پاسخ‌گویی ۹۶.۴٪' : '96.4% response rate',
            },
          ].map((kpi, idx) => {
            const IconComp = kpi.icon;
            return (
              <Grid key={idx} size={{ xs: 6, md: 4, lg: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 3.5,
                    border: '1px solid rgba(17,18,15,0.08)',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: '#F6F5F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={16} />
                    </Box>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#289e67' }}>
                      {kpi.sub}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '1.38rem', fontWeight: 800 }}>
                    {kpi.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666860', fontWeight: 600 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* 6 Dedicated Admin Management Tabs */}
        <Box sx={{ borderBottom: '1px solid rgba(17,18,15,0.1)', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { fontWeight: 800, fontSize: '0.84rem', minHeight: 46 },
              '& .Mui-selected': { color: '#11120F !important' },
              '& .MuiTabs-indicator': { bgcolor: '#11120F', height: 3 },
            }}
          >
            <Tab label={lang === 'fa' ? 'آمار کلان و رشد' : 'Analytics & Overview'} />
            <Tab
              label={
                lang === 'fa'
                  ? `کاربران و احراز هویت (${formatNumber(crmDirectory.length, lang)})`
                  : `Users & Verification (${crmDirectory.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `نظارت آگهی‌ها (${formatNumber(advertisements.length, lang)})`
                  : `Listings Moderation (${advertisements.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `مدیریت دسته‌بندی‌ها (${formatNumber(categories.length, lang)})`
                  : `Categories (${categories.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `دیدگاه‌ها و گزارش‌ها (${formatNumber(reviews.length, lang)})`
                  : `Reviews & Reports (${reviews.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `مدیریت پشتیبانی (${formatNumber(supportTickets.length, lang)})`
                  : `Support & Escalations (${supportTickets.length})`
              }
            />
          </Tabs>
        </Box>

        {/* TAB 0: ANALYTICS & VISUAL CHARTS */}
        {tab === 0 && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.2, md: 3 },
                  borderRadius: 4,
                  border: '1px solid rgba(17,18,15,0.08)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
                  {lang === 'fa'
                    ? 'روند ۶ ماهه پیوند مستقیم کاربران و رشد اعضا'
                    : '6-Month Direct Connections & User Growth'}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#666860', mb: 2.5 }}>
                  {lang === 'fa'
                    ? 'ستون لیمویی: ارتباطات موفق شکل‌گرفته • ستون تیره: اعضای جدید'
                    : 'Lime: People Connected • Charcoal: New Registered Members'}
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: { xs: 1, sm: 2 },
                    alignItems: 'end',
                    height: 230,
                    pt: 3,
                    px: 1,
                    borderBottom: '1px solid rgba(17,18,15,0.1)',
                  }}
                >
                  {monthlyGrowth.map((m, i) => {
                    const connHeight = Math.round((m.connections / 600) * 175);
                    const userHeight = Math.round((m.newUsers / 600) * 175);
                    return (
                      <Stack key={i} alignItems="center" spacing={0.8}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800 }}>
                          {formatNumber(m.connections, lang)}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="flex-end">
                          <Box
                            sx={{
                              width: { xs: 14, sm: 22 },
                              height: connHeight,
                              borderRadius: '6px 6px 2px 2px',
                              bgcolor: '#C7F36B',
                              border: '1px solid #11120F',
                            }}
                            title={`Connections: ${m.connections}`}
                          />
                          <Box
                            sx={{
                              width: { xs: 14, sm: 22 },
                              height: userHeight,
                              borderRadius: '6px 6px 2px 2px',
                              bgcolor: '#11120F',
                            }}
                            title={`New Users: ${m.newUsers}`}
                          />
                        </Stack>
                      </Stack>
                    );
                  })}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    textAlign: 'center',
                    mt: 1,
                  }}
                >
                  {monthlyGrowth.map((m, i) => (
                    <Typography
                      key={i}
                      sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#464841' }}
                    >
                      {lang === 'fa' ? m.monthFa : m.monthEn}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.2, md: 3 },
                  borderRadius: 4,
                  border: '1px solid rgba(17,18,15,0.08)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem', mb: 2 }}>
                  {lang === 'fa'
                    ? 'سهم بازدید و تقاضا به تفکیک دسته‌بندی'
                    : 'Demand Share by Service Category'}
                </Typography>

                <Stack spacing={1.6}>
                  {categoryBreakdown.slice(0, 6).map((cat) => (
                    <Box key={cat.id}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ fontSize: '0.8rem', mb: 0.5 }}
                      >
                        <span style={{ fontWeight: 700 }}>{cat.name}</span>
                        <span style={{ color: '#666860' }}>
                          {formatNumber(cat.views, lang)}{' '}
                          {lang === 'fa' ? 'بازدید' : 'views'} ({formatNumber(cat.count, lang)}{' '}
                          {lang === 'fa' ? 'آگهی' : 'ads'})
                        </span>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={cat.pct}
                        sx={{
                          height: 8,
                          borderRadius: 99,
                          bgcolor: '#EEEDE6',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#11120F',
                            borderRadius: 99,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: USERS, SPECIALISTS CRM & VERIFICATION */}
        {tab === 1 && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  border: '1px solid rgba(17,18,15,0.08)',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={1.2}
                  sx={{ mb: 1.8 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.4,
                      py: 0.65,
                      borderRadius: 2.5,
                      bgcolor: '#F6F5F0',
                      flex: 1,
                    }}
                  >
                    <Search size={15} color="#666860" />
                    <input
                      value={crmSearch}
                      onChange={(e) => setCrmSearch(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'جستجو در کاربران و متخصصان (نام، ایمیل، نقش)...'
                          : 'Search users & specialists (name, email, role)...'
                      }
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.83rem',
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {[
                      { id: 'all', label: lang === 'fa' ? 'همه' : 'All' },
                      { id: 'professional', label: lang === 'fa' ? 'متخصصان' : 'Providers' },
                      { id: 'customer', label: lang === 'fa' ? 'کارفرمایان' : 'Customers' },
                      { id: 'operator', label: lang === 'fa' ? 'اپراتورها' : 'Operators' },
                    ].map((rf) => (
                      <button
                        key={rf.id}
                        type="button"
                        onClick={() => setCrmRoleFilter(rf.id)}
                        className={`owj-btn owj-btn--sm ${
                          crmRoleFilter === rf.id ? 'owj-btn--dark' : 'owj-btn--ghost'
                        }`}
                      >
                        {rf.label}
                      </button>
                    ))}
                  </Stack>
                </Stack>

                <Stack spacing={1} sx={{ maxHeight: 520, overflowY: 'auto' }}>
                  {filteredCrm.map((c) => {
                    const active = selectedContact?.id === c.id;
                    const loc = getLocationById(c.locationId);
                    return (
                      <Box
                        key={c.id}
                        onClick={() => handleSelectContact(c)}
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          cursor: 'pointer',
                          bgcolor: active ? '#11120F' : '#F6F5F0',
                          color: active ? '#F6F5F0' : '#11120F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.5,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar src={c.avatar} alt={l(c.name)} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Stack direction="row" spacing={0.6} alignItems="center">
                              <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>
                                {l(c.name)}
                              </Typography>
                              {c.verified && <BadgeCheck size={14} color="#289e67" />}
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: '0.74rem',
                                color: active ? 'rgba(246,245,240,0.68)' : '#666860',
                              }}
                              dir="ltr"
                            >
                              {c.email}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Chip
                            size="small"
                            label={c.role.toUpperCase()}
                            sx={{
                              height: 20,
                              fontSize: '0.63rem',
                              fontWeight: 800,
                              bgcolor: active
                                ? 'rgba(199,243,107,0.22)'
                                : 'rgba(17,18,15,0.08)',
                              color: active ? '#C7F36B' : '#11120F',
                            }}
                          />
                          <Chip
                            size="small"
                            label={c.crmStage}
                            sx={{
                              height: 20,
                              fontSize: '0.63rem',
                              fontWeight: 800,
                              bgcolor: '#C7F36B',
                              color: '#11120F',
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: active ? 'rgba(246,245,240,0.68)' : '#666860',
                            }}
                          >
                            {l(loc.name)}
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 4.5 }}>
              {selectedContact && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: '1px solid rgba(17,18,15,0.09)',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                      src={selectedContact.avatar}
                      alt={l(selectedContact.name)}
                      sx={{ width: 54, height: 54 }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
                        {l(selectedContact.name)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#666860' }} dir="ltr">
                        {selectedContact.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#F6F5F0' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#666860' }}>
                          {lang === 'fa' ? 'آگهی‌های ثبت‌شده' : 'Published Ads'}
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                          {formatNumber(selectedContact.adsCount, lang)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#F6F5F0' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#666860' }}>
                          {lang === 'fa' ? 'گفتگوهای فعال' : 'Conversations'}
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                          {formatNumber(selectedContact.messagesCount, lang)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="owj-btn owj-btn--outline owj-btn--sm"
                    >
                      <Mail size={13} />
                      <span>{lang === 'fa' ? 'ارسال ایمیل مستقیم' : 'Send Email'}</span>
                    </a>
                    {selectedContact.proId && (
                      <>
                        <Link
                          to={`/professionals/${selectedContact.proId}`}
                          className="owj-btn owj-btn--outline owj-btn--sm"
                        >
                          <ExternalLink size={13} />
                          <span>{lang === 'fa' ? 'پروفایل عمومی' : 'Public Profile'}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSpecialistVerified(
                              selectedContact.proId,
                              selectedContact.verified
                            )
                          }
                          className="owj-btn owj-btn--dark owj-btn--sm"
                        >
                          <BadgeCheck size={13} color="#C7F36B" />
                          <span>
                            {selectedContact.verified
                              ? lang === 'fa'
                                ? 'لغو تیک تایید'
                                : 'Revoke Badge'
                              : lang === 'fa'
                              ? 'اعطای تیک تایید'
                              : 'Verify Pro'}
                          </span>
                        </button>
                      </>
                    )}
                  </Stack>

                  <Divider sx={{ my: 1.6 }} />

                  <Box sx={{ mb: 1.4 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                      {lang === 'fa' ? 'برچسب وضعیت CRM' : 'CRM Lifecycle Stage'}
                    </label>
                    <select
                      value={stageDraft}
                      onChange={(e) => setStageDraft(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                        background: '#FFFFFF',
                      }}
                    >
                      <option value="VIP">VIP / Strategic</option>
                      <option value="Verified">Verified Partner</option>
                      <option value="Active">Active Member</option>
                      <option value="Follow-Up">Needs Follow-Up</option>
                    </select>
                  </Box>

                  <Box sx={{ mb: 1.6 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                      {lang === 'fa'
                        ? 'یادداشت مدیریتی CRM (ویژه ادمین)'
                        : 'Internal Admin CRM Notes'}
                    </label>
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'یادداشت پیگیری یا سوابق همکاری این کاربر...'
                          : 'Record relationship notes or account context...'
                      }
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </Box>

                  <button
                    type="button"
                    onClick={handleSaveCrmRecord}
                    className="owj-btn owj-btn--lime owj-btn--sm"
                    style={{ width: '100%' }}
                  >
                    <Save size={14} />
                    <span>{lang === 'fa' ? 'ذخیره پرونده CRM' : 'Save CRM Record'}</span>
                  </button>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {/* TAB 2: ALL MARKETPLACE LISTINGS MODERATION */}
        {tab === 2 && (
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(17,18,15,0.08)' }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                {[
                  { id: 'all', label: lang === 'fa' ? 'همه آگهی‌ها' : 'All' },
                  { id: 'active', label: lang === 'fa' ? 'فعال' : 'Active' },
                  { id: 'paused', label: lang === 'fa' ? 'متوقف' : 'Paused' },
                  { id: 'featured', label: lang === 'fa' ? 'منتخب' : 'Featured' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAdStatusFilter(f.id)}
                    className={`owj-btn owj-btn--sm ${
                      adStatusFilter === f.id ? 'owj-btn--dark' : 'owj-btn--ghost'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </Stack>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.4,
                  py: 0.6,
                  borderRadius: 2.5,
                  bgcolor: '#F6F5F0',
                  minWidth: { xs: 0, sm: 250 },
                }}
              >
                <Search size={15} color="#666860" />
                <input
                  value={adSearch}
                  onChange={(e) => setAdSearch(e.target.value)}
                  placeholder={lang === 'fa' ? 'جستجوی عنوان آگهی...' : 'Filter listings...'}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                  }}
                />
              </Box>
            </Stack>

            <Stack spacing={1.1}>
              {filteredAds.map((ad) => {
                const cat =
                  categories.find((c) => c.id === ad.categoryId) ||
                  getCategoryById(ad.categoryId);
                return (
                  <Box
                    key={ad.id}
                    sx={{
                      p: 1.6,
                      borderRadius: 3,
                      bgcolor: '#F6F5F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 220, flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.3 }}>
                        <Chip
                          size="small"
                          label={
                            ad.status === 'paused'
                              ? lang === 'fa'
                                ? 'متوقف'
                                : 'Paused'
                              : lang === 'fa'
                              ? 'فعال'
                              : 'Active'
                          }
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor:
                              ad.status === 'paused'
                                ? 'rgba(229,153,52,0.2)'
                                : 'rgba(40,158,103,0.18)',
                          }}
                        />
                        {ad.featured && (
                          <Chip
                            size="small"
                            label={lang === 'fa' ? 'منتخب' : 'Featured'}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              bgcolor: '#C7F36B',
                              color: '#11120F',
                            }}
                          />
                        )}
                        <Typography sx={{ fontSize: '0.74rem', color: '#666860' }}>
                          {l(cat.name)} • {formatNumber(ad.views || 0, lang)}{' '}
                          {lang === 'fa' ? 'بازدید' : 'views'}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.92rem' }}>
                        {l(ad.title)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#464841' }}>
                        {formatPrice(ad, lang)}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Link
                        to={`/services/${ad.id}`}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        <Eye size={13} />
                        <span>{lang === 'fa' ? 'مشاهده' : 'View'}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          updateAd(ad.id, { featured: !ad.featured });
                          showToast({
                            title: !ad.featured
                              ? lang === 'fa'
                                ? 'آگهی به منتخب‌ها اضافه شد'
                                : 'Marked as Featured'
                              : lang === 'fa'
                              ? 'نشان منتخب برداشته شد'
                              : 'Removed from Featured',
                            type: 'info',
                          });
                        }}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        <Sparkles size={13} />
                        <span>
                          {ad.featured
                            ? lang === 'fa'
                              ? 'حذف از منتخب'
                              : 'Unfeature'
                            : lang === 'fa'
                            ? 'منتخب کردن'
                            : 'Feature'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateAd(ad.id, {
                            status: ad.status === 'paused' ? 'active' : 'paused',
                          })
                        }
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        {ad.status === 'paused' ? (
                          <PlayCircle size={13} />
                        ) : (
                          <PauseCircle size={13} />
                        )}
                        <span>
                          {ad.status === 'paused'
                            ? lang === 'fa'
                              ? 'فعال‌سازی'
                              : 'Activate'
                            : lang === 'fa'
                            ? 'توقف موقت'
                            : 'Pause'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteAd(ad.id);
                          showToast({
                            title: lang === 'fa' ? 'آگهی حذف شد' : 'Listing removed',
                            type: 'info',
                          });
                        }}
                        className="owj-btn owj-btn--danger owj-btn--sm"
                        aria-label="Delete listing"
                      >
                        <Trash2 size={13} />
                      </button>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        )}

        {/* TAB 3: CATEGORY MANAGEMENT */}
        {tab === 3 && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 4.5 }}>
              <Paper
                elevation={0}
                component="form"
                onSubmit={handleAddCategorySubmit}
                sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(17,18,15,0.08)' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', mb: 1.6 }}>
                  {lang === 'fa' ? 'افزودن دسته‌بندی جدید' : 'Create New Category'}
                </Typography>

                <Stack spacing={1.3}>
                  <Box>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      {lang === 'fa' ? 'عنوان فارسی' : 'Persian Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatFa}
                      onChange={(e) => setNewCatFa(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'مثلاً: مشاوره حقوقی و قرارداد'
                          : 'Persian category title...'
                      }
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </Box>

                  <Box>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      {lang === 'fa' ? 'عنوان انگلیسی' : 'English Title'}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={newCatEn}
                      onChange={(e) => setNewCatEn(e.target.value)}
                      placeholder="e.g. Legal & Advisory"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </Box>

                  <Box>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      {lang === 'fa' ? 'توضیح کوتاه فارسی' : 'Persian Tagline'}
                    </label>
                    <input
                      type="text"
                      value={newTagFa}
                      onChange={(e) => setNewTagFa(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </Box>

                  <Box>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      {lang === 'fa' ? 'توضیح کوتاه انگلیسی' : 'English Tagline'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newTagEn}
                      onChange={(e) => setNewTagEn(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </Box>

                  <Box>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      {lang === 'fa' ? 'آیکون دسته' : 'Category Icon'}
                    </label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.62rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(17,18,15,0.15)',
                        background: '#FFFFFF',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="Sparkles">Sparkles</option>
                      <option value="Briefcase">Briefcase</option>
                      <option value="Code2">Code2</option>
                      <option value="Building2">Building2</option>
                      <option value="Wrench">Wrench</option>
                      <option value="GraduationCap">GraduationCap</option>
                    </select>
                  </Box>

                  <button type="submit" className="owj-btn owj-btn--lime owj-btn--sm">
                    <Plus size={14} />
                    <span>{lang === 'fa' ? 'ایجاد دسته‌بندی' : 'Add Category'}</span>
                  </button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Paper
                elevation={0}
                sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(17,18,15,0.08)' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', mb: 1.8 }}>
                  {lang === 'fa'
                    ? 'مدیریت دسته‌بندی‌های بازارگاه'
                    : 'Manage Marketplace Categories'}
                </Typography>

                <Stack spacing={1.1}>
                  {categories.map((cat) => {
                    const isActive = cat.active !== false;
                    const count = advertisements.filter((a) => a.categoryId === cat.id).length;
                    const isEditing = editingCatId === cat.id;

                    return (
                      <Box
                        key={cat.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: '#F6F5F0',
                          opacity: isActive ? 1 : 0.65,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          flexWrap="wrap"
                          gap={1.2}
                        >
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2.2,
                                bgcolor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CategoryIcon name={cat.icon} size={18} />
                            </Box>
                            <Box>
                              <Stack direction="row" spacing={0.8} alignItems="center">
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                                  {l(cat.name)}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={
                                    isActive
                                      ? lang === 'fa'
                                        ? 'فعال'
                                        : 'Active'
                                      : lang === 'fa'
                                      ? 'مخفی'
                                      : 'Hidden'
                                  }
                                  sx={{
                                    height: 19,
                                    fontSize: '0.64rem',
                                    fontWeight: 800,
                                    bgcolor: isActive
                                      ? 'rgba(40,158,103,0.18)'
                                      : 'rgba(17,18,15,0.1)',
                                  }}
                                />
                              </Stack>
                              <Typography sx={{ fontSize: '0.75rem', color: '#666860' }}>
                                {formatNumber(count, lang)}{' '}
                                {lang === 'fa' ? 'آگهی ثبت‌شده' : 'listings'} •{' '}
                                {formatNumber((cat.subcategories || []).length, lang)}{' '}
                                {lang === 'fa' ? 'زیردسته' : 'subcategories'}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={0.7}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(isEditing ? null : cat.id);
                                setEditCatFa(cat.name?.fa || '');
                                setEditCatEn(cat.name?.en || '');
                              }}
                              className="owj-btn owj-btn--outline owj-btn--sm"
                            >
                              {lang === 'fa' ? 'ویرایش نام' : 'Rename'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                toggleCategoryActive(cat.id);
                                showToast({
                                  title: isActive
                                    ? lang === 'fa'
                                      ? 'دسته‌بندی مخفی شد'
                                      : 'Category Hidden'
                                    : lang === 'fa'
                                    ? 'دسته‌بندی فعال شد'
                                    : 'Category Enabled',
                                  type: 'info',
                                });
                              }}
                              className="owj-btn owj-btn--dark owj-btn--sm"
                            >
                              {isActive
                                ? lang === 'fa'
                                  ? 'غیرفعال‌سازی'
                                  : 'Disable'
                                : lang === 'fa'
                                ? 'فعال‌سازی'
                                : 'Enable'}
                            </button>
                          </Stack>
                        </Stack>

                        {isEditing && (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            sx={{ mt: 1.2, pt: 1.2, borderTop: '1px solid rgba(17,18,15,0.08)' }}
                          >
                            <input
                              type="text"
                              value={editCatFa}
                              onChange={(e) => setEditCatFa(e.target.value)}
                              placeholder={lang === 'fa' ? 'نام فارسی' : 'Persian Name'}
                              style={{
                                flex: 1,
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(17,18,15,0.16)',
                                background: '#FFFFFF',
                                fontSize: '0.82rem',
                              }}
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={editCatEn}
                              onChange={(e) => setEditCatEn(e.target.value)}
                              placeholder="English Name"
                              style={{
                                flex: 1,
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(17,18,15,0.16)',
                                background: '#FFFFFF',
                                fontSize: '0.82rem',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCategoryEdit(cat.id)}
                              className="owj-btn owj-btn--lime owj-btn--sm"
                            >
                              <Save size={13} />
                              <span>{lang === 'fa' ? 'ذخیره' : 'Save'}</span>
                            </button>
                          </Stack>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 4: REVIEWS & REPORTS MODERATION */}
        {tab === 4 && (
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(17,18,15,0.08)' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
                {lang === 'fa'
                  ? 'نظارت بر دیدگاه‌های کاربران و حذف محتوای نامناسب'
                  : 'Customer Reviews & Content Moderation'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.4,
                  py: 0.6,
                  borderRadius: 2.5,
                  bgcolor: '#F6F5F0',
                  minWidth: { xs: 0, sm: 250 },
                }}
              >
                <Search size={15} color="#666860" />
                <input
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder={lang === 'fa' ? 'جستجو در دیدگاه‌ها...' : 'Search reviews...'}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                  }}
                />
              </Box>
            </Stack>

            <Stack spacing={1.2}>
              {filteredReviews.map((rev) => {
                const targetAd = advertisements.find((a) => a.id === rev.adId);
                return (
                  <Box
                    key={rev.id}
                    sx={{
                      p: 1.7,
                      borderRadius: 3,
                      bgcolor: '#F6F5F0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 220 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>
                          {l(rev.author || rev.authorName)}
                        </Typography>
                        <span style={{ color: '#E59934', fontWeight: 800, fontSize: '0.84rem' }}>
                          ★ {rev.rating}.0
                        </span>
                        {targetAd && (
                          <Link
                            to={`/services/${targetAd.id}`}
                            style={{ fontSize: '0.76rem', color: '#464841', textDecoration: 'underline' }}
                          >
                            {l(targetAd.title)}
                          </Link>
                        )}
                      </Stack>
                      <Typography sx={{ fontSize: '0.86rem', color: '#232620' }}>
                        {l(rev.comment)}
                      </Typography>
                    </Box>

                    <button
                      type="button"
                      onClick={() => {
                        deleteReview(rev.id);
                        showToast({
                          title: lang === 'fa' ? 'دیدگاه حذف شد' : 'Review Removed',
                          type: 'info',
                        });
                      }}
                      className="owj-btn owj-btn--danger owj-btn--sm"
                    >
                      <Trash2 size={13} />
                      <span>{lang === 'fa' ? 'حذف دیدگاه' : 'Delete'}</span>
                    </button>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        )}

        {/* TAB 5: SUPPORT & ESCALATIONS MANAGEMENT */}
        {tab === 5 && (
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(17,18,15,0.08)' }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
                {lang === 'fa'
                  ? 'مدیریت تیکت‌ها، پرونده‌های ارجاع‌شده و پاسخ مستقیم ادمین'
                  : 'Support Oversight & Escalated Tickets'}
              </Typography>
              <Link to="/operator" className="owj-btn owj-btn--dark owj-btn--sm">
                <Headset size={14} color="#C7F36B" />
                <span>
                  {lang === 'fa' ? 'کنسول کامل اپراتور' : 'Full Operator Console'}
                </span>
              </Link>
            </Stack>

            <Stack spacing={1.5}>
              {sortedSupportTickets.map((t) => {
                const isEscalated = t.status === 'escalated';
                return (
                  <Box
                    key={t.id}
                    sx={{
                      p: 2,
                      borderRadius: 3.5,
                      bgcolor: isEscalated ? 'rgba(217,72,72,0.07)' : '#F6F5F0',
                      border: isEscalated
                        ? '1.5px solid rgba(217,72,72,0.35)'
                        : '1px solid rgba(17,18,15,0.06)',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ mb: 0.8 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip
                          size="small"
                          label={t.id}
                          sx={{ bgcolor: '#11120F', color: '#C7F36B', fontWeight: 800 }}
                        />
                        <Chip
                          size="small"
                          label={t.status.toUpperCase()}
                          sx={{
                            fontWeight: 800,
                            bgcolor: isEscalated
                              ? 'rgba(217,72,72,0.18)'
                              : 'rgba(17,18,15,0.08)',
                            color: isEscalated ? '#b83232' : '#11120F',
                          }}
                        />
                        <Typography sx={{ fontSize: '0.76rem', color: '#666860' }}>
                          {l(t.reporterName)} ({t.reporterEmail || 'N/A'}) •{' '}
                          {formatRelativeDate(t.updatedAt, lang)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.7}>
                        {t.relatedAdId && (
                          <Link
                            to={`/services/${t.relatedAdId}`}
                            className="owj-btn owj-btn--outline owj-btn--sm"
                          >
                            <ExternalLink size={13} />
                            <span>{lang === 'fa' ? 'آگهی مرتبط' : 'Reported Ad'}</span>
                          </Link>
                        )}
                        {t.status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => updateSupportTicketStatus(t.id, 'resolved')}
                            className="owj-btn owj-btn--dark owj-btn--sm"
                          >
                            <CheckCircle2 size={13} color="#C7F36B" />
                            <span>{lang === 'fa' ? 'بستن پرونده' : 'Resolve'}</span>
                          </button>
                        )}
                      </Stack>
                    </Stack>

                    <Typography sx={{ fontWeight: 800, fontSize: '0.94rem', mb: 0.6 }}>
                      {l(t.subject)}
                    </Typography>

                    {t.escalationReason && (
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#b83232',
                          mb: 1,
                        }}
                      >
                        {lang === 'fa' ? 'علت ارجاع اپراتور: ' : 'Escalation Note: '}
                        {l(t.escalationReason)}
                      </Typography>
                    )}

                    {/* Inline Admin Reply */}
                    {t.status !== 'resolved' && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                        <input
                          type="text"
                          value={adminReplyDrafts[t.id] || ''}
                          onChange={(e) =>
                            setAdminReplyDrafts((prev) => ({
                              ...prev,
                              [t.id]: e.target.value,
                            }))
                          }
                          placeholder={
                            lang === 'fa'
                              ? 'پاسخ مستقیم مدیر ارشد در این پرونده...'
                              : 'Write direct Admin response...'
                          }
                          style={{
                            flex: 1,
                            padding: '0.58rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(17,18,15,0.16)',
                            background: '#FFFFFF',
                            fontSize: '0.83rem',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAdminTicketReply(t.id, true)}
                          className="owj-btn owj-btn--lime owj-btn--sm"
                        >
                          <Send size={13} />
                          <span>
                            {lang === 'fa' ? 'ارسال پاسخ و بستن' : 'Reply & Resolve'}
                          </span>
                        </button>
                      </Stack>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        )}
      </Container>
    </PageTransition>
  );
}
