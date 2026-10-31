import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Grid, Stack, Box } from '@mui/material';
import {
  Search,
  MapPin,
  Layers,
  ShieldCheck,
  Zap,
  MessageSquare,
  Award,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import MagneticButton from '../../components/common/MagneticButton';
import SmartImage from '../../components/common/SmartImage';
import CategoryIcon from '../../components/common/CategoryIcon';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import CategoryMarquee from '../../components/marketplace/CategoryMarquee';
import ServiceCard from '../../components/marketplace/ServiceCard';
import ProfessionalCard from '../../components/profile/ProfessionalCard';
import { CATEGORIES } from '../../data/categories';
import { LOCATIONS } from '../../data/locations';
import { marketplaceService } from '../../services/marketplaceService';
import { isValidEmail } from '../../utils/validators';
import { formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { useMotionSafe } from '../../hooks/useMotionSafe';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const { lang, isRTL, l, ui } = useLanguage();
  const { hasToken, isProfessional, isCustomer, isAdmin, isOperator } = useAuth();
  const {
    activeCategories,
    advertisements,
    professionals,
    reviews,
  } = useMarketplace();
  const { showToast } = useToast();
  const { prefersReduced, fadeUp } = useMotionSafe();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [trendingTab, setTrendingTab] = useState('all');
  const [howMode, setHowMode] = useState('client');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedDone, setSubscribedDone] = useState(false);

  const DirArrow = isRTL ? ArrowLeft : ArrowRight;

  const activeAds = useMemo(
    () => advertisements.filter((a) => a.status === 'active'),
    [advertisements]
  );

  const featuredPros = useMemo(() => professionals.slice(0, 4), [professionals]);

  const trendingAds = useMemo(() => {
    const base = activeAds.filter((a) => a.trending || a.featured);
    if (trendingTab === 'all') return base.slice(0, 6);
    return activeAds.filter((a) => a.categoryId === trendingTab).slice(0, 6);
  }, [activeAds, trendingTab]);

  const recentAds = useMemo(
    () =>
      [...activeAds]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [activeAds]
  );

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (catFilter) params.set('category', catFilter);
    if (locFilter) params.set('location', locFilter);
    navigate(`/explore${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!isValidEmail(newsletterEmail)) {
      showToast({
        title: lang === 'fa' ? 'فرمت ایمیل صحیح نیست' : 'Invalid email address',
        type: 'error',
      });
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      marketplaceService.subscribeNewsletter(newsletterEmail.trim().toLowerCase());
      setSubscribing(false);
      setSubscribedDone(true);
      setNewsletterEmail('');
      showToast({
        title: lang === 'fa' ? 'عضویت در خبرنامه انجام شد' : 'Subscribed to OWJIFY Dispatch',
        message:
          lang === 'fa'
            ? 'گزیده برترین متخصصان و راهنماهای تخصصی برای شما ارسال خواهد شد.'
            : 'Monthly curated insights and top specialists delivered to your inbox.',
        type: 'success',
      });
    }, 350);
  };

  const quickSearchKeywords =
    lang === 'fa'
      ? ['کولر گازی اینورتر', 'طراحی داخلی', 'React', 'آیلتس', 'هوشمندسازی KNX']
      : ['Inverter AC', 'Interior Design', 'React', 'IELTS', 'Smart Home KNX'];

  const howSteps =
    howMode === 'client'
      ? [
          {
            num: '01',
            title: { fa: 'جستجو و مقایسه شفاف', en: 'Discover & Compare' },
            desc: {
              fa: 'بر اساس مهارت، شهر، امتیاز واقعی کارفرمایان قبلی و تعرفه پایه، مناسب‌ترین متخصص را بیابید.',
              en: 'Filter verified specialists by skill, city, starting price, and authentic client reviews.',
            },
          },
          {
            num: '02',
            title: { fa: 'گفتگوی مستقیم پس از ورود', en: 'Connect Directly' },
            desc: {
              fa: 'پس از ورود به حساب کاربری، از طریق پیام‌رسان داخلی جزئیات پروژه و زمان‌بندی را توافق نمایید.',
              en: 'Sign in to message providers directly, share scope details, and align on timelines.',
            },
          },
          {
            num: '03',
            title: { fa: 'انجام باکیفیت و ثبت امتیاز', en: 'Execute with Confidence' },
            desc: {
              fa: 'خدمت موردنظر را با استاندارد حرفه‌ای دریافت کرده و تجربه خود را برای دیگران ثبت کنید.',
              en: 'Receive world-class execution and leave a verified rating to strengthen community trust.',
            },
          },
        ]
      : [
          {
            num: '01',
            title: { fa: 'ساخت پروفایل و پورتفولیو متمایز', en: 'Craft Your Studio Profile' },
            desc: {
              fa: 'سوابق، مهارت‌ها، سال‌های تجربه و نمونه کارهای شاخص خود را در یک صفحه اختصاصی نمایش دهید.',
              en: 'Showcase your credentials, years of mastery, and visual portfolio on a dedicated public page.',
            },
          },
          {
            num: '02',
            title: { fa: 'انتشار آگهی خدمت در چند دقیقه', en: 'Publish High-Impact Listings' },
            desc: {
              fa: 'با ویزارد هوشمند ۱۰ مرحله‌ای، تعرفه، دستاوردها و روزهای کاری خود را دقیق معرفی کنید.',
              en: 'Use our 10-step wizard to define clear packages, pricing models, and availability windows.',
            },
          },
          {
            num: '03',
            title: { fa: 'دریافت سفارش‌های هدفمند', en: 'Grow Repeat Business' },
            desc: {
              fa: 'درخواست‌های مستقیم کارفرمایان را در داشبورد مدیریت کنید و اعتبار حرفه‌ای خود را ارتقا دهید.',
              en: 'Manage incoming client inquiries, build 5-star reviews, and scale your independent practice.',
            },
          },
        ];

  const whyItems = [
    {
      icon: ShieldCheck,
      title: { fa: 'احراز هویت چندمرحله‌ای', en: 'Multi-Layer Verification' },
      desc: {
        fa: 'بررسی دقیق هویت، مدارک فنی و اصالت نمونه کارهای متخصصان پیش از اعطای نشان تایید.',
        en: 'Rigorous screening of credentials, portfolios, and identity before granting Verified status.',
      },
    },
    {
      icon: Zap,
      title: { fa: 'پاسخ‌گویی سریع و مستقیم', en: 'Direct, Instant Connection' },
      desc: {
        fa: 'بدون فرم‌های پیچیده و انتظار طولانی؛ مستقیماً با خود متخصص گفتگو و هماهنگی کنید.',
        en: 'Zero middleman bottlenecks—chat directly with the specialist who will execute your work.',
      },
    },
    {
      icon: Award,
      title: { fa: 'شفافیت کامل تعرفه‌ها', en: 'Transparent Starting Rates' },
      desc: {
        fa: 'تمامی آگهی‌ها دارای تعرفه پایه مشخص و شرح دقیق موارد تحویلی پیش از شروع کار هستند.',
        en: 'Every listing outlines clear starting pricing and concrete deliverables upfront.',
      },
    },
    {
      icon: MessageSquare,
      title: { fa: 'امتیازدهی واقعی کارفرمایان', en: 'Authentic Peer Reviews' },
      desc: {
        fa: 'سیستم بازخورد شفاف به شما کمک می‌کند تصمیم خود را بر پایه کیفیت اثبات‌شده بگیرید.',
        en: 'Detailed community ratings reward true craftsmanship, punctuality, and professionalism.',
      },
    },
  ];

  return (
    <PageTransition>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 7.3 }}>
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <span className="owj-section-tag owj-section-tag--dark">{ui.hero.badge}</span>
              </motion.div>

              <motion.h1
                className={styles.heroTitle}
                initial={prefersReduced ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>{ui.hero.titleLine1}</span>{' '}
                <span
                  className={`${styles.limeHighlight} ${
                    lang === 'en' ? styles.serifAccent : ''
                  }`}
                >
                  {ui.hero.titleLine2}
                </span>
              </motion.h1>

              <motion.p
                className={styles.heroSub}
                initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
              >
                {ui.hero.subtitle}
              </motion.p>

              {/* Interactive Responsive Search Component */}
              <motion.form
                className={styles.searchBox}
                onSubmit={handleHeroSearch}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.22 }}
              >
                <div className={styles.searchField}>
                  <Search size={18} color="#464841" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={ui.hero.searchPlaceholder}
                    aria-label={ui.hero.searchPlaceholder}
                  />
                </div>

                <div className={styles.searchField}>
                  <Layers size={17} color="#464841" />
                  <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    aria-label={ui.hero.allCategories}
                  >
                    <option value="">{ui.hero.allCategories}</option>
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {l(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.searchField}>
                  <MapPin size={17} color="#464841" />
                  <select
                    value={locFilter}
                    onChange={(e) => setLocFilter(e.target.value)}
                    aria-label={ui.hero.allLocations}
                  >
                    <option value="">{ui.hero.allLocations}</option>
                    {LOCATIONS.map((locItem) => (
                      <option key={locItem.id} value={locItem.id}>
                        {l(locItem.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={styles.searchSubmit}>
                  <span>{ui.hero.searchBtn}</span>
                  <DirArrow size={17} />
                </button>
              </motion.form>

              <div className={styles.quickTags}>
                <span>{ui.hero.popularLabel}</span>
                {quickSearchKeywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    className={styles.quickChip}
                    onClick={() => navigate(`/explore?q=${encodeURIComponent(kw)}`)}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </Grid>

            {/* Layered Visual Composition */}
            <Grid size={{ xs: 12, lg: 4.7 }}>
              <div className={styles.heroVisual}>
                <motion.div
                  className={styles.floatingBadgeTop}
                  animate={prefersReduced ? {} : { y: [0, -7, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles size={17} />
                  <span>
                    {lang === 'fa' ? '+۴,۲۰۰ متخصص احرازشده' : '4,200+ Vetted Masters'}
                  </span>
                </motion.div>

                <motion.div
                  className={styles.mainShowcaseCard}
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                >
                  <div className={styles.showcaseImg}>
                    <SmartImage
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                      alt="OWJIFY Featured Architecture"
                    />
                  </div>
                  <div className={styles.showcaseBody}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                      <span style={{ fontSize: '0.76rem', color: '#C7F36B', fontWeight: 700 }}>
                        {lang === 'fa' ? 'معماری و طراحی داخلی' : 'Interior Architecture'}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>★ 4.99</span>
                    </Stack>
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem' }}>
                      {lang === 'fa'
                        ? 'استودیو سارا کاظمی‌نیا • تهران'
                        : 'Sara Kazeminia Studio • Tehran'}
                    </div>
                    <Link
                      to="/professionals/pro-2"
                      className="owj-btn owj-btn--outline-light owj-btn--sm"
                      style={{ width: '100%' }}
                    >
                      {lang === 'fa' ? 'مشاهده پروفایل و نمونه کارها' : 'Explore Specialist Studio'}
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  className={styles.floatingBadgeBottom}
                  animate={prefersReduced ? {} : { y: [0, 8, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ color: '#C7F36B', fontWeight: 800, fontSize: '0.82rem' }}>
                    <CheckCircle2 size={15} />
                    <span>{lang === 'fa' ? 'پاسخ‌گویی میانگین ۱۸ دقیقه' : '18-min Median Response'}</span>
                  </Stack>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(246,245,240,0.72)', marginTop: 4 }}>
                    {lang === 'fa'
                      ? 'بررسی شفاف تخصص و نمونه کارها'
                      : 'Verified portfolios & transparent pricing'}
                  </div>
                </motion.div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* 2. INFINITE HORIZONTAL MARQUEE */}
      <CategoryMarquee />

      {/* 3. POPULAR CATEGORIES */}
      <section className={styles.section}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'دسته‌بندی‌های تخصصی' : 'Curated Specialties'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa'
                  ? 'هر مهارتی که برای پروژه خود نیاز دارید'
                  : 'Every discipline. Vetted to perfection.'}
              </h2>
            </div>
            <Link to="/categories" className="owj-btn owj-btn--outline">
              <span>{lang === 'fa' ? 'مشاهده همه دسته‌ها' : 'All Categories'}</span>
              <DirArrow size={16} />
            </Link>
          </motion.div>

          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {activeCategories.slice(0, 8).map((cat, idx) => {
              const count = activeAds.filter((a) => a.categoryId === cat.id).length;
              return (
                <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <motion.div
                    style={{ height: '100%' }}
                    initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                  >
                    <Link to={`/explore?category=${cat.id}`} className={styles.catCard}>
                      <div className={styles.catIcon}>
                        <CategoryIcon name={cat.icon} size={23} />
                      </div>
                      <div>
                        <h3 className={styles.catName}>{l(cat.name)}</h3>
                        <p className={styles.catSub}>{l(cat.tagline)}</p>
                        <div className={styles.catCount}>
                          {formatNumber(count + 18, lang)}{' '}
                          {lang === 'fa' ? 'خدمت فعال' : 'active services'}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </section>

      {/* 4. FEATURED PROFESSIONALS */}
      <section className={`${styles.section} ${styles.sectionStone}`}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'متخصصان برجسته ماه' : 'Featured Specialists'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa'
                  ? 'حرفه‌ای‌هایی با بالاترین رضایت کارفرما'
                  : 'Top-rated masters trusted by clients'}
              </h2>
            </div>
            <Link to="/explore?tab=professionals" className="owj-btn owj-btn--dark">
              <span>{lang === 'fa' ? 'کاوش تمام متخصصان' : 'Discover Specialists'}</span>
              <DirArrow size={16} />
            </Link>
          </motion.div>

          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {featuredPros.map((pro) => (
              <Grid key={pro.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <ProfessionalCard pro={pro} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* 5. TRENDING SERVICES */}
      <section className={styles.section}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'خدمات پرطرفدار' : 'Trending Now'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa' ? 'پرتقاضاترین خدمات این هفته' : 'Most requested services this week'}
              </h2>
            </div>
            <Link to="/explore?sort=popular" className="owj-btn owj-btn--outline">
              <span>{lang === 'fa' ? 'مشاهده همه آگهی‌ها' : 'Explore Marketplace'}</span>
              <DirArrow size={16} />
            </Link>
          </motion.div>

          <div className={styles.filterTabs}>
            {[
              { id: 'all', label: lang === 'fa' ? 'همه حوزه‌ها' : 'All' },
              { id: 'home', label: lang === 'fa' ? 'خدمات منزل' : 'Home Services' },
              { id: 'technology', label: lang === 'fa' ? 'فناوری و وب' : 'Technology' },
              { id: 'construction', label: lang === 'fa' ? 'معماری و بازسازی' : 'Architecture' },
              { id: 'creative', label: lang === 'fa' ? 'خلاقیت و برندینگ' : 'Creative' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrendingTab(tab.id)}
                className={`${styles.tabBtn} ${trendingTab === tab.id ? styles.tabActive : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {trendingAds.map((ad) => (
              <Grid key={ad.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ServiceCard ad={ad} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* 6. RECENTLY PUBLISHED ADVERTISEMENTS */}
      <section className={`${styles.section} ${styles.sectionStone}`}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'تازه‌ترین آگهی‌ها' : 'Fresh Listings'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa'
                  ? 'جدیدترین خدمات منتشرشده در اوجیفای'
                  : 'Recently published advertisements'}
              </h2>
            </div>
            <Link to="/explore?sort=newest" className="owj-btn owj-btn--outline">
              <span>{lang === 'fa' ? 'مرتب‌سازی بر اساس جدیدترین' : 'View Newest'}</span>
              <DirArrow size={16} />
            </Link>
          </motion.div>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {recentAds.map((ad) => (
              <Grid key={ad.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ServiceCard ad={ad} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* 7. HOW OWJIFY WORKS */}
      <section className={styles.section}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'فرآیند ساده و هوشمند' : 'How OWJIFY Works'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa'
                  ? 'مسیر شفاف از انتخاب تا نتیجه نهایی'
                  : 'Seamless collaboration in three steps'}
              </h2>
            </div>

            <div className={styles.filterTabs} style={{ marginBottom: 0 }}>
              <button
                type="button"
                onClick={() => setHowMode('client')}
                className={`${styles.tabBtn} ${howMode === 'client' ? styles.tabActive : ''}`}
              >
                {lang === 'fa' ? 'ویژه کارفرمایان' : 'For Clients'}
              </button>
              <button
                type="button"
                onClick={() => setHowMode('pro')}
                className={`${styles.tabBtn} ${howMode === 'pro' ? styles.tabActive : ''}`}
              >
                {lang === 'fa' ? 'ویژه متخصصان' : 'For Professionals'}
              </button>
            </div>
          </motion.div>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {howSteps.map((step) => (
              <Grid key={step.num + howMode} size={{ xs: 12, md: 4 }}>
                <motion.div className={styles.stepCard} style={{ height: '100%' }} {...fadeUp}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                    {l(step.title)}
                  </h3>
                  <p style={{ color: '#666860', fontSize: '0.92rem', lineHeight: 1.75 }}>
                    {l(step.desc)}
                  </p>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* 8. WHY CHOOSE OWJIFY (DARK CONTRAST SECTION) */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <Container maxWidth="xl">
          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag owj-section-tag--dark">
                {lang === 'fa' ? 'چرا اوجیفای؟' : 'Why Choose OWJIFY'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa'
                  ? 'طراحی‌شده برای اعتماد، کیفیت و سرعت'
                  : 'Engineered for trust, craft, and velocity'}
              </h2>
            </div>
          </motion.div>

          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {whyItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <div className={styles.whyCard} style={{ height: '100%' }}>
                    <span className={styles.whyIcon}>
                      <Icon size={21} />
                    </span>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800 }}>{l(item.title)}</h3>
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'rgba(246,245,240,0.68)',
                        lineHeight: 1.75,
                      }}
                    >
                      {l(item.desc)}
                    </p>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </section>

      {/* 9. STATISTICS & SOCIAL PROOF */}
      <section className={styles.section}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mb: 6 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <div className={styles.statBox}>
                <div className={styles.statBig}>
                  +<AnimatedCounter value={4200} />
                </div>
                <div style={{ color: '#666860', fontSize: '0.88rem', marginTop: 6 }}>
                  {lang === 'fa' ? 'متخصص احراز هویت شده' : 'Verified Specialists'}
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <div className={styles.statBox}>
                <div className={styles.statBig}>
                  +<AnimatedCounter value={28500} />
                </div>
                <div style={{ color: '#666860', fontSize: '0.88rem', marginTop: 6 }}>
                  {lang === 'fa' ? 'خدمت موفق انجام‌شده' : 'Completed Engagements'}
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <div className={styles.statBox}>
                <div className={styles.statBig}>
                  <AnimatedCounter value={4.94} decimals={2} /> ★
                </div>
                <div style={{ color: '#666860', fontSize: '0.88rem', marginTop: 6 }}>
                  {lang === 'fa' ? 'میانگین امتیاز رضایت' : 'Average Client Rating'}
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <div className={styles.statBox}>
                <div className={styles.statBig}>
                  <AnimatedCounter value={98} suffix="%" />
                </div>
                <div style={{ color: '#666860', fontSize: '0.88rem', marginTop: 6 }}>
                  {lang === 'fa' ? 'نرخ تکرار همکاری مشتریان' : 'Client Satisfaction Rate'}
                </div>
              </div>
            </Grid>
          </Grid>

          <motion.div className={styles.sectionHead} {...fadeUp}>
            <div>
              <span className="owj-section-tag">
                {lang === 'fa' ? 'تجربه واقعی کارفرمایان' : 'Client Stories'}
              </span>
              <h2 className={styles.sectionTitle}>
                {lang === 'fa' ? 'صدای اعتماد کاربران اوجیفای' : 'Trusted on projects that matter'}
              </h2>
            </div>
          </motion.div>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {reviews.slice(0, 3).map((rev) => (
              <Grid key={rev.id} size={{ xs: 12, md: 4 }}>
                <div className={styles.reviewCard} style={{ height: '100%' }}>
                  <div style={{ display: 'flex', gap: 3, color: '#E59934' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="#E59934" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: '#232620', flex: 1 }}>
                    «{l(rev.comment)}»
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(17,18,15,0.07)',
                    }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden' }}>
                      <SmartImage src={rev.avatar} alt={l(rev.author)} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{l(rev.author)}</div>
                      <div style={{ fontSize: '0.76rem', color: '#666860' }}>{l(rev.role)}</div>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* 10. CTA FOR PROFESSIONALS + 11. NEWSLETTER */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Box className={styles.proCtaBanner}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.32rem 0.85rem',
                    borderRadius: '999px',
                    background: 'rgba(17,18,15,0.1)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    marginBottom: '0.9rem',
                  }}
                >
                  {lang === 'fa' ? 'دعوت از متخصصان و کسب‌وکارها' : 'FOR INDEPENDENT SPECIALISTS'}
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.65rem, 3vw, 2.55rem)',
                    fontWeight: 900,
                    lineHeight: 1.25,
                  }}
                >
                  {lang === 'fa'
                    ? 'مهارت شما شایسته بهترین کارفرمایان است.'
                    : 'Turn your expertise into a thriving studio.'}
                </h2>
                <p style={{ marginTop: '0.75rem', fontSize: '0.98rem', maxWidth: 560, opacity: 0.85 }}>
                  {lang === 'fa'
                    ? 'پروفایل حرفه‌ای خود را در اوجیفای بسازید، خدمات تخصصی خود را معرفی کنید و بدون واسطه سفارش بگیرید.'
                    : 'Create your verified specialist profile, showcase your services, and receive direct client inquiries.'}
                </p>
              </div>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent={{ xs: 'stretch', md: 'flex-end' }}
              >
                {hasToken ? (
                  isProfessional ? (
                    <>
                      <MagneticButton>
                        <Link
                          to="/create-ad"
                          className="owj-btn owj-btn--dark owj-btn--lg"
                          style={{ width: '100%' }}
                        >
                          <span>{lang === 'fa' ? 'ثبت آگهی خدمت' : 'Publish a Service'}</span>
                          <DirArrow size={17} />
                        </Link>
                      </MagneticButton>
                      <Link
                        to="/explore"
                        className="owj-btn owj-btn--outline owj-btn--lg"
                      >
                        {lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Browse Services'}
                      </Link>
                    </>
                  ) : isCustomer ? (
                    <>
                      <MagneticButton>
                        <Link
                          to="/explore?tab=professionals"
                          className="owj-btn owj-btn--dark owj-btn--lg"
                          style={{ width: '100%' }}
                        >
                          <span>
                            {lang === 'fa' ? 'کاوش متخصصان برتر' : 'Explore Providers'}
                          </span>
                          <DirArrow size={17} />
                        </Link>
                      </MagneticButton>
                      <Link
                        to="/dashboard"
                        className="owj-btn owj-btn--outline owj-btn--lg"
                      >
                        {lang === 'fa' ? 'داشبورد من' : 'My Dashboard'}
                      </Link>
                    </>
                  ) : isAdmin ? (
                    <MagneticButton>
                      <Link
                        to="/admin"
                        className="owj-btn owj-btn--dark owj-btn--lg"
                        style={{ width: '100%' }}
                      >
                        <span>
                          {lang === 'fa' ? 'ورود به پنل مدیریت و CRM' : 'Open Admin & CRM'}
                        </span>
                        <DirArrow size={17} />
                      </Link>
                    </MagneticButton>
                  ) : isOperator ? (
                    <MagneticButton>
                      <Link
                        to="/operator"
                        className="owj-btn owj-btn--dark owj-btn--lg"
                        style={{ width: '100%' }}
                      >
                        <span>
                          {lang === 'fa' ? 'ورود به میز پشتیبانی' : 'Open Support Desk'}
                        </span>
                        <DirArrow size={17} />
                      </Link>
                    </MagneticButton>
                  ) : null
                ) : (
                  <>
                    <MagneticButton>
                      <Link
                        to="/auth/signup?role=professional"
                        className="owj-btn owj-btn--dark owj-btn--lg"
                        style={{ width: '100%' }}
                      >
                        <span>
                          {lang === 'fa' ? 'عضویت به عنوان متخصص' : 'Join as Specialist'}
                        </span>
                        <DirArrow size={17} />
                      </Link>
                    </MagneticButton>
                    <Link to="/auth/login" className="owj-btn owj-btn--outline owj-btn--lg">
                      {lang === 'fa' ? 'ورود به حساب' : 'Log In'}
                    </Link>
                  </>
                )}
              </Stack>
            </Box>

            <Box className={styles.newsletterBox}>
              <div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {lang === 'fa'
                    ? 'عضویت در خبرنامه گزیده اوجیفای'
                    : 'Subscribe to the OWJIFY Editorial Dispatch'}
                </h3>
                <p style={{ color: 'rgba(246,245,240,0.68)', fontSize: '0.9rem', marginTop: 6 }}>
                  {lang === 'fa'
                    ? 'معرفی برترین متخصصان جدید، راهنمای قیمت‌گذاری خدمات و روندهای بازار کار تخصصی.'
                    : 'Curated monthly spotlights on top specialists, pricing benchmarks, and design stories.'}
                </p>
              </div>

              {subscribedDone ? (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(199,243,107,0.14)',
                    color: '#C7F36B',
                    fontWeight: 700,
                  }}
                >
                  {lang === 'fa'
                    ? '✓ ایمیل شما با موفقیت در خبرنامه ثبت شد.'
                    : '✓ Thank you! You are subscribed to OWJIFY Dispatch.'}
                </div>
              ) : (
                <form className={styles.newsletterForm} onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={
                      lang === 'fa' ? 'نشانی ایمیل شما...' : 'Enter your email address...'
                    }
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="owj-btn owj-btn--lime"
                  >
                    {subscribing ? (
                      <span className="owj-spinner" />
                    ) : lang === 'fa' ? (
                      'عضویت'
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              )}
            </Box>
          </Stack>
        </Container>
      </section>
    </PageTransition>
  );
}
