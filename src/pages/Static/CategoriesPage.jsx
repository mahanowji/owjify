import { Link } from 'react-router-dom';
import { Container, Grid, Stack } from '@mui/material';
import PageTransition from '../../components/common/PageTransition';
import CategoryIcon from '../../components/common/CategoryIcon';
import SmartImage from '../../components/common/SmartImage';
import { CATEGORIES } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.scss';

export default function CategoriesPage() {
  const { lang, l } = useLanguage();

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'درخت مهارت‌های اوجیفای' : 'Categories Directory'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa'
              ? '۸ حوزه اصلی و بیش از ۳۵ تخصص حرفه‌ای'
              : '8 Core Disciplines & 35+ Specialist Subcategories'}
          </h1>
          <p className={styles.heroLead}>
            {lang === 'fa'
              ? 'زیردسته موردنیاز خود را انتخاب کنید تا مستقیماً به آگهی‌های فیلترشده همان تخصص هدایت شوید.'
              : 'Select any main category or specialized craft below to explore matching verified services.'}
          </p>
        </Container>
      </section>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {CATEGORIES.map((cat) => (
            <Grid key={cat.id} size={{ xs: 12, md: 6 }}>
              <div className={styles.card} style={{ height: '100%' }}>
                <div
                  style={{
                    height: 180,
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginBottom: '1.15rem',
                  }}
                >
                  <SmartImage src={cat.cover} alt={l(cat.name)} />
                </div>

                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                  <CategoryIcon name={cat.icon} size={22} />
                  <Link
                    to={`/explore?category=${cat.id}`}
                    style={{ fontSize: '1.25rem', fontWeight: 900 }}
                  >
                    {l(cat.name)}
                  </Link>
                </Stack>

                <p style={{ fontSize: '0.88rem', color: '#666860', marginBottom: '1rem' }}>
                  {l(cat.tagline)}
                </p>

                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/explore?category=${cat.id}&subcategory=${sub.id}`}
                      className={styles.subPill}
                    >
                      {l(sub.name)}
                    </Link>
                  ))}
                </Stack>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageTransition>
  );
}
