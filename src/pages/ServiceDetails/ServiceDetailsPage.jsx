import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Stack, Tooltip, Chip } from '@mui/material';
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Flag,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  Edit3,
  LogIn,
  Sparkles,
  ShieldCheck,
  Headset,
  PauseCircle,
  PlayCircle,
  Trash2,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import Modal from '../../components/common/Modal';
import ServiceCard from '../../components/marketplace/ServiceCard';
import ContactModal from '../../components/marketplace/ContactModal';
import ShareModal from '../../components/marketplace/ShareModal';
import ReportModal from '../../components/marketplace/ReportModal';
import { getCategoryById } from '../../data/categories';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import {
  formatPrice,
  formatNumber,
  formatRelativeTime,
  toPersianDigits,
} from '../../utils/formatters';
import styles from './ServiceDetailsPage.module.scss';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, l, ui } = useLanguage();
  const {
    user,
    hasToken,
    isCustomer,
    isProfessional,
    isOperator,
    isAdmin,
    isMarketplaceMember,
  } = useAuth();
  const {
    categories,
    advertisements,
    professionals,
    reviews,
    favoriteAds,
    toggleFavoriteAd,
    updateAdvertisement,
    addReview,
    replyToReview,
    deleteReview,
  } = useMarketplace();
  const { showToast } = useToast();

  const ad = advertisements.find((a) => a.id === id);

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ownerReplyDrafts, setOwnerReplyDrafts] = useState({});

  const pro = useMemo(() => {
    if (!ad) return null;
    return professionals.find((p) => p.id === ad.proId) || professionals[0];
  }, [ad, professionals]);

  const adReviews = useMemo(() => {
    if (!ad) return [];
    return reviews.filter((r) => r.adId === ad.id || r.proId === ad.proId);
  }, [ad, reviews]);

  const relatedAds = useMemo(() => {
    if (!ad) return [];
    return advertisements
      .filter(
        (item) =>
          item.id !== ad.id && item.categoryId === ad.categoryId && item.status === 'active'
      )
      .slice(0, 3);
  }, [ad, advertisements]);

  if (!ad) {
    return (
      <PageTransition>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>
            {lang === 'fa' ? 'آگهی موردنظر یافت نشد' : 'Service listing not found'}
          </h2>
          <Link to="/explore" className="owj-btn owj-btn--dark">
            {lang === 'fa' ? 'بازگشت به کاوش خدمات' : 'Back to Explore'}
          </Link>
        </Container>
      </PageTransition>
    );
  }

  const category =
    categories.find((c) => c.id === ad.categoryId) || getCategoryById(ad.categoryId);
  const location = getLocationById(ad.locationId);
  const isFav = isMarketplaceMember && favoriteAds.includes(ad.id);
  const images = ad.images?.length ? ad.images : [category.cover];
  const currentImg = images[activeImgIdx] || images[0];
  const isOwner =
    hasToken &&
    isProfessional &&
    user &&
    (user.id === ad.ownerUserId || user.proId === ad.proId);

  const handleFavorite = () => {
    if (!isMarketplaceMember) return;
    const added = toggleFavoriteAd(ad.id);
    showToast({
      title: added
        ? lang === 'fa'
          ? 'به علاقه‌مندی‌ها اضافه شد'
          : 'Saved to Favorites'
        : lang === 'fa'
        ? 'از علاقه‌مندی‌ها حذف شد'
        : 'Removed from Favorites',
      type: added ? 'success' : 'info',
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isCustomer || !reviewText.trim()) return;

    addReview({
      adId: ad.id,
      proId: pro?.id,
      rating: reviewRating,
      comment: reviewText.trim(),
    });
    setReviewText('');
    showToast({
      title: lang === 'fa' ? 'دیدگاه شما ثبت شد' : 'Review Published',
      type: 'success',
    });
  };

  const handleOwnerReply = (reviewId) => {
    const draft = (ownerReplyDrafts[reviewId] || '').trim();
    if (!draft) return;
    replyToReview(reviewId, draft);
    setOwnerReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
    showToast({
      title: lang === 'fa' ? 'پاسخ رسمی ثبت شد' : 'Specialist Reply Published',
      type: 'success',
    });
  };

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 }, pb: { xs: 6, md: 9 } }}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">{ui.nav.home}</Link>
          <span>/</span>
          <Link to="/explore">{ui.nav.explore}</Link>
          <span>/</span>
          <Link to={`/explore?category=${category.id}`}>{l(category.name)}</Link>
        </nav>

        {/* Paused notice for Owner / Admin */}
        {ad.status === 'paused' && (
          <div
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: '14px',
              background: 'rgba(229,153,52,0.16)',
              color: '#7a4b0b',
              fontWeight: 700,
              fontSize: '0.84rem',
              marginBottom: '1rem',
            }}
          >
            {lang === 'fa'
              ? 'این آگهی هم‌اکنون در وضعیت متوقف موقت قرار دارد و در نتایج عمومی کاوش نمایش داده نمی‌شود.'
              : 'This listing is currently paused and hidden from public marketplace search.'}
          </div>
        )}

        {/* Title & Separated Icon-Only Actions */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <div>
            <h1 className={styles.title}>{l(ad.title)}</h1>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1, fontSize: '0.86rem', color: '#666860' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 700,
                  color: '#11120F',
                }}
              >
                <Star size={15} fill="#E59934" color="#E59934" />
                {lang === 'fa' ? toPersianDigits(ad.rating) : ad.rating} (
                {formatNumber(adReviews.length || ad.reviewCount, lang)} {ui.common.reviews})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={15} />
                {l(location.name)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Eye size={15} />
                {formatNumber(ad.views || 320, lang)} {lang === 'fa' ? 'بازدید' : 'views'}
              </span>
            </Stack>
          </div>

          {/* Separated 38x38 icon-only buttons — strictly role-aware */}
          <div className={styles.actionCluster}>
            {isOwner && (
              <Tooltip title={lang === 'fa' ? 'ویرایش آگهی' : 'Edit Listing'} arrow>
                <Link
                  to={`/edit-ad/${ad.id}`}
                  className={`${styles.iconOnlyBtn} ${styles.iconOnlyActive}`}
                  aria-label={lang === 'fa' ? 'Edit Listing' : 'Edit Listing'}
                >
                  <Edit3 size={16} />
                </Link>
              </Tooltip>
            )}

            {isMarketplaceMember && !isOwner && (
              <Tooltip title={isFav ? ui.common.saved : ui.common.save} arrow>
                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`${styles.iconOnlyBtn} ${isFav ? styles.iconOnlyActive : ''}`}
                  aria-label={isFav ? ui.common.saved : ui.common.save}
                >
                  <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
            )}

            <Tooltip title={ui.common.share} arrow>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className={styles.iconOnlyBtn}
                aria-label={ui.common.share}
              >
                <Share2 size={16} />
              </button>
            </Tooltip>

            {/* Report only for Guest, Customer, or non-owner Professional */}
            {!isOwner && !isAdmin && !isOperator && (
              <Tooltip title={ui.common.report} arrow>
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className={`${styles.iconOnlyBtn} ${styles.iconOnlyReport}`}
                  aria-label={ui.common.report}
                >
                  <Flag size={16} />
                </button>
              </Tooltip>
            )}
          </div>
        </Stack>

        {/* Responsive Main MUI Grid */}
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: 7.7 }}>
            {/* Gallery */}
            <div className={styles.galleryMain} onClick={() => setLightboxOpen(true)}>
              <SmartImage src={currentImg} alt={l(ad.title)} />
            </div>

            {images.length > 1 && (
              <div className={styles.thumbStrip}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`${styles.thumbBtn} ${
                      activeImgIdx === idx ? styles.thumbActive : ''
                    }`}
                  >
                    <SmartImage src={imgUrl} alt={`Gallery ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Full Description */}
            <div className={styles.contentCard}>
              <h2 className={styles.secTitle}>
                {lang === 'fa' ? 'شرح کامل خدمت و جزئیات اجرایی' : 'Service Overview & Scope'}
              </h2>
              <p style={{ lineHeight: 1.9, color: '#33372f', fontSize: '0.96rem' }}>
                {l(ad.description)}
              </p>

              {ad.deliverables?.length > 0 && (
                <div style={{ marginTop: '1.6rem' }}>
                  <h3 className={styles.secTitle}>
                    {lang === 'fa' ? 'موارد تحویلی و تعهدات' : 'Included Deliverables'}
                  </h3>
                  <div className={styles.deliverableList}>
                    {ad.deliverables.map((d, i) => (
                      <div key={i} className={styles.deliverableItem}>
                        <CheckCircle2 size={18} color="#289e67" />
                        <span>{l(d)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skills & Availability */}
            <div className={styles.contentCard}>
              <h2 className={styles.secTitle}>
                {lang === 'fa' ? 'مهارت‌ها و تخصص‌های مرتبط' : 'Skills & Specialties'}
              </h2>
              <div className={styles.skillTags}>
                {(ad.skills || []).map((sk, idx) => (
                  <Link
                    key={idx}
                    to={`/explore?q=${encodeURIComponent(l(sk))}`}
                    className={styles.skillPill}
                  >
                    {l(sk)}
                  </Link>
                ))}
              </div>

              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: '1px solid rgba(17,18,15,0.08)',
                  fontSize: '0.88rem',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={16} />
                  <strong>{lang === 'fa' ? 'ساعات پاسخ‌گویی:' : 'Hours:'}</strong>{' '}
                  {ad.availabilityHours || pro?.availability?.hours || '09:00 - 20:00'}
                </span>
                {ad.urgentAvailable && (
                  <span style={{ color: '#289e67', fontWeight: 700 }}>
                    • {ui.common.urgentBadge}
                  </span>
                )}
                {ad.remoteAvailable && (
                  <span style={{ fontWeight: 700 }}>• {ui.common.remoteBadge}</span>
                )}
              </Stack>
            </div>

            {/* Reviews Section */}
            <div className={styles.contentCard}>
              <h2 className={styles.secTitle}>
                {lang === 'fa'
                  ? `دیدگاه و امتیاز کارفرمایان (${formatNumber(adReviews.length, lang)})`
                  : `Client Reviews (${adReviews.length})`}
              </h2>

              {adReviews.map((rev) => (
                <div key={rev.id} className={styles.reviewItem}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden' }}>
                        <SmartImage
                          src={rev.avatar || rev.authorAvatar}
                          alt={l(rev.author || rev.authorName)}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                          {l(rev.author || rev.authorName)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#92948c' }}>
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
                          title={lang === 'fa' ? 'حذف دیدگاه' : 'Remove Review'}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </Stack>
                  </Stack>

                  <p style={{ marginTop: '0.65rem', fontSize: '0.9rem', lineHeight: 1.75 }}>
                    {l(rev.comment)}
                  </p>

                  {rev.reply ? (
                    <div
                      style={{
                        marginTop: '0.65rem',
                        padding: '0.7rem 0.95rem',
                        borderRadius: '10px',
                        background: '#F6F5F0',
                        fontSize: '0.84rem',
                      }}
                    >
                      <strong>{lang === 'fa' ? 'پاسخ متخصص: ' : 'Specialist reply: '}</strong>
                      {l(rev.reply)}
                    </div>
                  ) : (
                    isOwner && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.7rem' }}>
                        <input
                          type="text"
                          value={ownerReplyDrafts[rev.id] || ''}
                          onChange={(e) =>
                            setOwnerReplyDrafts((prev) => ({
                              ...prev,
                              [rev.id]: e.target.value,
                            }))
                          }
                          placeholder={
                            lang === 'fa'
                              ? 'ثبت پاسخ رسمی متخصص به این دیدگاه...'
                              : 'Write your official specialist reply...'
                          }
                          style={{
                            flex: 1,
                            padding: '0.52rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(17,18,15,0.14)',
                            fontSize: '0.84rem',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleOwnerReply(rev.id)}
                          className="owj-btn owj-btn--dark owj-btn--sm"
                        >
                          {lang === 'fa' ? 'ارسال پاسخ' : 'Reply'}
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}

              {/* Review submission strictly for Customers (Guests see login prompt; Owners reply above) */}
              {isCustomer ? (
                <form
                  onSubmit={handleReviewSubmit}
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.35rem',
                    borderTop: '1px solid rgba(17,18,15,0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    {lang === 'fa' ? 'ثبت امتیاز و تجربه شما' : 'Write a Client Review'}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        style={{
                          padding: '0.3rem 0.55rem',
                          borderRadius: '8px',
                          background: reviewRating >= star ? '#11120F' : '#F6F5F0',
                          color: reviewRating >= star ? '#C7F36B' : '#92948C',
                          fontWeight: 700,
                        }}
                      >
                        ★ {star}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      lang === 'fa'
                        ? 'تجربه همکاری خود را با این متخصص بنویسید...'
                        : 'Share your experience working with this specialist...'
                    }
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(17,18,15,0.14)',
                      marginBottom: '0.8rem',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!reviewText.trim()}
                    className="owj-btn owj-btn--dark owj-btn--sm"
                  >
                    {lang === 'fa' ? 'ارسال دیدگاه' : 'Submit Review'}
                  </button>
                </form>
              ) : !hasToken ? (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '1rem 1.15rem',
                    borderRadius: '14px',
                    background: '#F6F5F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.88rem', color: '#464841', fontWeight: 600 }}>
                    {lang === 'fa'
                      ? 'برای ثبت امتیاز و دیدگاه کارفرما، وارد حساب کاربری خود شوید.'
                      : 'Sign in with a Customer account to rate and review this service.'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/auth/login', { state: { from: `/services/${ad.id}` } })
                    }
                    className="owj-btn owj-btn--dark owj-btn--sm"
                  >
                    <LogIn size={15} />
                    <span>{ui.nav.login}</span>
                  </button>
                </div>
              ) : isOwner ? (
                <div
                  style={{
                    marginTop: '1.15rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: '#F6F5F0',
                    fontSize: '0.84rem',
                    color: '#464841',
                  }}
                >
                  {lang === 'fa'
                    ? 'شما صاحب این آگهی هستید و می‌توانید به دیدگاه‌های کارفرمایان در بالا پاسخ رسمی ثبت کنید.'
                    : 'You own this listing and can publish official replies to client reviews above.'}
                </div>
              ) : null}
            </div>
          </Grid>

          {/* Sticky Pricing & Role-Specific Sidebar */}
          <Grid size={{ xs: 12, lg: 4.3 }}>
            <aside className={styles.stickySidebar}>
              <div className={styles.pricingCard}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <span style={{ fontSize: '0.8rem', color: 'rgba(246,245,240,0.68)' }}>
                    {l(ad.pricingType)}
                  </span>
                  {ad.featured && (
                    <Chip
                      size="small"
                      label={lang === 'fa' ? 'منتخب اوجیفای' : 'Featured'}
                      sx={{
                        height: 20,
                        bgcolor: 'rgba(199,243,107,0.22)',
                        color: '#C7F36B',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                      }}
                    />
                  )}
                </Stack>
                <div className={styles.priceBig}>{formatPrice(ad, lang)}</div>
                <p
                  style={{
                    fontSize: '0.83rem',
                    color: 'rgba(246,245,240,0.7)',
                    marginTop: '0.6rem',
                    lineHeight: 1.65,
                  }}
                >
                  {lang === 'fa'
                    ? 'برآورد نهایی پس از بررسی جزئیات پروژه اعلام می‌گردد.'
                    : 'Exact quote finalized based on your project scope.'}
                </p>

                {/* Strictly Role-Differentiated Primary Sidebar Actions */}
                {isAdmin ? (
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus = ad.status === 'paused' ? 'active' : 'paused';
                        updateAdvertisement(ad.id, { status: nextStatus });
                        showToast({
                          title:
                            nextStatus === 'paused'
                              ? lang === 'fa'
                                ? 'آگهی توسط ادمین متوقف شد'
                                : 'Listing Paused by Admin'
                              : lang === 'fa'
                              ? 'آگهی مجدداً فعال شد'
                              : 'Listing Activated by Admin',
                          type: 'info',
                        });
                      }}
                      className="owj-btn owj-btn--lime"
                      style={{ width: '100%' }}
                    >
                      {ad.status === 'paused' ? (
                        <PlayCircle size={17} />
                      ) : (
                        <PauseCircle size={17} />
                      )}
                      <span>
                        {ad.status === 'paused'
                          ? lang === 'fa'
                            ? 'فعال‌سازی آگهی (مدیریت)'
                            : 'Activate Listing (Admin)'
                          : lang === 'fa'
                          ? 'توقف موقت آگهی (مدیریت)'
                          : 'Pause Listing (Admin)'}
                      </span>
                    </button>
                    <Link
                      to="/admin"
                      className="owj-btn owj-btn--outline-light"
                      style={{ width: '100%' }}
                    >
                      <ShieldCheck size={16} color="#C7F36B" />
                      <span>
                        {lang === 'fa' ? 'بازگشت به پنل ادمین' : 'Moderation Console'}
                      </span>
                    </Link>
                  </Stack>
                ) : isOperator ? (
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Link
                      to="/operator"
                      className="owj-btn owj-btn--lime"
                      style={{ width: '100%' }}
                    >
                      <Headset size={17} />
                      <span>
                        {lang === 'fa'
                          ? 'بررسی گزارش‌های مرتبط در میز اپراتور'
                          : 'Review in Operator Desk'}
                      </span>
                    </Link>
                  </Stack>
                ) : isOwner ? (
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Link
                      to={`/edit-ad/${ad.id}`}
                      className="owj-btn owj-btn--lime"
                      style={{ width: '100%' }}
                    >
                      <Edit3 size={17} />
                      <span>
                        {lang === 'fa' ? 'ویرایش این آگهی من' : 'Edit Your Listing'}
                      </span>
                    </Link>
                    <Link
                      to="/dashboard?tab=ads"
                      className="owj-btn owj-btn--outline-light"
                      style={{ width: '100%' }}
                    >
                      <span>
                        {lang === 'fa' ? 'مدیریت همه آگهی‌های من' : 'Manage My Listings'}
                      </span>
                    </Link>
                  </Stack>
                ) : hasToken ? (
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="owj-btn owj-btn--lime"
                    style={{ width: '100%', marginTop: '1.35rem' }}
                  >
                    <MessageSquare size={17} />
                    <span>
                      {isProfessional
                        ? lang === 'fa'
                          ? 'ارتباط و ارسال پیام به متخصص'
                          : 'Connect with Specialist'
                        : ui.common.contactPro}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/auth/login', { state: { from: `/services/${ad.id}` } })
                    }
                    className="owj-btn owj-btn--lime"
                    style={{ width: '100%', marginTop: '1.35rem' }}
                  >
                    <LogIn size={17} />
                    <span>
                      {lang === 'fa'
                        ? 'ورود برای ارسال پیام به متخصص'
                        : 'Log In to Contact Specialist'}
                    </span>
                  </button>
                )}
              </div>

              {pro && (
                <div className={styles.proSidebarCard}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px solid #C7F36B',
                        flexShrink: 0,
                      }}
                    >
                      <SmartImage src={pro.avatar} alt={l(pro.name)} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <strong style={{ fontSize: '1.05rem' }}>{l(pro.name)}</strong>
                        {pro.verified && <BadgeCheck size={16} color="#289e67" />}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666860', marginTop: 2 }}>
                        {l(pro.title)}
                      </div>
                    </div>
                  </Stack>

                  <Grid
                    container
                    spacing={1.5}
                    sx={{
                      mt: 2,
                      p: 1.5,
                      bgcolor: '#F6F5F0',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Grid size={{ xs: 6 }}>
                      <div style={{ color: '#666860' }}>
                        {lang === 'fa' ? 'پاسخ‌گویی' : 'Response'}
                      </div>
                      <strong>{l(pro.responseTime)}</strong>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <div style={{ color: '#666860' }}>
                        {lang === 'fa' ? 'پروژه‌های موفق' : 'Completed'}
                      </div>
                      <strong>{formatNumber(pro.completedJobs, lang)}</strong>
                    </Grid>
                  </Grid>

                  <Link
                    to={`/professionals/${pro.id}`}
                    className="owj-btn owj-btn--outline"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    {ui.common.viewProfile}
                  </Link>
                </div>
              )}
            </aside>
          </Grid>
        </Grid>

        {/* Related Services */}
        {relatedAds.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
              {lang === 'fa' ? 'خدمات مشابه در این دسته‌بندی' : 'Related Services'}
            </h2>
            <Grid container spacing={2.5}>
              {relatedAds.map((rel) => (
                <Grid key={rel.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ServiceCard ad={rel} />
                </Grid>
              ))}
            </Grid>
          </section>
        )}
      </Container>

      {/* Image Lightbox */}
      <Modal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={l(ad.title)}
        wide
      >
        <div style={{ borderRadius: '16px', overflow: 'hidden', maxHeight: '70vh' }}>
          <SmartImage src={currentImg} alt={l(ad.title)} />
        </div>
      </Modal>

      {isMarketplaceMember && (
        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          pro={pro}
          serviceTitle={ad.title}
        />
      )}

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        adId={ad.id}
        adTitle={l(ad.title)}
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={l(ad.title)}
      />
    </PageTransition>
  );
}
