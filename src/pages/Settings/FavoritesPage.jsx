import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Tabs, Tab, Box } from '@mui/material';
import PageTransition from '../../components/common/PageTransition';
import ServiceCard from '../../components/marketplace/ServiceCard';
import ProfessionalCard from '../../components/profile/ProfessionalCard';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatNumber } from '../../utils/formatters';
import styles from './SettingsPages.module.scss';

export default function FavoritesPage() {
  const { lang } = useLanguage();
  const { advertisements, professionals, favoriteAds, favoritePros } = useMarketplace();
  const [tab, setTab] = useState('services');

  const savedAds = advertisements.filter((a) => favoriteAds.includes(a.id));
  const savedPros = professionals.filter((p) => favoritePros.includes(p.id));

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)', fontWeight: 900, marginBottom: '1.25rem' }}>
          {lang === 'fa' ? 'لیست علاقه‌مندی‌های من' : 'My Saved Favorites'}
        </h1>

        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid rgba(17,18,15,0.08)',
            px: 1,
            mb: 3,
            display: 'inline-block',
            maxWidth: '100%',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.9rem',
                minHeight: 46,
                color: '#666860',
              },
              '& .Mui-selected': {
                color: '#11120F !important',
              },
            }}
          >
            <Tab
              value="services"
              label={
                lang === 'fa'
                  ? `خدمات ذخیره‌شده (${formatNumber(savedAds.length, lang)})`
                  : `Saved Services (${savedAds.length})`
              }
            />
            <Tab
              value="pros"
              label={
                lang === 'fa'
                  ? `متخصصان ذخیره‌شده (${formatNumber(savedPros.length, lang)})`
                  : `Saved Specialists (${savedPros.length})`
              }
            />
          </Tabs>
        </Box>

        {tab === 'services' ? (
          savedAds.length === 0 ? (
            <div className={styles.panel} style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ marginBottom: '1rem', color: '#666860' }}>
                {lang === 'fa'
                  ? 'هنوز خدمتی را ذخیره نکرده‌اید.'
                  : 'You have not saved any services yet.'}
              </p>
              <Link to="/explore" className="owj-btn owj-btn--lime">
                {lang === 'fa' ? 'کاوش بازارگاه' : 'Explore Services'}
              </Link>
            </div>
          ) : (
            <Grid container spacing={2.5}>
              {savedAds.map((ad) => (
                <Grid key={ad.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ServiceCard ad={ad} />
                </Grid>
              ))}
            </Grid>
          )
        ) : savedPros.length === 0 ? (
          <div className={styles.panel} style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ marginBottom: '1rem', color: '#666860' }}>
              {lang === 'fa'
                ? 'هنوز متخصصی را ذخیره نکرده‌اید.'
                : 'You have not saved any specialists yet.'}
            </p>
            <Link to="/explore" className="owj-btn owj-btn--lime">
              {lang === 'fa' ? 'مشاهده متخصصان' : 'Discover Specialists'}
            </Link>
          </div>
        ) : (
          <Grid container spacing={2.5}>
            {savedPros.map((pro) => (
              <Grid key={pro.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ProfessionalCard pro={pro} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageTransition>
  );
}
