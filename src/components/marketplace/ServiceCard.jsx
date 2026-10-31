import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, BadgeCheck, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import SmartImage from '../common/SmartImage';
import { getCategoryById } from '../../data/categories';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { useMotionSafe } from '../../hooks/useMotionSafe';
import { formatPrice, formatNumber, toPersianDigits } from '../../utils/formatters';
import styles from './ServiceCard.module.scss';

export default function ServiceCard({ ad, viewMode = 'grid' }) {
  const { lang, isRTL, l, ui } = useLanguage();
  const { isMarketplaceMember } = useAuth();
  const { categories, professionals, favoriteAds, toggleFavoriteAd } = useMarketplace();
  const { showToast } = useToast();
  const { prefersReduced } = useMotionSafe();

  const pro = professionals.find((p) => p.id === ad.proId) || professionals[0];
  const category =
    categories.find((c) => c.id === ad.categoryId) || getCategoryById(ad.categoryId);
  const location = getLocationById(ad.locationId);
  const isFav = isMarketplaceMember && favoriteAds.includes(ad.id);

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      message: l(ad.title),
      type: added ? 'success' : 'info',
      duration: 2400,
    });
  };

  const ArrowIcon = isRTL ? ArrowUpLeft : ArrowUpRight;
  const ratingText = lang === 'fa' ? toPersianDigits(ad.rating) : ad.rating;

  return (
    <motion.article
      className={`${styles.card} ${viewMode === 'list' ? styles.listMode : ''}`}
      whileHover={prefersReduced ? undefined : { y: -5 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.coverWrap}>
        <Link to={`/services/${ad.id}`} className={styles.coverMedia}>
          <SmartImage src={ad.images?.[0]} alt={l(ad.title)} />
        </Link>

        <div className={styles.topBadges}>
          <span className={styles.catBadge}>{l(category.name)}</span>
          {ad.urgentAvailable && (
            <span className={styles.urgentBadge}>
              {lang === 'fa' ? 'پاسخ فوری' : 'Express'}
            </span>
          )}
        </div>

        {/* Favorites strictly for Customer & Professional roles */}
        {isMarketplaceMember && (
          <motion.button
            type="button"
            whileTap={prefersReduced ? undefined : { scale: 0.88 }}
            className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
            onClick={handleToggleFav}
            aria-label={isFav ? ui.common.saved : ui.common.save}
          >
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </motion.button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.proRow}>
          <Link to={`/professionals/${pro?.id}`} className={styles.proLink}>
            <span className={styles.proAvatar}>
              <SmartImage src={pro?.avatar} alt={l(pro?.name)} />
            </span>
            <span className={styles.proName}>{l(pro?.name)}</span>
            {pro?.verified && <BadgeCheck size={15} color="#289e67" />}
          </Link>

          <div className={styles.ratingBox}>
            <Star size={13} fill="#E59934" color="#E59934" />
            <span>{ratingText}</span>
            <span className={styles.revCount}>({formatNumber(ad.reviewCount, lang)})</span>
          </div>
        </div>

        <Link to={`/services/${ad.id}`} className={styles.titleLink}>
          {l(ad.title)}
        </Link>

        <p className={styles.shortDesc}>{l(ad.shortDesc)}</p>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <MapPin size={14} />
            {l(location.name)}
          </span>
          {ad.remoteAvailable && (
            <span className={styles.metaItem}>
              • {lang === 'fa' ? 'امکان دورکاری' : 'Remote OK'}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <div>
            <span className={styles.priceLabel}>{ui.common.startingFrom}</span>
            <span className={styles.priceVal}>{formatPrice(ad, lang)}</span>
          </div>

          <Link to={`/services/${ad.id}`} className={styles.detailsBtn}>
            <span>{ui.common.viewDetails}</span>
            <ArrowIcon size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
