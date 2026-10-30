import styles from './SkeletonCard.module.scss';

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.block} ${styles.cover}`} />
      <div className={styles.body}>
        <div className={`${styles.block} ${styles.lineShort}`} />
        <div className={`${styles.block} ${styles.lineLong}`} />
        <div className={`${styles.block} ${styles.lineMed}`} />
      </div>
    </div>
  );
}
