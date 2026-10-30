import { Link } from 'react-router-dom';
import { Container, Grid, Stack } from '@mui/material';
import { ShieldCheck, Sparkles } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import styles from './StaticPages.module.scss';

export default function HowItWorksPage() {
  const { lang } = useLanguage();
  const { hasToken, isProfessional } = useAuth();
  const { openSkillRequestModal } = useMarketplace();

  const clientSteps = [
    {
      n: '01',
      title: { fa: 'جستجوی دقیق بر اساس مهارت و شهر', en: 'Search by Skill & Location' },
      desc: {
        fa: 'در میان ده‌ها تخصص از تعمیرات فنی و هوشمندسازی ساختمان تا توسعه نرم‌افزار و معماری داخلی کاوش کنید.',
        en: 'Filter verified professionals by specialty, city, starting rate, experience, and rating.',
      },
    },
    {
      n: '02',
      title: { fa: 'بررسی پورتفولیو و گفتگوی مستقیم', en: 'Review Portfolios & Message Directly' },
      desc: {
        fa: 'نمونه کارهای واقعی و دیدگاه کارفرمایان قبلی را ببینید و پس از ورود به حساب بدون واسطه گفتگو کنید.',
        en: 'Inspect real case studies, read verified reviews, and align on scope once signed in.',
      },
    },
    {
      n: '03',
      title: { fa: 'همکاری مطمئن و ثبت امتیاز', en: 'Hire with Confidence & Rate' },
      desc: {
        fa: 'خدمت موردنظر را با شفافیت کامل دریافت کرده و تجربه خود را برای سایر کاربران به اشتراک بگذارید.',
        en: 'Complete your project smoothly and publish an authentic rating for the community.',
      },
    },
  ];

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'راهنمای جامع پلتفرم' : 'How OWJIFY Works'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa'
              ? 'شفاف‌ترین مسیر برای یافتن متخصص یا رشد کسب‌وکار خدماتی'
              : 'Built for effortless discovery and trusted execution'}
          </h1>
          <p className={styles.heroLead}>
            {lang === 'fa'
              ? 'اوجیفای پیچیدگی‌های سنتی پیدا کردن متخصص قابل اعتماد را با پروفایل‌های تاییدشده، تعرفه‌های شفاف و ارتباط مستقیم حذف کرده است.'
              : 'OWJIFY replaces guesswork with verified portfolios, transparent starting prices, and direct messaging.'}
          </p>
        </Container>
      </section>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {clientSteps.map((s) => (
            <Grid key={s.n} size={{ xs: 12, md: 4 }}>
              <div className={styles.card} style={{ height: '100%' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 10,
                    background: '#C7F36B',
                    fontWeight: 900,
                    fontFamily: 'var(--font-en)',
                    marginBottom: '1rem',
                  }}
                >
                  {s.n}
                </span>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                  {s.title[lang]}
                </h2>
                <p style={{ color: '#666860', lineHeight: 1.8, fontSize: '0.92rem' }}>
                  {s.desc[lang]}
                </p>
              </div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className={styles.card} style={{ height: '100%' }}>
              <ShieldCheck size={28} color="#289e67" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.8rem 0 0.5rem' }}>
                {lang === 'fa' ? 'استاندارد تایید صلاحیت اوجیفای' : 'Verification Standard'}
              </h3>
              <p style={{ color: '#666860', lineHeight: 1.8 }}>
                {lang === 'fa'
                  ? 'بررسی هویت، اصالت نمونه کارها و پایش مستمر رضایت مشتریان تضمین می‌کند همیشه با افراد متعهد همکاری کنید.'
                  : 'Identity checks, portfolio screening, and continuous quality monitoring protect every engagement.'}
              </p>
            </div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <div className={styles.card} style={{ height: '100%' }}>
              <Sparkles size={28} color="#11120F" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.8rem 0 0.5rem' }}>
                {lang === 'fa' ? 'ابزارهای حرفه‌ای ویژه متخصصان' : 'Studio Tools for Specialists'}
              </h3>
              <p style={{ color: '#666860', lineHeight: 1.8, marginBottom: '1rem' }}>
                {lang === 'fa'
                  ? 'ویزارد ۱۰ مرحله‌ای ثبت آگهی، داشبورد آمار بازدید، مدیریت درخواست‌ها و پورتفولیو اختصاصی.'
                  : '10-step listing wizard, analytics dashboard, availability controls, and portfolio showcase.'}
              </p>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Link to="/explore" className="owj-btn owj-btn--dark owj-btn--sm">
                  {lang === 'fa' ? 'کاوش خدمات' : 'Explore Marketplace'}
                </Link>
                {hasToken ? (
                  isProfessional ? (
                    <>
                      <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                        {lang === 'fa' ? 'ثبت آگهی خدمت' : 'Publish a Service'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => openSkillRequestModal()}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        {lang === 'fa' ? 'ارسال درخواست مهارت' : 'Request a Skill'}
                      </button>
                    </>
                  ) : (
                    <Link to="/messages" className="owj-btn owj-btn--lime owj-btn--sm">
                      {lang === 'fa' ? 'پیام‌های ارسالی من' : 'My Sent Messages'}
                    </Link>
                  )
                ) : (
                  <Link to="/auth/login" className="owj-btn owj-btn--lime owj-btn--sm">
                    {lang === 'fa' ? 'ورود / عضویت متخصصان' : 'Sign In as Specialist'}
                  </Link>
                )}
              </Stack>
            </div>
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}
