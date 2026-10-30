import { Link } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';

export default function NotFoundPage() {
  const { lang } = useLanguage();

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 7, md: 11 }, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <div
            style={{
              fontFamily: 'var(--font-en)',
              fontSize: 'clamp(4rem, 11vw, 7.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: '#11120F',
              background: '#C7F36B',
              padding: '0.2rem 1.4rem',
              borderRadius: 28,
            }}
          >
            404
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.35rem)', fontWeight: 900 }}>
            {lang === 'fa' ? 'صفحه موردنظر پیدا نشد' : 'Page Not Found'}
          </h1>
          <p style={{ color: '#666860', maxWidth: 440 }}>
            {lang === 'fa'
              ? 'ممکن است نشانی صفحه تغییر کرده باشد یا آگهی موردنظر حذف شده باشد.'
              : 'The page or service listing you are looking for may have moved or been removed.'}
          </p>
          <Stack direction="row" spacing={1.2} flexWrap="wrap" justifyContent="center" useFlexGap>
            <Link to="/" className="owj-btn owj-btn--dark">
              {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Homepage'}
            </Link>
            <Link to="/explore" className="owj-btn owj-btn--lime">
              {lang === 'fa' ? 'کاوش بازارگاه' : 'Explore Marketplace'}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </PageTransition>
  );
}
