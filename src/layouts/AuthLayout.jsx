import { Outlet } from 'react-router-dom';
import { Grid, Box, Stack } from '@mui/material';
import Logo from '../components/common/Logo';
import { useLanguage } from '../context/LanguageContext';
import { formatNumber } from '../utils/formatters';
import styles from './AuthLayout.module.scss';

export default function AuthLayout() {
  const { lang, toggleLang } = useLanguage();

  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: '#F6F5F0' }}>
      {/* Editorial Dark Left/Right Panel on Desktop (lg+) */}
      <Grid
        size={{ xs: 12, lg: 5.5 }}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: '#11120F',
          color: '#F6F5F0',
          p: { lg: 5.5, xl: 7 },
          backgroundImage:
            'radial-gradient(circle at 80% 15%, rgba(199,243,107,0.12), transparent 45%)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Logo variant="light" showSubtitle size={40} />
          <button type="button" onClick={toggleLang} className={styles.langToggle}>
            {lang === 'fa' ? 'EN / LTR' : 'فارسی / RTL'}
          </button>
        </Stack>

        <Box sx={{ maxWidth: 500, my: 'auto', py: 5 }}>
          <span className={styles.kicker}>
            {lang === 'fa' ? 'استاندارد جدید خدمات حرفه‌ای' : 'CURATED SPECIALIST NETWORK'}
          </span>
          <h1 className={styles.headline}>
            {lang === 'fa'
              ? '«متخصص درست، برای کاری که اهمیت دارد.»'
              : '“The right people. For the things that matter.”'}
          </h1>
          <p className={styles.desc}>
            {lang === 'fa'
              ? 'در اوجیفای بدون واسطه با مهندسان، معماران، توسعه‌دهندگان و متخصصان برتر ارتباط برقرار کنید و پروژه‌های خود را با اطمینان پیش ببرید.'
              : 'Connect directly with vetted masters in architecture, engineering, technology, and craft—transparent pricing, verified portfolios, zero friction.'}
          </p>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Grid size={{ xs: 4 }}>
            <div className={styles.metricVal}>+{formatNumber(4200, lang)}</div>
            <div className={styles.metricLbl}>
              {lang === 'fa' ? 'متخصص تاییدشده' : 'Verified Specialists'}
            </div>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <div className={styles.metricVal}>{lang === 'fa' ? '۴.۹۴' : '4.94'} ★</div>
            <div className={styles.metricLbl}>
              {lang === 'fa' ? 'میانگین رضایت کارفرما' : 'Client Rating'}
            </div>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <div className={styles.metricVal}>{formatNumber(98, lang)}%</div>
            <div className={styles.metricLbl}>
              {lang === 'fa' ? 'تکمیل موفق پروژه' : 'Success Rate'}
            </div>
          </Grid>
        </Grid>
      </Grid>

      {/* Form Side */}
      <Grid
        size={{ xs: 12, lg: 6.5 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', lg: 'center' },
          alignItems: 'center',
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            width: '100%',
            maxWidth: 480,
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            pt: 1,
          }}
        >
          <Logo variant="dark" size={34} />
          <button
            type="button"
            onClick={toggleLang}
            className="owj-btn owj-btn--outline owj-btn--sm"
          >
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 480 }}>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
