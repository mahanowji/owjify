import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Stack, Tabs, Tab, Box, Tooltip } from '@mui/material';
import {
  BadgeCheck,
  MapPin,
  Star,
  Heart,
  Share2,
  MessageSquare,
  Award,
  Briefcase,
  Clock,
  Globe,
  LogIn,
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  Edit3,
  ShieldCheck,
  Headset,
  Trash2,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import ServiceCard from '../../components/marketplace/ServiceCard';
import ContactModal from '../../components/marketplace/ContactModal';
import ShareModal from '../../components/marketplace/ShareModal';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import {
  formatNumber,
  formatRelativeTime,
  toPersianDigits,
  formatAvailabilityDays,
} from '../../utils/formatters';
import styles from './ProfessionalProfilePage.module.scss';

export default function ProfessionalProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, isRTL, l, ui } = useLanguage();
  const {
    user,
    hasToken,
    isProfessional,
    isOperator,
    isAdmin,
    isMarketplaceMember,
  } = useAuth();
  const {
    professionals,
    advertisements,
    reviews,
    favoritePros,
    toggleFavoritePro,
    adminUpdateSpecialist,
    deleteReview,
  } = useMarketplace();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('about');
  const [contactOpen, setContactOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const pro = professionals.find((p) => p.id === id);

  const proAds = useMemo(() => {
    if (!pro) return [];
    return advertisements.filter((a) => a.proId === pro.id && a.status === 'active');
  }, [pro, advertisements]);

  const proReviews = useMemo(() => {
    if (!pro) return [];
    return reviews.filter((r) => r.proId === pro.id);
  }, [pro, reviews]);

  if (!pro) {
    return (
      <PageTransition>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '1rem' }}>
            {lang === 'fa' ? 'پروفایل متخصص یافت نشد' : 'Specialist profile not found'}
          </h2>
          <Link to="/explore" className="owj-btn owj-btn--dark">
            {lang === 'fa' ? 'مشاهده همه متخصصان' : 'Browse Marketplace'}
          </Link>
        </Container>
      </PageTransition>
    );
  }

  const location = getLocationById(pro.locationId);
  const isFav = isMarketplaceMember && favoritePros.includes(pro.id);
  const isOwnProfile = hasToken && isProfessional && user?.proId === pro.id;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSavePro = () => {
    if (!hasToken) {
      navigate('/auth/login', { state: { from: `/professionals/${pro.id}` } });
      return;
    }
    if (!isMarketplaceMember) return;
    const saved = toggleFavoritePro(pro.id);
    showToast({
      title: saved
        ? lang === 'fa'
          ? 'متخصص در علاقه‌مندی‌ها ذخیره شد'
          : 'Specialist Saved'
        : lang === 'fa'
        ? 'از علاقه‌مندی‌ها حذف شد'
        : 'Removed from Saved',
      type: saved ? 'success' : 'info',
    });
  };

  return (
    <PageTransition>
      {/* Subtle Architectural Cover Backdrop */}
      <div className={styles.heroBackdrop}>
        <SmartImage src={pro.cover} alt={l(pro.name)} />
        <div className={styles.backLinkWrap}>
          <Container maxWidth="xl">
            <Link to="/explore?tab=professionals" className={styles.backPill}>
              <BackIcon size={14} />
              <span>{lang === 'fa' ? 'بازگشت به کاوش متخصصان' : 'Back to Specialists'}</span>
            </Link>
          </Container>
        </div>
      </div>

      <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 9 } }}>
        {/* Redesigned Editorial Specialist Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.topProfileGrid}>
            {/* Identity Column */}
            <div className={styles.identityRow}>
              <div className={styles.avatarFrame}>
                <SmartImage src={pro.avatar} alt={l(pro.name)} />
                {pro.availableNow && <span className={styles.onlineBadge} />}
              </div>

              <div className={styles.identityBody}>
                <div className={styles.nameHeadingRow}>
                  <h1 className={styles.proName}>{l(pro.name)}</h1>
                  {pro.verified && (
                    <span className={styles.verifiedChip}>
                      <BadgeCheck size={14} />
                      <span>{lang === 'fa' ? 'احراز هویت‌شده' : 'Verified'}</span>
                    </span>
                  )}
                </div>

                <p className={styles.proHeadline}>{l(pro.title)}</p>

                <div className={styles.metaRow}>
                  <span className={styles.ratingPill}>
                    <Star size={13} fill="#E59934" color="#E59934" />
                    <span>
                      {lang === 'fa' ? toPersianDigits(pro.rating) : pro.rating} (
                      {formatNumber(pro.reviewCount, lang)}{' '}
                      {lang === 'fa' ? 'دیدگاه' : 'reviews'})
                    </span>
                  </span>

                  <span className={styles.metaPill}>
                    <MapPin size={14} />
                    <span>{l(location.name)}</span>
                  </span>

                  <span className={styles.metaPill}>
                    <Briefcase size={14} />
                    <span>
                      {formatNumber(pro.experienceYears, lang)}{' '}
                      {lang === 'fa' ? 'سال تجربه تخصصی' : 'yrs experience'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Cohesive Dedicated Contact & Actions Card */}
            <div className={styles.actionCard}>
              <div className={styles.actionStatusRow}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <span className={styles.pulseDot} />
                  {pro.availableNow
                    ? lang === 'fa'
                      ? 'آماده پذیرش پروژه'
                      : 'Available for Projects'
                    : lang === 'fa'
                    ? 'پاسخ‌گویی با هماهنگی'
                    : 'By Appointment'}
                </span>
                <span style={{ fontWeight: 700, color: '#11120F' }}>
                  {l(pro.responseTime)}
                </span>
              </div>

              {isAdmin ? (
                <div className={styles.primaryWithIconsRow}>
                  <button
                    type="button"
                    onClick={() => {
                      adminUpdateSpecialist(pro.id, { verified: !pro.verified });
                      showToast({
                        title: !pro.verified
                          ? lang === 'fa'
                            ? 'نشان تایید تخصصی فعال شد'
                            : 'Specialist Verified'
                          : lang === 'fa'
                          ? 'نشان تایید برداشته شد'
                          : 'Verification Revoked',
                        type: 'info',
                      });
                    }}
                    className={styles.primaryActionBtn}
                  >
                    <BadgeCheck size={16} color="#C7F36B" />
                    <span>
                      {pro.verified
                        ? lang === 'fa'
                          ? 'لغو نشان تایید'
                          : 'Revoke Badge'
                        : lang === 'fa'
                        ? 'اعطای نشان تایید'
                        : 'Verify Specialist'}
                    </span>
                  </button>
                  <Tooltip title={lang === 'fa' ? 'مدیریت در CRM' : 'Open Admin CRM'} arrow>
                    <Link to="/admin" className={styles.iconActionBtn} aria-label="Admin CRM">
                      <ShieldCheck size={16} />
                    </Link>
                  </Tooltip>
                  <Tooltip title={ui.common.share} arrow>
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className={styles.iconActionBtn}
                      aria-label={ui.common.share}
                    >
                      <Share2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              ) : isOperator ? (
                <div className={styles.primaryWithIconsRow}>
                  <Link to="/operator" className={styles.primaryActionBtn}>
                    <Headset size={16} color="#C7F36B" />
                    <span>{lang === 'fa' ? 'میز پشتیبانی' : 'Operator Desk'}</span>
                  </Link>
                  <Tooltip title={ui.common.share} arrow>
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className={styles.iconActionBtn}
                      aria-label={ui.common.share}
                    >
                      <Share2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              ) : isOwnProfile ? (
                <div className={styles.primaryWithIconsRow}>
                  <Link to="/create-ad" className={styles.primaryActionBtn}>
                    <Plus size={16} color="#C7F36B" />
                    <span>{lang === 'fa' ? 'ثبت آگهی جدید' : 'New Service'}</span>
                  </Link>
                  <Tooltip title={lang === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'} arrow>
                    <Link
                      to="/profile/edit"
                      className={styles.iconActionBtn}
                      aria-label="Edit Profile"
                    >
                      <Edit3 size={16} />
                    </Link>
                  </Tooltip>
                  <Tooltip title={ui.common.share} arrow>
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className={styles.iconActionBtn}
                      aria-label={ui.common.share}
                    >
                      <Share2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              ) : hasToken ? (
                <>
                  <div className={styles.primaryWithIconsRow}>
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                      className={styles.primaryActionBtn}
                    >
                      <MessageSquare size={16} color="#C7F36B" />
                      <span>
                        {isProfessional
                          ? lang === 'fa'
                            ? 'پیام به متخصص'
                            : 'Message Pro'
                          : lang === 'fa'
                          ? 'ارتباط با متخصص'
                          : 'Contact Pro'}
                      </span>
                    </button>

                    <Tooltip title={isFav ? ui.common.saved : ui.common.save} arrow>
                      <button
                        type="button"
                        onClick={handleSavePro}
                        className={`${styles.iconActionBtn} ${
                          isFav ? styles.savedState : ''
                        }`}
                        aria-label={isFav ? ui.common.saved : ui.common.save}
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </Tooltip>

                    <Tooltip title={ui.common.share} arrow>
                      <button
                        type="button"
                        onClick={() => setShareOpen(true)}
                        className={styles.iconActionBtn}
                        aria-label={ui.common.share}
                      >
                        <Share2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </>
              ) : (
                <div className={styles.primaryWithIconsRow}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/auth/login', {
                        state: { from: `/professionals/${pro.id}` },
                      })
                    }
                    className={styles.primaryActionBtn}
                  >
                    <LogIn size={16} color="#C7F36B" />
                    <span>
                      {lang === 'fa' ? 'ورود برای پیام' : 'Sign In to Message'}
                    </span>
                  </button>

                  <Tooltip title={ui.common.share} arrow>
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className={styles.iconActionBtn}
                      aria-label={ui.common.share}
                    >
                      <Share2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* 4-Column Structured Metrics Strip */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <strong>{formatNumber(pro.completedJobs, lang)}</strong>
              <span>{lang === 'fa' ? 'پروژه موفق تکمیل‌شده' : 'Completed Jobs'}</span>
            </div>
            <div className={styles.statBox}>
              <strong>{l(pro.responseTime)}</strong>
              <span>{lang === 'fa' ? 'میانگین سرعت پاسخ‌گویی' : 'Avg. Response Time'}</span>
            </div>
            <div className={styles.statBox}>
              <strong>{formatNumber(proAds.length, lang)}</strong>
              <span>{lang === 'fa' ? 'آگهی خدمت فعال' : 'Active Services'}</span>
            </div>
            <div className={styles.statBox}>
              <strong dir="ltr" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                {pro.availability?.hours || '09:00 - 20:00'}
              </strong>
              <span>{lang === 'fa' ? 'ساعات پاسخ‌گویی' : 'Working Hours'}</span>
            </div>
          </div>

          {/* MUI Scrollable Tabs */}
          <Box sx={{ mt: 2, borderBottom: '1px solid rgba(17,18,15,0.08)' }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  minHeight: 46,
                  color: '#666860',
                },
                '& .Mui-selected': {
                  color: '#11120F !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#11120F',
                  height: 3,
                  borderRadius: '3px',
                },
              }}
            >
              <Tab
                value="about"
                label={lang === 'fa' ? 'درباره و تخصص‌ها' : 'About & Skills'}
              />
              <Tab
                value="services"
                label={`${lang === 'fa' ? 'خدمات فعال' : 'Services'} (${formatNumber(
                  proAds.length,
                  lang
                )})`}
              />
              <Tab
                value="portfolio"
                label={`${lang === 'fa' ? 'نمونه‌کارها' : 'Portfolio'} (${formatNumber(
                  pro.portfolio?.length || 0,
                  lang
                )})`}
              />
              <Tab
                value="reviews"
                label={`${lang === 'fa' ? 'دیدگاه مشتریان' : 'Reviews'} (${formatNumber(
                  proReviews.length,
                  lang
                )})`}
              />
            </Tabs>
          </Box>
        </div>

        {/* Tab Content Panels */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 'about' && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 7.5 }}>
                <div className={styles.panelCard}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                    {lang === 'fa' ? 'معرفی حرفه‌ای' : 'Biography'}
                  </h2>
                  <p style={{ lineHeight: 1.9, color: '#3b3e36', fontSize: '0.92rem' }}>
                    {l(pro.bio)}
                  </p>

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      marginTop: '1.65rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {lang === 'fa' ? 'تخصص‌ها و مهارت‌های کلیدی' : 'Core Skills'}
                  </h3>
                  <Stack direction="row" spacing={0.85} flexWrap="wrap" useFlexGap>
                    {(pro.skills || []).map((sk, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.38rem 0.85rem',
                          borderRadius: '999px',
                          background: '#F6F5F0',
                          border: '1px solid rgba(17,18,15,0.08)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        }}
                      >
                        {l(sk)}
                      </span>
                    ))}
                  </Stack>
                </div>
              </Grid>

              <Grid size={{ xs: 12, lg: 4.5 }}>
                <div className={styles.panelCard}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {lang === 'fa' ? 'گواهی‌نامه‌ها و اطلاعات کاری' : 'Credentials & Details'}
                  </h3>
                  <Stack spacing={1.5} sx={{ fontSize: '0.86rem' }}>
                    {(pro.certifications || []).map((cert, idx) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}
                      >
                        <Award size={16} color="#289e67" />
                        <span>{l(cert)}</span>
                      </div>
                    ))}
                    {(pro.languages || []).length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <Globe size={16} color="#464841" />
                        <span>
                          <strong>{lang === 'fa' ? 'زبان‌ها: ' : 'Languages: '}</strong>
                          {(pro.languages || [])
                            .map((lg) => l(lg))
                            .join(lang === 'fa' ? '، ' : ', ')}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Clock size={16} color="#464841" />
                      <span>
                        <strong>{lang === 'fa' ? 'برنامه حضور: ' : 'Schedule: '}</strong>
                        {formatAvailabilityDays(pro.availability?.days, lang)}{' '}
                        ({pro.availability?.hours || '09:00 - 20:00'})
                      </span>
                    </div>
                  </Stack>
                </div>
              </Grid>
            </Grid>
          )}

          {activeTab === 'services' && (
            <Grid container spacing={2.5}>
              {proAds.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <div className={styles.panelCard}>
                    <p style={{ color: '#666860' }}>
                      {lang === 'fa'
                        ? 'در حال حاضر آگهی فعالی برای این متخصص ثبت نشده است.'
                        : 'No active services listed at the moment.'}
                    </p>
                  </div>
                </Grid>
              ) : (
                proAds.map((ad) => (
                  <Grid key={ad.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <ServiceCard ad={ad} />
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {activeTab === 'portfolio' && (
            <Grid container spacing={2.5}>
              {(pro.portfolio || []).length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <div className={styles.panelCard}>
                    <p style={{ color: '#666860' }}>
                      {lang === 'fa'
                        ? 'هنوز نمونه‌کاری بارگذاری نشده است.'
                        : 'No portfolio items uploaded yet.'}
                    </p>
                  </div>
                </Grid>
              ) : (
                (pro.portfolio || []).map((item) => (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <div className={styles.portfolioCard}>
                      <div className={styles.portfolioImg}>
                        <SmartImage src={item.image} alt={l(item.title)} />
                      </div>
                      <div style={{ padding: '0.95rem 1.15rem' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <strong style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                            {l(item.title)}
                          </strong>
                          {item.year && (
                            <span style={{ fontSize: '0.74rem', color: '#666860', fontWeight: 700 }}>
                              {item.year}
                            </span>
                          )}
                        </Stack>
                        {item.summary && (
                          <p style={{ fontSize: '0.82rem', color: '#666860', marginTop: 4 }}>
                            {l(item.summary)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.panelCard}>
              {proReviews.length === 0 ? (
                <p style={{ color: '#666860' }}>
                  {lang === 'fa' ? 'هنوز دیدگاهی ثبت نشده است.' : 'No reviews yet.'}
                </p>
              ) : (
                proReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      paddingBlock: '1.1rem',
                      borderBottom: '1px solid rgba(17,18,15,0.08)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            overflow: 'hidden',
                          }}
                        >
                          <SmartImage
                            src={rev.avatar || rev.authorAvatar}
                            alt={l(rev.author || rev.authorName)}
                          />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.88rem' }}>
                            {l(rev.author || rev.authorName)}
                          </strong>
                          <div style={{ fontSize: '0.74rem', color: '#92948c' }}>
                            {formatRelativeTime(rev.createdAt, lang)}
                          </div>
                        </div>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span style={{ fontWeight: 800, color: '#E59934' }}>★ {rev.rating}.0</span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteReview(rev.id);
                              showToast({
                                title:
                                  lang === 'fa'
                                    ? 'دیدگاه توسط ادمین حذف شد'
                                    : 'Review Removed by Admin',
                                type: 'info',
                              });
                            }}
                            className="owj-btn owj-btn--danger owj-btn--sm"
                            aria-label="Remove review"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </Stack>
                    </Stack>
                    <p style={{ marginTop: '0.6rem', fontSize: '0.88rem', lineHeight: 1.75 }}>
                      {l(rev.comment)}
                    </p>
                    {rev.reply && (
                      <div
                        style={{
                          marginTop: '0.6rem',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '10px',
                          background: '#F6F5F0',
                          fontSize: '0.83rem',
                        }}
                      >
                        <strong>{lang === 'fa' ? 'پاسخ متخصص: ' : 'Specialist reply: '}</strong>
                        {l(rev.reply)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Box>
      </Container>

      {isMarketplaceMember && (
        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          pro={pro}
          serviceTitle={pro.title}
        />
      )}

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={l(pro.name)}
      />
    </PageTransition>
  );
}
