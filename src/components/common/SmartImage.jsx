import { useState } from 'react';
import { OwjifySymbol } from '../../assets/brandMarks';
import styles from './SmartImage.module.scss';

export default function SmartImage({ src, alt = 'OWJIFY', className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {!loaded && !failed && <div className={styles.shimmer} aria-hidden="true" />}
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`${styles.img} ${loaded ? styles.loaded : styles.loading} ${imgClassName}`}
        />
      ) : (
        <div className={styles.fallback} role="img" aria-label={alt}>
          <OwjifySymbol size={30} darkBg />
          {alt && <span className={styles.fallbackLabel}>{alt}</span>}
        </div>
      )}
    </div>
  );
}
