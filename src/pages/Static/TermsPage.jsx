import { Container } from '@mui/material';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.scss';

export default function TermsPage() {
  const { lang } = useLanguage();

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'مستندات حقوقی' : 'Legal'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa' ? 'قوانین و شرایط استفاده از اوجیفای' : 'Terms & Conditions'}
          </h1>
        </Container>
      </section>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <div className={styles.legalDoc}>
          <h2>
            {lang === 'fa'
              ? '۱. نقش بازارگاه اوجیفای'
              : '1. Marketplace Role & Scope'}
          </h2>
          <p>
            {lang === 'fa'
              ? 'اوجیفای یک بستر فناوری برای معرفی خدمات تخصصی و برقراری ارتباط مستقیم میان کارفرمایان و متخصصان مستقل است. مسئولیت صحت اطلاعات فنی، اجرای تعهدات و کیفیت خدمات بر عهده ارائه‌دهنده خدمت است.'
              : 'OWJIFY provides a digital discovery and communication venue connecting clients with independent specialists and service providers.'}
          </p>

          <h2>
            {lang === 'fa'
              ? '۲. صداقت در ثبت آگهی و تعرفه‌ها'
              : '2. Accurate Listings & Transparent Pricing'}
          </h2>
          <p>
            {lang === 'fa'
              ? 'متخصصان متعهد می‌شوند تصاویر واقعی، مهارت‌های مستند و تعرفه‌های شفاف ثبت نمایند. هرگونه آگهی گمراه‌کننده یا اسپم پس از بررسی تیم اعتماد و ایمنی متوقف خواهد شد.'
              : 'Specialists agree to represent credentials, portfolio work, and starting rates truthfully. Misleading listings are subject to removal.'}
          </p>

          <h2>
            {lang === 'fa'
              ? '۳. امتیازدهی منصفانه و محترمانه'
              : '3. Authentic Reviews & Conduct'}
          </h2>
          <p>
            {lang === 'fa'
              ? 'دیدگاه‌ها باید بر اساس تجربه واقعی تعامل ثبت شوند و از به کار بردن الفاظ توهین‌آمیز یا افشای اطلاعات خصوصی افراد خودداری گردد.'
              : 'Reviews must reflect genuine service interactions and maintain respectful professional discourse.'}
          </p>
        </div>
      </Container>
    </PageTransition>
  );
}
