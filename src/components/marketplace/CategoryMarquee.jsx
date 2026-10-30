import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CategoryMarquee.module.scss';

export default function CategoryMarquee() {
  const { l } = useLanguage();

  const items = CATEGORIES.flatMap((cat) =>
    cat.subcategories.slice(0, 3).map((sub) => ({
      key: `${cat.id}-${sub.id}`,
      catId: cat.id,
      subId: sub.id,
      label: l(sub.name),
    }))
  );

  const doubled = [...items, ...items];

  return (
    <section className={styles.marqueeSection} aria-label="Popular Professional Specialties">
      <div className={styles.track}>
        {doubled.map((item, idx) => (
          <Link
            key={`${item.key}-${idx}`}
            to={`/explore?category=${item.catId}&subcategory=${item.subId}`}
            className={styles.chip}
          >
            <span className={styles.dot} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
