import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Grid, Stack, Tabs, Tab, Box, Chip } from '@mui/material';
import {
  LayoutDashboard,
  Layers,
  Heart,
  Star,
  Plus,
  Compass,
  Eye,
  MessageSquare,
  Edit3,
  PauseCircle,
  PlayCircle,
  Trash2,
  UserCog,
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
    unreadMessagesCount,
    toggleAdvertisementStatus,
    deleteAdvertisement,
    replyToReview,
  } = useMarketplace();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Simplified, Focused Role Tabs
  const providerTabs = [
    { id: 'overview', icon: LayoutDashboard, fa: 'نمای کلی', en: 'Overview' },
    { id: 'ads', icon: Layers, fa: 'آگهی‌های من', en: 'My Listings' },
    { id: 'reviews', icon: Star, fa: 'دیدگاه‌ها', en: 'Reviews' },
    { id: 'favorites', icon: Heart, fa: 'ذخیره‌شده‌ها', en: 'Saved' },
  ];

  const customerTabs = [
    { id: 'overview', icon: LayoutDashboard, fa: 'نمای کلی کارفرما', en: 'Customer Overview' },
    { id: 'sent-messages', icon: Send, fa: 'پیام‌های ارسالی من', en: 'My Messages' },
    { id: 'favorites', icon: Heart, fa: 'ذخیره‌شده‌ها', en: 'Saved' },
    { id: 'my-reviews', icon: Star, fa: 'دیدگاه‌های من', en: 'My Reviews' },
  ];

  const navItems = isProfessional ? providerTabs : customerTabs;
  const rawTab = searchParams.get('tab') || 'overview';
  const activeTab = navItems.some((item) => item.id === rawTab) ? rawTab : 'overview';
  const setTab = (t) => setSearchParams({ tab: t });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

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

  const receivedConvs = useMemo(
    () => conversations.filter((c) => c.direction === 'received'),
    [conversations]
  );

  const sentConvs = useMemo(
    () => conversations.filter((c) => c.direction === 'sent'),
    [conversations]
  );

  const activeAdsCount = myAds.filter((a) => a.status === 'active').length;
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

  const handleConfirmDeleteAd = () => {
    if (!deleteTarget) return;
    deleteAdvertisement(deleteTarget.id);
    setDeleteTarget(null);
    showToast({
      title: lang === 'fa' ? 'آگهی حذف شد' : 'Listing Deleted',
      type: 'info',
    });
  };

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 }, pb: { xs: 6, md: 9 } }}>
        {/* Clean Role Header */}
        <div className={styles.banner}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>
              <SmartImage src={user?.avatar} alt={l(user?.fullName)} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 900 }}>
                {l(user?.fullName)}
              </h1>
              <span className={styles.rolePill}>
                {isProfessional
                  ? lang === 'fa'
                    ? 'حساب متخصص'
                    : 'Specialist Account'
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
                  <span>{lang === 'fa' ? 'ثبت آگهی جدید' : 'Post New Ad'}</span>
                </Link>
                <Link to="/messages" className="owj-btn owj-btn--outline-light owj-btn--sm">
                  <MessageSquare size={15} />
                  <span>
                    {lang === 'fa' ? 'پیام‌ها' : 'Messages'}
                    {unreadMessagesCount > 0
                      ? ` (${formatNumber(unreadMessagesCount, lang)})`
                      : ''}
                  </span>
                </Link>
                <Link to="/explore" className="owj-btn owj-btn--outline-light owj-btn--sm">
                  <Compass size={15} />
                  <span>{lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Browse Ads'}</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/explore" className="owj-btn owj-btn--lime owj-btn--sm">
                  <Compass size={15} />
                  <span>{lang === 'fa' ? 'کاوش متخصصان' : 'Explore Providers'}</span>
                </Link>
                <Link to="/messages" className="owj-btn owj-btn--outline-light owj-btn--sm">
                  <Send size={15} />
                  <span>{lang === 'fa' ? 'پیام‌های من' : 'My Messages'}</span>
                </Link>
              </>
            )}

            <Link to="/profile/edit" className="owj-btn owj-btn--outline-light owj-btn--sm">
              <UserCog size={15} />
              <span>{lang === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}</span>
            </Link>
          </Stack>
        </div>

        {/* Mobile / Tablet Scrollable Tabs */}
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
          <Grid size={{ lg: 2.8 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
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

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(17,18,15,0.08)',
                  margin: '0.5rem 0',
                }}
              />

              <Link to="/messages" className={styles.sideBtn}>
                <MessageSquare size={17} />
                <span>{lang === 'fa' ? 'صندوق پیام‌ها' : 'Messages'}</span>
              </Link>
              {isProfessional && currentPro && (
                <Link to={`/professionals/${currentPro.id}`} className={styles.sideBtn}>
                  <Eye size={17} />
                  <span>{lang === 'fa' ? 'پروفایل عمومی من' : 'My Public Profile'}</span>
                </Link>
              )}
            </nav>
          </Grid>

          {/* Main Workspace Column */}
          <Grid size={{ xs: 12, lg: 9.2 }}>
            {/* Compact KPI Strip */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {isProfessional ? (
                <>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Layers}
                      value={activeAdsCount}
                      label={lang === 'fa' ? 'آگهی‌های فعال من' : 'My Active Ads'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={ArrowDownLeft}
                      value={receivedConvs.length}
                      label={lang === 'fa' ? 'پیام‌های دریافتی من' : 'Received Inquiries'}
                      accent
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={ArrowUpRight}
                      value={sentConvs.length}
                      label={lang === 'fa' ? 'ارسالی به متخصصان' : 'Sent to Specialists'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Star}
                      value={currentPro?.rating || '4.9'}
                      label={lang === 'fa' ? 'امتیاز من' : 'Rating'}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Send}
                      value={sentConvs.length}
                      label={lang === 'fa' ? 'پیام‌های ارسالی' : 'Messages Sent'}
                      accent
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Heart}
                      value={savedAdObjects.length}
                      label={lang === 'fa' ? 'آگهی‌های ذخیره‌شده' : 'Saved Services'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Compass}
                      value={savedProObjects.length}
                      label={lang === 'fa' ? 'متخصصان منتخب' : 'Saved Specialists'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatCard
                      icon={Star}
                      value={customerWrittenReviews.length}
                      label={lang === 'fa' ? 'دیدگاه‌های من' : 'My Reviews'}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {/* =================================================================
                SPECIALIST OVERVIEW: Simple Two-Column Messages + My Ads Preview
            ================================================================= */}
            {isProfessional && activeTab === 'overview' && (
              <>
                <Grid container spacing={2.5} sx={{ mb: 0.5 }}>
                  {/* 1) Incoming Inquiries to this Specialist */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <div className={styles.panel} style={{ height: '100%' }}>
                      <div className={styles.panelHead}>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 800 }}>
                          {lang === 'fa'
                            ? 'پیام‌های دریافتی متخصص'
                            : 'Received Inquiries'}
                        </h3>
                        <Link
                          to="/messages?box=received"
                          className="owj-btn owj-btn--ghost owj-btn--sm"
                        >
                          {lang === 'fa' ? 'مشاهده همه' : 'View All'}
                        </Link>
                      </div>

                      {receivedConvs.length === 0 ? (
                        <p style={{ fontSize: '0.86rem', color: '#666860' }}>
                          {lang === 'fa'
                            ? 'هنوز پیام دریافتی جدیدی ثبت نشده است.'
                            : 'No incoming inquiries yet.'}
                        </p>
                      ) : (
                        receivedConvs.slice(0, 3).map((conv) => (
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
                              to={`/messages?box=received&conv=${conv.id}`}
                              className="owj-btn owj-btn--outline owj-btn--sm"
                            >
                              {lang === 'fa' ? 'پاسخ' : 'Reply'}
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </Grid>

                  {/* 2) Outgoing Requests Sent by this Specialist to Other Specialists */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <div className={styles.panel} style={{ height: '100%' }}>
                      <div className={styles.panelHead}>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 800 }}>
                          {lang === 'fa'
                            ? 'درخواست‌های من به سایر متخصصان'
                            : 'Requests to Other Specialists'}
                        </h3>
                        <Link
                          to="/messages?box=sent"
                          className="owj-btn owj-btn--ghost owj-btn--sm"
                        >
                          {lang === 'fa' ? 'مشاهده همه' : 'View All'}
                        </Link>
                      </div>

                      {sentConvs.length === 0 ? (
                        <p style={{ fontSize: '0.86rem', color: '#666860' }}>
                          {lang === 'fa'
                            ? 'می‌توانید در صفحه هر آگهی مستقیماً با متخصص مربوطه ارتباط بگیرید.'
                            : 'Open any listing to connect directly with another specialist.'}
                        </p>
                      ) : (
                        sentConvs.slice(0, 3).map((conv) => (
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
                              to={`/messages?box=sent&conv=${conv.id}`}
                              className="owj-btn owj-btn--outline owj-btn--sm"
                            >
                              {lang === 'fa' ? 'گفتگو' : 'Open'}
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </Grid>
                </Grid>

                {/* Quick Summary of My Listings */}
                <div className={styles.panel} style={{ marginTop: '1.5rem' }}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      {lang === 'fa' ? 'آگهی‌های اخیر من' : 'My Recent Listings'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('ads')}
                      className="owj-btn owj-btn--outline owj-btn--sm"
                    >
                      {lang === 'fa' ? 'مدیریت همه آگهی‌ها' : 'Manage Listings'}
                    </button>
                  </div>

                  {myAds.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#666860' }}>
                      <p style={{ marginBottom: '0.85rem' }}>
                        {lang === 'fa'
                          ? 'هنوز آگهی خدمتی ثبت نکرده‌اید.'
                          : 'You have not posted any listings yet.'}
                      </p>
                      <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                        <Plus size={14} />
                        <span>{lang === 'fa' ? 'ثبت اولین آگهی' : 'Post First Ad'}</span>
                      </Link>
                    </div>
                  ) : (
                    myAds.slice(0, 3).map((ad) => (
                      <div key={ad.id} className={styles.adRow}>
                        <div className={styles.adInfo}>
                          <div className={styles.adThumb}>
                            <SmartImage src={ad.images?.[0]} alt={l(ad.title)} />
                          </div>
                          <div>
                            <Link to={`/services/${ad.id}`} style={{ fontWeight: 800 }}>
                              {l(ad.title)}
                            </Link>
                            <div className={styles.adMeta}>
                              <span>{formatPrice(ad, lang)}</span>
                              <span
                                className={`${styles.statusBadge} ${
                                  ad.status === 'active'
                                    ? styles.activeStatus
                                    : styles.pausedStatus
                                }`}
                              >
                                {ad.status === 'active'
                                  ? lang === 'fa'
                                    ? 'فعال'
                                    : 'Active'
                                  : lang === 'fa'
                                  ? 'متوقف'
                                  : 'Paused'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/edit-ad/${ad.id}`}
                          className="owj-btn owj-btn--outline owj-btn--sm"
                        >
                          <Edit3 size={14} />
                          <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* =================================================================
                SPECIALIST TAB: MY LISTINGS
            ================================================================= */}
            {isProfessional && activeTab === 'ads' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                    {lang === 'fa' ? 'آگهی‌های من' : 'My Listings'}
                  </h2>
                  <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                    <Plus size={15} />
                    <span>{lang === 'fa' ? 'ثبت آگهی جدید' : 'Post New Ad'}</span>
                  </Link>
                </div>

                {myAds.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#666860' }}>
                    <p style={{ marginBottom: '1rem' }}>
                      {lang === 'fa'
                        ? 'هنوز آگهی خدمتی منتشر نکرده‌اید.'
                        : 'You have not published any service listings yet.'}
                    </p>
                    <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                      <Plus size={14} />
                      <span>{lang === 'fa' ? 'ثبت اولین آگهی' : 'Post First Ad'}</span>
                    </Link>
                  </div>
                ) : (
                  myAds.map((ad) => (
                    <div key={ad.id} className={styles.adRow}>
                      <div className={styles.adInfo}>
                        <div className={styles.adThumb}>
                          <SmartImage src={ad.images?.[0]} alt={l(ad.title)} />
                        </div>
                        <div>
                          <Link to={`/services/${ad.id}`} style={{ fontWeight: 800 }}>
                            {l(ad.title)}
                          </Link>
                          <div className={styles.adMeta}>
                            <span>{formatPrice(ad, lang)}</span>
                            <span
                              className={`${styles.statusBadge} ${
                                ad.status === 'active'
                                  ? styles.activeStatus
                                  : styles.pausedStatus
                              }`}
                            >
                              {ad.status === 'active'
                                ? lang === 'fa'
                                  ? 'فعال'
                                  : 'Active'
                                : lang === 'fa'
                                ? 'متوقف'
                                : 'Paused'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/edit-ad/${ad.id}`}
                          className="owj-btn owj-btn--outline owj-btn--sm"
                        >
                          <Edit3 size={14} />
                          <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleAdvertisementStatus(ad.id)}
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
                          aria-label="Delete listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* =================================================================
                SPECIALIST TAB: CLIENT REVIEWS
            ================================================================= */}
            {isProfessional && activeTab === 'reviews' && (
              <div className={styles.panel}>
                <h2 style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {lang === 'fa' ? 'دیدگاه‌های ثبت‌شده روی آگهی‌های من' : 'Client Reviews'}
                </h2>
                {myProReviews.length === 0 ? (
                  <p style={{ color: '#666860', fontSize: '0.9rem' }}>
                    {lang === 'fa'
                      ? 'هنوز دیدگاهی ثبت نشده است.'
                      : 'No reviews received yet.'}
                  </p>
                ) : (
                  myProReviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        paddingBlock: '1rem',
                        borderBottom: '1px solid rgba(17,18,15,0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{l(rev.author)}</strong>
                        <span style={{ fontWeight: 800, color: '#E59934' }}>
                          ★ {rev.rating}.0
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>{l(rev.comment)}</p>

                      {rev.reply ? (
                        <div
                          style={{
                            padding: '0.7rem 0.9rem',
                            borderRadius: 10,
                            background: '#F6F5F0',
                            fontSize: '0.84rem',
                          }}
                        >
                          <strong>{lang === 'fa' ? 'پاسخ شما: ' : 'Your Reply: '}</strong>
                          {l(rev.reply)}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder={
                              lang === 'fa' ? 'پاسخ به این دیدگاه...' : 'Write a reply...'
                            }
                            value={replyTexts[rev.id] || ''}
                            onChange={(e) =>
                              setReplyTexts((p) => ({ ...p, [rev.id]: e.target.value }))
                            }
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.85rem',
                              borderRadius: 10,
                              border: '1px solid rgba(17,18,15,0.14)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!replyTexts[rev.id]?.trim()) return;
                              replyToReview(rev.id, replyTexts[rev.id]);
                              showToast({
                                title: lang === 'fa' ? 'پاسخ ثبت شد' : 'Reply Posted',
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
                  ))
                )}
              </div>
            )}

            {/* =================================================================
                CUSTOMER OVERVIEW & CUSTOMER TABS
            ================================================================= */}
            {!isProfessional && activeTab === 'overview' && (
              <>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.08rem', fontWeight: 800 }}>
                      {lang === 'fa' ? 'گفتگوهای اخیر من با متخصصان' : 'Recent Conversations'}
                    </h2>
                    <Link to="/messages" className="owj-btn owj-btn--outline owj-btn--sm">
                      {lang === 'fa' ? 'همه پیام‌ها' : 'All Messages'}
                    </Link>
                  </div>

                  {sentConvs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#666860' }}>
                      <p style={{ marginBottom: '0.9rem' }}>
                        {lang === 'fa'
                          ? 'هنوز پیامی برای متخصصان ارسال نکرده‌اید.'
                          : 'You have not contacted any specialists yet.'}
                      </p>
                      <Link to="/explore" className="owj-btn owj-btn--lime owj-btn--sm">
                        {lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Explore Services'}
                      </Link>
                    </div>
                  ) : (
                    sentConvs.slice(0, 3).map((conv) => (
                      <div key={conv.id} className={styles.adRow}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
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
                            <strong>{l(conv.participantName)}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#666860' }}>
                              {l(conv.serviceTitle)} • {formatRelativeTime(conv.updatedAt, lang)}
                            </div>
                          </div>
                        </Stack>
                        <Link
                          to={`/messages?conv=${conv.id}`}
                          className="owj-btn owj-btn--dark owj-btn--sm"
                        >
                          {lang === 'fa' ? 'باز کردن گفتگو' : 'Open Chat'}
                        </Link>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h2 style={{ fontSize: '1.08rem', fontWeight: 800 }}>
                      {lang === 'fa' ? 'آگهی‌های ذخیره‌شده من' : 'Saved Services'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('favorites')}
                      className="owj-btn owj-btn--ghost owj-btn--sm"
                    >
                      {lang === 'fa' ? 'مشاهده همه' : 'View All'}
                    </button>
                  </div>

                  {savedAdObjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#666860' }}>
                      <p style={{ marginBottom: '0.85rem' }}>
                        {lang === 'fa'
                          ? 'هنوز آگهی‌ای را ذخیره نکرده‌اید.'
                          : 'You have not bookmarked any services yet.'}
                      </p>
                      <Link to="/explore" className="owj-btn owj-btn--outline owj-btn--sm">
                        {lang === 'fa' ? 'کاوش خدمات' : 'Browse Services'}
                      </Link>
                    </div>
                  ) : (
                    <Grid container spacing={2}>
                      {savedAdObjects.slice(0, 2).map((ad) => (
                        <Grid key={ad.id} size={{ xs: 12, md: 6 }}>
                          <ServiceCard ad={ad} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              </>
            )}

            {!isProfessional && activeTab === 'sent-messages' && (
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                    {lang === 'fa' ? 'پیام‌های ارسالی من به متخصصان' : 'Messages Sent to Specialists'}
                  </h2>
                  <Link to="/messages" className="owj-btn owj-btn--lime owj-btn--sm">
                    {lang === 'fa' ? 'باز کردن پیام‌رسان' : 'Open Messenger'}
                  </Link>
                </div>

                {sentConvs.map((conv) => {
                  const lastMsg = conv.messages?.[conv.messages.length - 1];
                  return (
                    <div key={conv.id} className={styles.adRow}>
                      <Stack direction="row" spacing={1.4} alignItems="center">
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
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
                              label={lang === 'fa' ? 'ارسالی به متخصص' : 'Sent to Specialist'}
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
                    {lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Browse Services'}
                  </Link>
                </div>

                {customerWrittenReviews.length === 0 ? (
                  <p style={{ color: '#666860', fontSize: '0.9rem' }}>
                    {lang === 'fa'
                      ? 'شما می‌توانید در صفحه هر آگهی امتیاز و تجربه خود را ثبت کنید.'
                      : 'Visit any service listing to rate and review a specialist.'}
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
                SHARED TAB: SAVED FAVORITES
            ================================================================= */}
            {activeTab === 'favorites' && (
              <>
                <div className={styles.panel}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {lang === 'fa' ? 'آگهی‌های ذخیره‌شده' : 'Saved Services'}
                  </h2>
                  {savedAdObjects.length === 0 ? (
                    <p style={{ color: '#666860', fontSize: '0.9rem' }}>
                      {lang === 'fa' ? 'موردی ذخیره نشده است.' : 'No saved listings yet.'}
                    </p>
                  ) : (
                    <Grid container spacing={2}>
                      {savedAdObjects.map((ad) => (
                        <Grid key={ad.id} size={{ xs: 12, md: 6 }}>
                          <ServiceCard ad={ad} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>

                <div className={styles.panel}>
                  <h2 style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {lang === 'fa' ? 'متخصصان ذخیره‌شده' : 'Saved Specialists'}
                  </h2>
                  {savedProObjects.length === 0 ? (
                    <p style={{ color: '#666860', fontSize: '0.9rem' }}>
                      {lang === 'fa' ? 'متخصصی ذخیره نشده است.' : 'No saved specialists yet.'}
                    </p>
                  ) : (
                    <Grid container spacing={2}>
                      {savedProObjects.map((pro) => (
                        <Grid key={pro.id} size={{ xs: 12, md: 6 }}>
                          <ProfessionalCard pro={pro} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Delete Listing Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={lang === 'fa' ? 'تایید حذف آگهی' : 'Delete Advertisement'}
      >
        <p style={{ fontSize: '0.92rem', color: '#464841', marginBottom: '1.5rem' }}>
          {lang === 'fa'
            ? `آیا از حذف آگهی «${deleteTarget ? l(deleteTarget.title) : ''}» اطمینان دارید؟`
            : `Are you sure you want to delete "${deleteTarget ? l(deleteTarget.title) : ''}"?`}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="owj-btn owj-btn--outline owj-btn--sm"
          >
            {lang === 'fa' ? 'انصراف' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirmDeleteAd}
            className="owj-btn owj-btn--danger owj-btn--sm"
          >
            {lang === 'fa' ? 'بله، حذف شود' : 'Delete Permanently'}
          </button>
        </div>
      </Modal>
    </PageTransition>
  );
}
