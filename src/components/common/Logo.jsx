import { Link } from 'react-router-dom';
import { OwjifySymbol } from '../../assets/brandMarks';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Logo.module.scss';

export default function Logo({ variant = 'light', showSubtitle = false, size = 36 }) {
  const { lang } = useLanguage();
  const isLightText = variant === 'light';

  return (
    <Link
      to="/"
      className={`${styles.logo} ${isLightText ? styles.light : styles.dark}`}
      aria-label="OWJIFY Home"
    >
      <span className={styles.mark}>
        <OwjifySymbol size={size} darkBg={isLightText} />
      </span>
      <span className={styles.textGroup}>
        <span className={styles.wordmark}>
          OWJIFY
          <span className={styles.dot} />
        </span>
        {showSubtitle && (
          <span className={styles.sub}>
            {lang === 'fa' ? 'اوجیفای • خدمات تخصصی' : 'Specialist Network'}
          </span>
        )}
      </span>
    </Link>
  );
}
