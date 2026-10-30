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
  ShieldCheck,
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
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatNumber, formatPrice } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const { lang, l } = useLanguage();
  const { user, allUsers, adminUpdateUser } = useAuth();
  const {
    advertisements,
    professionals,
    reviews,
    allConversations,
    supportTickets,
    updateAd,
    deleteAd,
    adminUpdateSpecialist,
  } = useMarketplace();
  const { showToast } = useToast();

  const [tab, setTab] = useState(0);

  // CRM State
  const [crmSearch, setCrmSearch] = useState('');
  const [crmRoleFilter, setCrmRoleFilter] = useState('all');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [stageDraft, setStageDraft] = useState('Active');

  // Listings Moderation Search
  const [adSearch, setAdSearch] = useState('');

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
        verified: u.emailVerified,
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
      message: selectedContact.name.split('|')[0].trim(),
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
    if (!advertisements.length) return '4.9';
    const avg =
      advertisements.reduce((sum, a) => sum + Number(a.rating || 4.9), 0) /
      advertisements.length;
    return avg.toFixed(2);
  }, [advertisements]);

  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catAds = advertisements.filter((a) => a.categoryId === cat.id);
      const views = catAds.reduce((s, a) => s + (a.views || 0), 0);
      return {
        id: cat.id,
        name: l(cat.name),
        count: catAds.length,
        views,
        pct: Math.min(100, Math.round((views / Math.max(1, totalViews)) * 100 * 2.2)),
      };
    }).sort((a, b) => b.views - a.views);
  }, [advertisements, totalViews, l]);

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
    if (!q) return advertisements;
    return advertisements.filter((a) =>
      `${a.title?.fa || ''} ${a.title?.en || ''}`.toLowerCase().includes(q)
    );
  }, [advertisements, adSearch]);

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
                    ? 'مرکز فرماندهی و CRM اوجیفای — ماهان اوجی'
                    : 'OWJIFY Executive Admin & CRM — Mahan Owji'}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(246,245,240,0.72)' }}>
                  mahanowji1380@gmail.com •{' '}
                  {lang === 'fa'
                    ? 'پایش زنده آمار، کاربران، متخصصان، آگهی‌ها و گزارش‌ها'
                    : 'Live Platform Statistics, User CRM, Listings & Support Oversight'}
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
              label: lang === 'fa' ? 'آگهی‌های خدمات فعال' : 'Marketplace Listings',
              value: formatNumber(advertisements.length, lang),
              sub: `${formatNumber(totalViews, lang)} ${lang === 'fa' ? 'بازدید کل' : 'total views'}`,
            },
            {
              icon: MessageSquare,
              label: lang === 'fa' ? 'ارتباطات مستقیم شکل‌گرفته' : 'Direct Connections',
              value: formatNumber(allConversations.length * 48 + 540, lang),
              sub: lang === 'fa' ? 'پیوند مستقیم انسان‌ها' : 'People connected',
            },
            {
              icon: Star,
              label: lang === 'fa' ? 'میانگین رضایت کل سایت' : 'Platform CSAT Rating',
              value: `${avgRating} ★`,
              sub: `${formatNumber(reviews.length, lang)} ${lang === 'fa' ? 'دیدگاه ثبت‌شده' : 'verified reviews'}`,
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
              label: lang === 'fa' ? 'نرخ پاسخ‌گویی متخصصان' : 'Specialist Response Rate',
              value: lang === 'fa' ? '۹۶.۴٪' : '96.4%',
              sub: lang === 'fa' ? 'میانگین زیر ۲۵ دقیقه' : 'Avg under 25 mins',
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

        {/* Admin Module Tabs */}
        <Box sx={{ borderBottom: '1px solid rgba(17,18,15,0.1)', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { fontWeight: 800, fontSize: '0.86rem', minHeight: 46 },
              '& .Mui-selected': { color: '#11120F !important' },
              '& .MuiTabs-indicator': { bgcolor: '#11120F', height: 3 },
            }}
          >
            <Tab
              label={
                lang === 'fa'
                  ? 'آمار کلان و نمودار رشد پلتفرم'
                  : 'Analytics & Growth Charts'
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `CRM جامع کاربران و متخصصان (${formatNumber(crmDirectory.length, lang)})`
                  : `Full Website CRM (${crmDirectory.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `مدیریت کل آگهی‌ها (${formatNumber(advertisements.length, lang)})`
                  : `All Listings (${advertisements.length})`
              }
            />
            <Tab
              label={
                lang === 'fa'
                  ? `گزارش‌ها و تیکت‌های پشتیبانی (${formatNumber(supportTickets.length, lang)})`
                  : `Support Reports (${supportTickets.length})`
              }
            />
          </Tabs>
        </Box>

        {/* TAB 0: ANALYTICS & VISUAL CHARTS */}
        {tab === 0 && (
          <Grid container spacing={2.5}>
            {/* 6-Month Growth Visual Bar Chart */}
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
                      {lang === 'fa'
                        ? 'روند ۶ ماهه پیوند مستقیم کاربران و رشد اعضا'
                        : '6-Month Direct Connections & User Growth'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#666860' }}>
                      {lang === 'fa'
                        ? 'ستون لیمویی: ارتباطات موفق شکل‌گرفته • ستون تیره: اعضای جدید'
                        : 'Lime: People Connected • Charcoal: New Registered Members'}
                    </Typography>
                  </Box>
                </Stack>

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

            {/* Category Demand Distribution */}
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

        {/* TAB 1: FULL WEBSITE CRM */}
        {tab === 1 && (
          <Grid container spacing={2.5}>
            {/* CRM Contact Table/List */}
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
                          ? 'جستجو در کل CRM (نام، ایمیل، نقش، برچسب)...'
                          : 'Search CRM contacts (name, email, role, stage)...'
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
                          <Avatar src={c.avatar} alt={c.name} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Stack direction="row" spacing={0.6} alignItems="center">
                              <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>
                                {c.name.split('|')[0].trim()}
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

            {/* Right CRM Profile Inspector & Notes Editor */}
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
                      alt={selectedContact.name}
                      sx={{ width: 54, height: 54 }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
                        {selectedContact.name}
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

                  {/* CRM Stage & Notes */}
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
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
                {lang === 'fa'
                  ? 'نظارت و مدیریت کلیه آگهی‌های ثبت‌شده در سایت'
                  : 'Global Marketplace Listings Moderation'}
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
                  minWidth: 250,
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
                const cat = getCategoryById(ad.categoryId);
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

                    <Stack direction="row" spacing={0.7} alignItems="center">
                      <Link
                        to={`/services/${ad.id}`}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        <Eye size={13} />
                        <span>{lang === 'fa' ? 'مشاهده' : 'View'}</span>
                      </Link>
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

        {/* TAB 3: SUPPORT REPORTS & TICKET OVERSIGHT */}
        {tab === 3 && (
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
                  ? 'نمای مدیریتی گزارش‌های کاربران و عملکرد اپراتورها'
                  : 'Platform Reports & Support SLA Monitor'}
              </Typography>
              <Link to="/operator" className="owj-btn owj-btn--dark owj-btn--sm">
                <Headset size={14} color="#C7F36B" />
                <span>
                  {lang === 'fa' ? 'ورود به میز پاسخ‌گویی اپراتور' : 'Open Operator Desk'}
                </span>
              </Link>
            </Stack>

            <Stack spacing={1.2}>
              {supportTickets.map((t) => (
                <Box
                  key={t.id}
                  sx={{
                    p: 1.8,
                    borderRadius: 3,
                    bgcolor: '#F6F5F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                      <Chip
                        size="small"
                        label={t.id}
                        sx={{ bgcolor: '#11120F', color: '#C7F36B', fontWeight: 800 }}
                      />
                      <Chip size="small" label={t.status.toUpperCase()} sx={{ fontWeight: 700 }} />
                      <Typography sx={{ fontSize: '0.76rem', color: '#666860' }}>
                        {t.reporterName} ({t.reporterEmail})
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem' }}>
                      {l(t.subject)}
                    </Typography>
                  </Box>
                  <Link
                    to="/operator"
                    className="owj-btn owj-btn--outline owj-btn--sm"
                  >
                    <span>{lang === 'fa' ? 'بررسی و پاسخ' : 'Inspect & Reply'}</span>
                  </Link>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </PageTransition>
  );
}
