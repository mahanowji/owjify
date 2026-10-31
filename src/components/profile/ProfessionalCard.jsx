import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Star, MapPin, Heart } from 'lucide-react';
import SmartImage from '../common/SmartImage';
import { getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { useMotionSafe } from '../../hooks/useMotionSafe';
import { formatNumber, toPersianDigits } from '../../utils/formatters';
import styles from './ProfessionalCard.module.scss';

export default function ProfessionalCard({ pro }) {
  const { lang, l, ui } = useLanguage();
  const { isMarketplaceMember } = useAuth();
  const { favoritePros, toggleFavoritePro } = useMarketplace();
  const { showToast } = useToast();
  const { prefersReduced } = useMotionSafe();

  const isFav = isMarketplaceMember && favoritePros.includes(pro.id);
  const location = getLocationById(pro.locationId);

  const handleFav = () => {
    if (!isMarketplaceMember) return;
    const added = toggleFavoritePro(pro.id);
    showToast({
      title: added
        ? lang === 'fa'
          ? 'متخصص ذخیره شد'
          : 'Specialist Saved'
        : lang === 'fa'
        ? 'از متخصصان ذخیره‌شده حذف شد'
        : 'Removed from Saved',
      message: l(pro.name),
      type: added ? 'success' : 'info',
      duration: 2200,
    });
  };

  return (
    <motion.article
      className={styles.card}
      whileHover={prefersReduced ? undefined : { y: -5 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.top}>
        <Link to={`/professionals/${pro.id}`} className={styles.identity}>
          <div className={styles.avatarWrap}>
            <SmartImage src={pro.avatar} alt={l(pro.name)} />
            {pro.availableNow && <span className={styles.onlineDot} />}
          </div>
          <div>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{l(pro.name)}</h3>
              {pro.verified && <BadgeCheck size={16} color="#289e67" />}
            </div>
            <p className={styles.role}>{l(pro.title)}</p>
          </div>
        </Link>

        {/* Specialist Save button strictly for Customer & Professional roles */}
        {isMarketplaceMember && (
          <motion.button
            type="button"
            whileTap={prefersReduced ? undefined : { scale: 0.88 }}
            onClick={handleFav}
            className={`${styles.favBtn} ${isFav ? styles.active : ''}`}
            aria-label={isFav ? ui.common.saved : ui.common.save}
          >
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </motion.button>
        )}
      </div>

      <div className={styles.statsStrip}>
        <div>
          <div className={styles.statVal}>
            <Star size={13} fill="#E59934" color="#E59934" />
            <span>{lang === 'fa' ? toPersianDigits(pro.rating) : pro.rating}</span>
          </div>
          <div className={styles.statLbl}>{ui.common.reviews}</div>
        </div>
        <div>
          <div className={styles.statVal}>{formatNumber(pro.completedJobs, lang)}</div>
          <div className={styles.statLbl}>{ui.common.jobsDone}</div>
        </div>
        <div>
          <div className={styles.statVal}>+{formatNumber(pro.experienceYears, lang)}</div>
          <div className={styles.statLbl}>{ui.common.yearsExp}</div>
        </div>
      </div>

      <div className={styles.skills}>
        {(pro.skills || []).slice(0, 3).map((skill, idx) => (
          <span key={idx} className={styles.skillChip}>
            {l(skill)}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.loc}>
          <MapPin size={14} />
          <span>{l(location.name)}</span>
        </span>
        <Link to={`/professionals/${pro.id}`} className="owj-btn owj-btn--dark owj-btn--sm">
          {ui.common.viewProfile}
        </Link>
      </div>
    </motion.article>
  );
}
