import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Grid, Stack, Tabs, Tab, Box, Chip } from '@mui/material';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  Clock,
  Briefcase,
  Heart,
  Star,
  Plus,
  Sparkles,
  Compass,
  Eye,
  MessageSquare,
  Edit3,
  PauseCircle,
  PlayCircle,
  Trash2,
  UserCog,
  Settings,
  Bell,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import StatCard from '../../components/dashboard/StatCard';
import ServiceCard from '../../components/marketplace/ServiceCard';
import ProfessionalCard from '../../components/profile/ProfessionalCard';
import Modal from '../../components/common/Modal';
import { getCategoryById } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatNumber, formatRelativeTime } from '../../utils/formatters';
import styles from './DashboardPage.module.scss';

export default function DashboardPage() {
  const { lang, l } = useLanguage();
  const { user, isProfessional } = useAuth();
  const {
    advertisements,
    professionals,
    reviews,
    favoriteAds,
    favoritePros,
    conversations,
    skillRequests,
    openSkillRequestModal,
    inquiries,
    unreadMessagesCount,
    toggleAdvertisementStatus,
    deleteAdvertisement,
    updateInquiryStatus,
    updateProfessionalAvailability,
    addPortfolioProject,
    deletePortfolioProject,
    replyToReview,
  } = useMarketplace();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const providerTabs = [
    { id: 'overview', icon: LayoutDashboard, fa: 'نمای کلی پنل متخصص', en: 'Provider Overview' },
    { id: 'ads', icon: Layers, fa: 'آگهی‌های خدمات من', en: 'My Advertisements' },
    { id: 'inquiries', icon: Inbox, fa: 'پیام‌ها و درخواست‌های مشتریان', en: 'Customer Inquiries' },
    { id: 'skill-requests', icon: Sparkles, fa: 'درخواست‌های مهارت من', en: 'Skill Requests' },
    { id: 'availability', icon: Clock, fa: 'مدیریت زمان حضور', en: 'Availability' },
    { id: 'portfolio', icon: Briefcase, fa: 'مدیریت پورتفولیو', en: 'Portfolio' },
    { id: 'favorites', icon: Heart, fa: 'ذخیره‌شده‌ها', en: 'Saved Items' },
    { id: 'reviews', icon: Star, fa: 'دیدگاه‌های مشتریان', en: 'Client Reviews' },
  ];

  const customerTabs = [
    { id: 'overview', icon: LayoutDashboard, fa: 'نمای کلی کارفرما', en: 'Customer Overview' },
    {
      id: 'sent-messages',
      icon: Send,
      fa: 'پیام‌های ارسالی به متخصصان',
      en: 'Sent to Providers',
    },
    { id: 'favorites', icon: Heart, fa: 'خدمات و متخصصان ذخیره‌شده', en: 'Saved Favorites' },
    { id: 'my-reviews', icon: Star, fa: 'دیدگاه‌های ثبت‌شده من', en: 'My Reviews' },
  ];

  const navItems = isProfessional ? providerTabs : customerTabs;
  const rawTab = searchParams.get('tab') || 'overview';
  const activeTab = navItems.some((item) => item.id === rawTab) ? rawTab : 'overview';
  const setTab = (t) => setSearchParams({ tab: t });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [pfTitle, setPfTitle] = useState('');
  const [pfYear, setPfYear] = useState('2026');
  const [pfSummary, setPfSummary] = useState('');
  const [pfImage, setPfImage] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
  );

  const proId = user?.proId || 'pro-1';
  const currentPro = useMemo(
    () => professionals.find((p) => p.id === proId) || professionals[0],
    [professionals, proId]
  );

  const myAds = useMemo(
    () =>
      isProfessional
        ? advertisements.filter(
            (a) => a.ownerUserId === user?.id || a.proId === user?.proId
          )
        : [],
    [advertisements, user, isProfessional]
  );

  const receivedCustomerConvs = useMemo(
    () => conversations.filter((c) => c.direction === 'received'),
    [conversations]
  );

  const sentConvs = useMemo(
    () => conversations.filter((c) => c.direction === 'sent'),
    [conversations]
  );

  const activeAdsCount = myAds.filter((a) => a.status === 'active').length;
  const totalViews = myAds.reduce((sum, a) => sum + Number(a.views || 120), 0) + 420;
  const savedAdObjects = advertisements.filter((a) => favoriteAds.includes(a.id));
  const savedProObjects = professionals.filter((p) => favoritePros.includes(p.id));
  const myProReviews = reviews.filter((r) => r.proId === proId);
  const customerWrittenReviews = useMemo(() => {
    const cleanFirst = (user?.fullName || '').split('|')[0].trim();
    return reviews.filter(
      (r) =>
        r.authorUserId === user?.id ||
        (cleanFirst && (r.author?.fa?.includes(cleanFirst) || r.author?.en?.includes(cleanFirst)))
    );
  }, [reviews, user]);

  const [availHours, setAvailHours] = useState(
    currentPro?.availability?.hours || '08:30 - 21:00'
  );
  const [availNow, setAvailNow] = useState(Boolean(currentPro?.availableNow));
  const [availUrgent, setAvailUrgent] = useState(Boolean(currentPro?.availability?.urgent));

  const handleSaveAvailability = (e) => {
    e.preventDefault();
    updateProfessionalAvailability(currentPro.id, {
      availableNow: availNow,
      hours: availHours,
      urgent: availUrgent,
    });
    showToast({
      title: lang === 'fa' ? 'برنامه زمانی به‌روز شد' : 'Availability Updated',
      type: 'success',
    });
  };

  const handleAddPortfolio = (e) => {
    e.preventDefault();
    if (!pfTitle.trim()) return;
    addPortfolioProject(currentPro.id, {
      title: pfTitle.trim(),
      year: pfYear,
      summary: pfSummary.trim(),
      image: pfImage,
    });
    setPfTitle('');
    setPfSummary('');
    showToast({
      title: lang === 'fa' ? 'نمونه کار به پورتفولیو اضافه شد' : 'Portfolio Project Added',
      type: 'success',
    });
  };

  const weeklyChart = [
    { day: { fa: 'ش', en: 'Sat' }, pct: 58 },
    { day: { fa: 'ی', en: 'Sun' }, pct: 74 },
    { day: { fa: 'د', en: 'Mon' }, pct: 66 },
    { day: { fa: 'س', en: 'Tue' }, pct: 92 },
    { day: { fa: 'چ', en: 'Wed' }, pct: 84 },
    { day: { fa: 'پ', en: 'Thu' }, pct: 78 },
    { day: { fa: 'ج', en: 'Fri' }, pct: 49 },
  ];

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 }, pb: { xs: 6, md: 9 } }}>
        {/* Role-Differentiated Top Banner */}
        <div className={styles.banner}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>
              <SmartImage src={user?.avatar} alt={user?.fullName} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 900 }}>
                {user?.fullName}
              </h1>
              <span className={styles.rolePill}>
                {isProfessional
                  ? lang === 'fa'
                    ? 'حساب ارائه‌دهنده خدمت (متخصص تاییدشده)'
                    : 'Verified Service Provider Account'
                  : lang === 'fa'
                  ? 'حساب کارفرما / مشتری'
                  : 'Customer Account'}
              </span>
            </div>
          </div>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {isProfessional ? (
              <>
                <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                  <Plus size={15} />
                  <span>{lang === 'fa' ? 'ثبت آگهی جدید' : 'Create Advertisement'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => openSkillRequestModal()}
                  className="owj-btn owj-btn--outline-light owj-btn--sm"
                >
                  <Sparkles size={15} color="#C7F36B" />
                  <span>{lang === 'fa' ? 'درخواست مهارت' : 'Request a Skill'}</span>
                </button>
              </>
            ) : (
              /* Customer Role Actions: NO Create Advertisement! */
              <>
                <Link to="/explore" className="owj-btn owj-btn--lime owj-btn--sm">
                  <Compass size={15} />
                  <span>{lang === 'fa' ? 'کاوش متخصصان' : 'Explore Providers'}</span>
                </Link>
                <Link to="/messages" className="owj-btn owj-btn--outline-light owj-btn--sm">
                  <Send size={15} />
                  <span>
                    {lang === 'fa' ? 'پیام‌های ارسالی من' : 'My Sent Messages'}
                  </span>
                </Link>
              </>
            )}

            <Link to="/profile/edit" className="owj-btn owj-btn--outline-light owj-btn--sm">
              <UserCog size={15} />
              <span>{lang === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}</span>
            </Link>
            <Link to="/settings" className="owj-btn owj-btn--outline-light owj-btn--sm">
              <Settings size={15} />
              <span>{lang === 'fa' ? 'تنظیمات' : 'Settings'}</span>
            </Link>
          </Stack>
        </div>

        {/* Mobile / Tablet Scrollable MUI Tabs */}
        <Box
          sx={{
            display: { xs: 'block', lg: 'none' },
            mb: 3,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid rgba(17,18,15,0.08)',
            px: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.86rem',
                minHeight: 48,
                color: '#666860',
              },
              '& .Mui-selected': {
                color: '#11120F !important',
              },
            }}
          >
            {navItems.map((item) => (
              <Tab key={item.id} value={item.id} label={item[lang]} />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={{ xs: 3, lg: 3.5 }} alignItems="flex-start">
          {/* Desktop Sticky Sidebar */}
          <Grid size={{ lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <nav className={styles.sideNav} aria-label="Dashboard Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`${styles.sideBtn} ${activeTab === item.id ? styles.active : ''}`}
                  >
                    <Icon size={17} />
                    <span>{item[lang]}</span>
                  </button>
                );
              })}
              <Link to="/messages" className={styles.sideBtn}>
                <MessageSquare size={17} />
                <span>
                  {isProfessional
                    ? lang === 'fa'
                      ? 'صندوق پیام‌ها (دریافتی و ارسالی)'
                      : 'Messenger (Inbox & Sent)'
                    : lang === 'fa'
                    ? 'پیام‌های ارسالی من'
                    : 'Messages Sent to Providers'}
                </span>
              </Link>
              <Link to="/notifications" className={styles.sideBtn}>
                <Bell size={17} />
                <span>{lang === 'fa' ? 'مرکز اعلان‌ها' : 'Notifications'}</span>
              </Link>
            </nav>
          </Grid>

          {/* Main Dashboard View */}
          <Grid size={{ xs: 12, lg: 9 }}>
            {/* ROLE-SPECIFIC KPI STATS */}
            {isProfessional ? (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    accent
                    label={lang === 'fa' ? 'آگهی‌های فعال من' : 'Active Advertisements'}
                    value={activeAdsCount}
                    icon={Layers}
                    trend={lang === 'fa' ? 'در حال نمایش در بازارگاه' : 'Live in Explore'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={
                      lang === 'fa'
                        ? 'پیام‌های دریافتی از مشتریان'
                        : 'Messages from Customers'
                    }
                    value={receivedCustomerConvs.length}
                    icon={Inbox}
                    trend={lang === 'fa' ? 'صندوق دریافتی' : 'Customer Inbox'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={
                      lang === 'fa'
                        ? 'پیام‌ها و درخواست‌های مهارت ارسالی'
                        : 'Sent & Skill Requests'
                    }
                    value={sentConvs.length + skillRequests.length}
                    icon={Sparkles}
                    trend={lang === 'fa' ? 'همکاری تخصصی' : 'Provider Network'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={lang === 'fa' ? 'بازدید پروفایل و خدمات' : 'Profile & Listing Views'}
                    value={totalViews}
                    icon={Eye}
                    trend="+24%"
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    accent
                    label={
                      lang === 'fa'
                        ? 'پیام‌های ارسالی به متخصصان'
                        : 'Sent to Providers'
                    }
                    value={sentConvs.length}
                    icon={Send}
                    trend={lang === 'fa' ? 'گفتگوهای فعال' : 'Active Threads'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={
                      lang === 'fa'
                        ? 'پاسخ‌های خوانده‌نشده متخصصان'
                        : 'Unread Provider Replies'
                    }
                    value={unreadMessagesCount}
                    icon={MessageSquare}
                    trend={lang === 'fa' ? 'آماده بررسی' : 'Ready to read'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={lang === 'fa' ? 'خدمات ذخیره‌شده' : 'Saved Services'}
                    value={savedAdObjects.length}
                    icon={Heart}
                    trend={lang === 'fa' ? 'علاقه‌مندی‌ها' : 'Bookmarked'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                  <StatCard
                    label={lang === 'fa' ? 'متخصصان ذخیره‌شده' : 'Saved Providers'}
                    value={savedProObjects.length}
                    icon={Star}
                    trend={lang === 'fa' ? 'منتخب شما' : 'Shortlisted'}
                  />
                </Grid>
              </Grid>
            )}

            {/* =================================================================
                CUSTOMER DASHBOARD TABS (!isProfessional)
            ================================================================= */}
            {!isProfessional && activeTab === 'overview' && (
              <>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {lang === 'fa'
                        ? 'آخرین پیام‌هایی که برای متخصصان فرستاده‌اید'
                        : 'Recent Messages Sent to Providers'}
                    </h2>
                    <Link to="/messages" className="owj-btn owj-btn--dark owj-btn--sm">
                      {lang === 'fa' ? 'مشاهده همه در پیام‌رسان' : 'Open Messenger'}
                    </Link>
                  </div>

                  {sentConvs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666860' }}>
                      <p style={{ marginBottom: '0.9rem' }}>
                        {lang === 'fa'
                          ? 'هنوز پیامی برای متخصصان ارسال نکرده‌اید.'
                          : 'You have not sent any messages to providers yet.'}
                      </p>
                      <Link to="/explore" className="owj-btn owj-btn--lime owj-btn--sm">
                        {lang === 'fa' ? 'یافتن متخصص و ارسال پیام' : 'Find a Provider'}
                      </Link>
                    </div>
                  ) : (
                    sentConvs.map((conv) => {
                      const lastMsg = conv.messages?.[conv.messages.length - 1];
                      return (
                        <div key={conv.id} className={styles.adRow}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <div
                              style={{
                                width: 46,
                                height: 46,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                flexShrink: 0,
                              }}
                            >
                              <SmartImage
                                src={conv.participantAvatar}
                                alt={l(conv.participantName)}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{l(conv.participantName)}</div>
                              <div style={{ fontSize: '0.8rem', color: '#666860' }}>
                                {l(conv.serviceTitle)}
                              </div>
                              {lastMsg && (
                                <div
                                  style={{
                                    fontSize: '0.78rem',
                                    color: '#464841',
                                    marginTop: 3,
                                  }}
                                >
                                  {l(lastMsg.text)}
                                </div>
                              )}
                            </div>
                          </Stack>
                          <Link
                            to={`/messages?conv=${conv.id}`}
                            className="owj-btn owj-btn--outline owj-btn--sm"
                          >
                            {lang === 'fa' ? 'مشاهده گفتگو' : 'Open Chat'}
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {lang === 'fa' ? 'خدمات ذخیره‌شده اخیر' : 'Recently Saved Services'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('favorites')}
                      className="owj-btn owj-btn--ghost owj-btn--sm"
                    >
                      {lang === 'fa' ? 'همه علاقه‌مندی‌ها' : 'View All Saved'}
                    </button>
                  </div>
                  <Grid container spacing={2}>
                    {savedAdObjects.slice(0, 2).map((ad) => (
                      <Grid key={ad.id} size={{ xs: 12, md: 6 }}>
                        <ServiceCard ad={ad} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </>
            )}

            {!isProfessional && activeTab === 'sent-messages' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                    {lang === 'fa'
                      ? `همه پیام‌های ارسالی به متخصصان (${formatNumber(sentConvs.length, lang)})`
                      : `All Messages Sent to Providers (${sentConvs.length})`}
                  </h2>
                  <Link to="/messages" className="owj-btn owj-btn--lime owj-btn--sm">
                    {lang === 'fa' ? 'ورود به پیام‌رسان کامل' : 'Full Messenger'}
                  </Link>
                </div>

                {sentConvs.map((conv) => {
                  const lastMsg = conv.messages?.[conv.messages.length - 1];
                  return (
                    <div key={conv.id} className={styles.adRow}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <SmartImage
                            src={conv.participantAvatar}
                            alt={l(conv.participantName)}
                          />
                        </div>
                        <div>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <strong>{l(conv.participantName)}</strong>
                            <Chip
                              size="small"
                              label={lang === 'fa' ? 'ارسالی به متخصص' : 'Sent to Provider'}
                              sx={{ height: 21, fontSize: '0.68rem', fontWeight: 800 }}
                            />
                          </Stack>
                          <div style={{ fontSize: '0.82rem', color: '#666860' }}>
                            {l(conv.serviceTitle)} • {formatRelativeTime(conv.updatedAt, lang)}
                          </div>
                          {lastMsg && (
                            <p style={{ fontSize: '0.83rem', marginTop: 4 }}>{l(lastMsg.text)}</p>
                          )}
                        </div>
                      </Stack>

                      <Link
                        to={`/messages?conv=${conv.id}`}
                        className="owj-btn owj-btn--dark owj-btn--sm"
                      >
                        {lang === 'fa' ? 'ادامه گفتگو' : 'Continue Chat'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {!isProfessional && activeTab === 'my-reviews' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                    {lang === 'fa' ? 'دیدگاه‌های ثبت‌شده من' : 'My Submitted Reviews'}
                  </h2>
                  <Link to="/explore" className="owj-btn owj-btn--outline owj-btn--sm">
                    {lang === 'fa' ? 'ثبت دیدگاه روی خدمات' : 'Browse Services'}
                  </Link>
                </div>

                {customerWrittenReviews.length === 0 ? (
                  <p style={{ color: '#666860', fontSize: '0.9rem' }}>
                    {lang === 'fa'
                      ? 'شما می‌توانید در صفحه هر خدمت تخصصی، امتیاز و تجربه همکاری خود را ثبت کنید.'
                      : 'Visit any service page to rate and review a specialist you worked with.'}
                  </p>
                ) : (
                  customerWrittenReviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        paddingBlock: '1rem',
                        borderBottom: '1px solid rgba(17,18,15,0.08)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <strong>{l(rev.author)}</strong>
                        <span style={{ color: '#E59934', fontWeight: 800 }}>★ {rev.rating}.0</span>
                      </Stack>
                      <p style={{ fontSize: '0.9rem', marginTop: 6 }}>{l(rev.comment)}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* =================================================================
                PROVIDER DASHBOARD TABS (isProfessional)
            ================================================================= */}
            {isProfessional && activeTab === 'overview' && (
              <>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {lang === 'fa'
                        ? 'روند بازدید هفتگی پروفایل و آگهی‌ها'
                        : 'Weekly Engagement Activity'}
                    </h2>
                    <Link
                      to={`/professionals/${currentPro.id}`}
                      className="owj-btn owj-btn--outline owj-btn--sm"
                    >
                      {lang === 'fa' ? 'مشاهده پروفایل عمومی' : 'Public Profile'}
                    </Link>
                  </div>

                  <div className={styles.chartBars}>
                    {weeklyChart.map((col, idx) => (
                      <div key={idx} className={styles.barCol}>
                        <div className={styles.barFill} style={{ height: `${col.pct}%` }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666860' }}>
                          {col.day[lang]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Split Summary: Customer Messages vs Sent Skill Requests */}
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <div className={styles.panel} style={{ height: '100%' }}>
                      <div className={styles.panelHead}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                          {lang === 'fa'
                            ? 'پیام‌های دریافتی از مشتریان'
                            : 'Messages from Customers'}
                        </h3>
                        <Link
                          to="/messages?box=received"
                          className="owj-btn owj-btn--ghost owj-btn--sm"
                        >
                          {lang === 'fa' ? 'مشاهده همه' : 'View All'}
                        </Link>
                      </div>
                      {receivedCustomerConvs.slice(0, 3).map((conv) => (
                        <div key={conv.id} className={styles.adRow}>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                fontWeight: 800,
                              }}
                            >
                              <ArrowDownLeft size={14} color="#289e67" />
                              <span>{l(conv.participantName)}</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#666860' }}>
                              {l(conv.serviceTitle)}
                            </div>
                          </div>
                          <Link
                            to={`/messages?conv=${conv.id}`}
                            className="owj-btn owj-btn--outline owj-btn--sm"
                          >
                            {lang === 'fa' ? 'پاسخ' : 'Reply'}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <div className={styles.panel} style={{ height: '100%' }}>
                      <div className={styles.panelHead}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                          {lang === 'fa'
                            ? 'پیام‌ها و درخواست‌های مهارت ارسالی'
                            : 'Sent to Others & Skill Requests'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => openSkillRequestModal()}
                          className="owj-btn owj-btn--lime owj-btn--sm"
                        >
                          <Sparkles size={14} />
                          <span>{lang === 'fa' ? 'درخواست مهارت' : 'Request Skill'}</span>
                        </button>
                      </div>
                      {sentConvs.slice(0, 3).map((conv) => (
                        <div key={conv.id} className={styles.adRow}>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                fontWeight: 800,
                              }}
                            >
                              <ArrowUpRight size={14} />
                              <span>{l(conv.participantName)}</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#666860' }}>
                              {l(conv.serviceTitle)}
                            </div>
                          </div>
                          <Link
                            to={`/messages?conv=${conv.id}`}
                            className="owj-btn owj-btn--outline owj-btn--sm"
                          >
                            {lang === 'fa' ? 'گفتگو' : 'Open'}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </Grid>
                </Grid>
              </>
            )}

            {/* PROVIDER TAB: MY ADVERTISEMENTS */}
            {isProfessional && activeTab === 'ads' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {lang === 'fa' ? 'مدیریت آگهی‌های خدمات من' : 'Manage My Advertisements'}
                  </h2>
                  <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                    <Plus size={15} />
                    <span>{lang === 'fa' ? 'ثبت آگهی جدید' : 'New Listing'}</span>
                  </Link>
                </div>

                {myAds.map((ad) => (
                  <div key={ad.id} className={styles.adRow}>
                    <div className={styles.adMeta}>
                      <div className={styles.adThumb}>
                        <SmartImage src={ad.images?.[0]} alt={l(ad.title)} />
                      </div>
                      <div>
                        <Link to={`/services/${ad.id}`} style={{ fontWeight: 800 }}>
                          {l(ad.title)}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#666860', marginTop: 3 }}>
                          {formatPrice(ad, lang)} •{' '}
                          <span
                            className={`${styles.statusBadge} ${
                              ad.status === 'active' ? styles.activeStatus : styles.pausedStatus
                            }`}
                          >
                            {ad.status === 'active'
                              ? lang === 'fa'
                                ? 'فعال'
                                : 'Active'
                              : lang === 'fa'
                              ? 'متوقف‌شده'
                              : 'Paused'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/edit-ad/${ad.id}`}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        <Edit3 size={14} />
                        <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          toggleAdvertisementStatus(ad.id);
                          showToast({
                            title:
                              ad.status === 'active'
                                ? lang === 'fa'
                                  ? 'آگهی موقتاً متوقف شد'
                                  : 'Listing Paused'
                                : lang === 'fa'
                                ? 'آگهی مجدداً فعال شد'
                                : 'Listing Activated',
                            type: 'info',
                          });
                        }}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        {ad.status === 'active' ? (
                          <PauseCircle size={14} />
                        ) : (
                          <PlayCircle size={14} />
                        )}
                        <span>
                          {ad.status === 'active'
                            ? lang === 'fa'
                              ? 'توقف'
                              : 'Pause'
                            : lang === 'fa'
                            ? 'فعال‌سازی'
                            : 'Activate'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(ad)}
                        className="owj-btn owj-btn--danger owj-btn--sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROVIDER TAB: CUSTOMER INQUIRIES */}
            {isProfessional && activeTab === 'inquiries' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {lang === 'fa'
                      ? 'پیام‌ها و درخواست‌های دریافتی از مشتریان'
                      : 'Customer Inquiries & Incoming Messages'}
                  </h2>
                  <Link
                    to="/messages?box=received"
                    className="owj-btn owj-btn--dark owj-btn--sm"
                  >
                    {lang === 'fa' ? 'صندوق دریافتی مشتریان' : 'Customer Inbox'}
                  </Link>
                </div>

                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 14,
                      border: '1px solid rgba(17,18,15,0.08)',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <div>
                        <strong>{l(inq.clientName)}</strong>
                        <span
                          style={{
                            marginInlineStart: 8,
                            fontSize: '0.8rem',
                            color: '#666860',
                          }}
                        >
                          ({l(inq.serviceTitle)})
                        </span>
                      </div>
                      <span style={{ fontWeight: 800 }}>
                        {formatPrice({ price: inq.budget, priceUsd: inq.budgetUsd }, lang)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#464841', margin: '0.6rem 0' }}>
                      {l(inq.message)}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(inq.id, 'accepted')}
                        className="owj-btn owj-btn--lime owj-btn--sm"
                      >
                        {lang === 'fa' ? 'پذیرش درخواست' : 'Accept'}
                      </button>
                      <Link
                        to="/messages?box=received"
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        {lang === 'fa' ? 'پاسخ در پیام‌رسان' : 'Reply in Chat'}
                      </Link>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#289e67' }}>
                        {inq.status === 'accepted'
                          ? lang === 'fa'
                            ? '✓ تایید شده'
                            : '✓ Accepted'
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROVIDER TAB: SKILL REQUESTS ("providers can also send a request for an skill") */}
            {isProfessional && activeTab === 'skill-requests' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      {lang === 'fa'
                        ? 'درخواست‌های مهارت ارسالی من'
                        : 'My Outgoing Skill Requests'}
                    </h2>
                    <p style={{ fontSize: '0.83rem', color: '#666860', marginTop: 3 }}>
                      {lang === 'fa'
                        ? 'درخواست مهارت مکمل از سایر متخصصان یا پیشنهاد افزودن مهارت جدید به اوجیفای'
                        : 'Request specialized skills from fellow providers or submit new skills to OWJIFY'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSkillRequestModal()}
                    className="owj-btn owj-btn--lime owj-btn--sm"
                  >
                    <Sparkles size={15} />
                    <span>
                      {lang === 'fa' ? 'ثبت درخواست مهارت جدید' : 'New Skill Request'}
                    </span>
                  </button>
                </div>

                {skillRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#666860' }}>
                    <p style={{ marginBottom: '1rem' }}>
                      {lang === 'fa'
                        ? 'هنوز درخواست مهارتی ثبت نکرده‌اید.'
                        : 'You have not submitted any skill requests yet.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => openSkillRequestModal()}
                      className="owj-btn owj-btn--lime owj-btn--sm"
                    >
                      {lang === 'fa' ? 'ارسال اولین درخواست مهارت' : 'Send Skill Request'}
                    </button>
                  </div>
                ) : (
                  <Stack spacing={1.5}>
                    {skillRequests.map((req) => {
                      const cat = getCategoryById(req.categoryId);
                      return (
                        <div
                          key={req.id}
                          style={{
                            padding: '1.15rem',
                            borderRadius: 16,
                            border: '1px solid rgba(17,18,15,0.09)',
                            background: '#FAFAF7',
                          }}
                        >
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={1}
                          >
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                              <strong style={{ fontSize: '1rem' }}>{l(req.skillName)}</strong>
                              <Chip
                                size="small"
                                label={l(cat.name)}
                                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                              />
                              <Chip
                                size="small"
                                label={
                                  req.requestType === 'specialist_collaboration'
                                    ? lang === 'fa'
                                      ? 'همکاری با متخصص'
                                      : 'Provider Collaboration'
                                    : lang === 'fa'
                                    ? 'پیشنهاد مهارت پلتفرم'
                                    : 'Platform Taxonomy'
                                }
                                sx={{
                                  bgcolor: '#11120F',
                                  color: '#C7F36B',
                                  fontWeight: 800,
                                  fontSize: '0.7rem',
                                }}
                              />
                              {req.urgency === 'urgent' && (
                                <Chip
                                  size="small"
                                  label={lang === 'fa' ? 'فوری' : 'Urgent'}
                                  sx={{
                                    bgcolor: 'rgba(217, 72, 72, 0.12)',
                                    color: '#b83232',
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                            </Stack>

                            <span style={{ fontSize: '0.76rem', color: '#666860' }}>
                              {formatRelativeTime(req.createdAt, lang)}
                            </span>
                          </Stack>

                          {req.targetProName && (
                            <div style={{ fontSize: '0.83rem', color: '#464841', marginTop: 6 }}>
                              <strong>
                                {lang === 'fa' ? 'متخصص مخاطب: ' : 'Sent to Specialist: '}
                              </strong>
                              {l(req.targetProName)}
                            </div>
                          )}

                          <p style={{ fontSize: '0.88rem', color: '#464841', marginTop: 8, lineHeight: 1.7 }}>
                            {l(req.details)}
                          </p>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                            sx={{ mt: 1.5 }}
                          >
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#289e67' }}>
                              {req.status === 'approved'
                                ? lang === 'fa'
                                  ? '✓ تایید و ثبت شده'
                                  : '✓ Approved'
                                : req.status === 'in_discussion'
                                ? lang === 'fa'
                                  ? '● در حال گفتگو با متخصص'
                                  : '● Active in Sent Messages'
                                : lang === 'fa'
                                ? '● در حال بررسی'
                                : '● Under Review'}
                            </span>

                            {req.conversationId && (
                              <Link
                                to={`/messages?conv=${req.conversationId}`}
                                className="owj-btn owj-btn--dark owj-btn--sm"
                              >
                                <MessageSquare size={14} />
                                <span>
                                  {lang === 'fa'
                                    ? 'مشاهده در پیام‌های ارسالی'
                                    : 'Open Sent Thread'}
                                </span>
                              </Link>
                            )}
                          </Stack>
                        </div>
                      );
                    })}
                  </Stack>
                )}
              </div>
            )}

            {/* PROVIDER TAB: AVAILABILITY */}
            {isProfessional && activeTab === 'availability' && (
              <form className={styles.panel} onSubmit={handleSaveAvailability}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {lang === 'fa'
                    ? 'تنظیم برنامه کاری و وضعیت دسترسی'
                    : 'Manage Working Schedule'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 460 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={availNow}
                      onChange={(e) => setAvailNow(e.target.checked)}
                    />
                    <span>
                      {lang === 'fa'
                        ? 'وضعیت «آماده پذیرش پروژه جدید» فعال باشد'
                        : 'Show "Available for New Projects" badge'}
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={availUrgent}
                      onChange={(e) => setAvailUrgent(e.target.checked)}
                    />
                    <span>
                      {lang === 'fa'
                        ? 'امکان اعزام و خدمات فوری دارم'
                        : 'Accept Express / Urgent Requests'}
                    </span>
                  </label>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      {lang === 'fa' ? 'بازه ساعات پاسخ‌گویی' : 'Response Hours'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={availHours}
                      onChange={(e) => setAvailHours(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 12,
                        border: '1px solid rgba(17,18,15,0.16)',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="owj-btn owj-btn--lime"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {lang === 'fa' ? 'ذخیره برنامه زمانی' : 'Save Availability'}
                  </button>
                </div>
              </form>
            )}

            {/* PROVIDER TAB: PORTFOLIO */}
            {isProfessional && activeTab === 'portfolio' && (
              <div className={styles.panel}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {lang === 'fa'
                    ? 'افزودن پروژه جدید به پورتفولیو'
                    : 'Add Project to Portfolio'}
                </h2>
                <form
                  onSubmit={handleAddPortfolio}
                  style={{
                    display: 'grid',
                    gap: '0.85rem',
                    marginBottom: '1.75rem',
                    maxWidth: 560,
                  }}
                >
                  <input
                    type="text"
                    required
                    value={pfTitle}
                    onChange={(e) => setPfTitle(e.target.value)}
                    placeholder={
                      lang === 'fa'
                        ? 'عنوان پروژه انجام‌شده...'
                        : 'Completed project title...'
                    }
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 12,
                      border: '1px solid rgba(17,18,15,0.16)',
                    }}
                  />
                  <textarea
                    rows={2}
                    value={pfSummary}
                    onChange={(e) => setPfSummary(e.target.value)}
                    placeholder={lang === 'fa' ? 'خلاصه دستاورد فنی...' : 'Brief case study summary...'}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 12,
                      border: '1px solid rgba(17,18,15,0.16)',
                    }}
                  />
                  <button
                    type="submit"
                    className="owj-btn owj-btn--dark owj-btn--sm"
                    style={{ justifySelf: 'start' }}
                  >
                    <Plus size={15} />
                    <span>{lang === 'fa' ? 'افزودن به پورتفولیو' : 'Add Portfolio Item'}</span>
                  </button>
                </form>

                <Grid container spacing={2}>
                  {(currentPro.portfolio || []).map((pf) => (
                    <Grid key={pf.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <div
                        style={{
                          border: '1px solid rgba(17,18,15,0.08)',
                          borderRadius: 14,
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ height: 150 }}>
                          <SmartImage src={pf.image} alt={l(pf.title)} />
                        </div>
                        <div
                          style={{
                            padding: '0.85rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <strong style={{ fontSize: '0.88rem' }}>{l(pf.title)}</strong>
                          <button
                            type="button"
                            onClick={() => deletePortfolioProject(currentPro.id, pf.id)}
                            style={{ color: '#d94848' }}
                            aria-label="Remove portfolio item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            {/* SHARED TAB: SAVED FAVORITES */}
            {activeTab === 'favorites' && (
              <div className={styles.panel}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {lang === 'fa'
                    ? 'خدمات و متخصصان ذخیره‌شده'
                    : 'Saved Services & Specialists'}
                </h2>
                {savedAdObjects.length === 0 && savedProObjects.length === 0 ? (
                  <p style={{ color: '#666860' }}>
                    {lang === 'fa'
                      ? 'هنوز موردی ذخیره نشده است.'
                      : 'No saved items yet.'}
                  </p>
                ) : (
                  <>
                    {savedAdObjects.length > 0 && (
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        {savedAdObjects.map((ad) => (
                          <Grid key={ad.id} size={{ xs: 12, md: 6 }}>
                            <ServiceCard ad={ad} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    {savedProObjects.length > 0 && (
                      <Grid container spacing={2}>
                        {savedProObjects.map((pro) => (
                          <Grid key={pro.id} size={{ xs: 12, md: 6 }}>
                            <ProfessionalCard pro={pro} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </>
                )}
              </div>
            )}

            {/* PROVIDER TAB: REVIEWS */}
            {isProfessional && activeTab === 'reviews' && (
              <div className={styles.panel}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {lang === 'fa'
                    ? 'دیدگاه‌های مشتریان و ثبت پاسخ رسمی'
                    : 'Client Reviews & Responses'}
                </h2>
                {myProReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      paddingBlock: '1rem',
                      borderBottom: '1px solid rgba(17,18,15,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{l(rev.author)}</strong>
                      <span style={{ color: '#E59934', fontWeight: 800 }}>★ {rev.rating}.0</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}>{l(rev.comment)}</p>

                    {rev.reply ? (
                      <div
                        style={{
                          padding: '0.6rem 0.9rem',
                          background: '#F6F5F0',
                          borderRadius: 10,
                          fontSize: '0.82rem',
                        }}
                      >
                        <strong>{lang === 'fa' ? 'پاسخ شما: ' : 'Your Reply: '}</strong>
                        {l(rev.reply)}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
                        <input
                          type="text"
                          value={replyTexts[rev.id] || ''}
                          onChange={(e) =>
                            setReplyTexts((p) => ({ ...p, [rev.id]: e.target.value }))
                          }
                          placeholder={
                            lang === 'fa'
                              ? 'پاسخ محترمانه به دیدگاه مشتری...'
                              : 'Write an official reply...'
                          }
                          style={{
                            flex: 1,
                            padding: '0.55rem 0.85rem',
                            borderRadius: 10,
                            border: '1px solid rgba(17,18,15,0.15)',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!replyTexts[rev.id]?.trim()) return;
                            replyToReview(rev.id, replyTexts[rev.id].trim());
                            showToast({
                              title: lang === 'fa' ? 'پاسخ ثبت شد' : 'Reply Published',
                              type: 'success',
                            });
                          }}
                          className="owj-btn owj-btn--dark owj-btn--sm"
                        >
                          {lang === 'fa' ? 'ارسال پاسخ' : 'Reply'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={lang === 'fa' ? 'حذف دائمی آگهی' : 'Delete Advertisement'}
      >
        {deleteTarget && (
          <div>
            <p style={{ marginBottom: '1.25rem', lineHeight: 1.75 }}>
              {lang === 'fa'
                ? `آیا از حذف آگهی «${l(deleteTarget.title)}» اطمینان دارید؟`
                : `Are you sure you want to delete "${l(deleteTarget.title)}"?`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="owj-btn owj-btn--outline owj-btn--sm"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAdvertisement(deleteTarget.id);
                  setDeleteTarget(null);
                  showToast({
                    title: lang === 'fa' ? 'آگهی حذف شد' : 'Advertisement Deleted',
                    type: 'info',
                  });
                }}
                className="owj-btn owj-btn--danger owj-btn--sm"
              >
                {lang === 'fa' ? 'بله، حذف شود' : 'Delete Listing'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
