import { useLanguage } from '../../context/LanguageContext';
import { formatNumber } from '../../utils/formatters';
import styles from './StatCard.module.scss';

export default function StatCard({ label, value, icon: Icon, trend, accent = false }) {
  const { lang } = useLanguage();

  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <span className={styles.iconBox}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className={styles.value}>
        {typeof value === 'number' ? formatNumber(value, lang) : value}
      </div>
      {trend && <div className={styles.trend}>{trend}</div>}
    </div>
  );
}
