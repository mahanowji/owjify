import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, LinearProgress, Stack, Box } from '@mui/material';
import {
  Save,
  Upload,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import CategoryIcon from '../../components/common/CategoryIcon';
import SmartImage from '../../components/common/SmartImage';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { LOCATIONS, getLocationById } from '../../data/locations';
import { marketplaceService } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatNumber } from '../../utils/formatters';
import styles from './CreateAdPage.module.scss';

const PRESET_GALLERY = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1000&q=80',
];

const INITIAL_FORM = {
  categoryId: 'technology',
  subcategoryId: 'web-dev',
  title: '',
  tagline: '',
  description: '',
  deliverables: ['', ''],
  skills: [],
  pricingType: 'شروع تعرفه خدمت | Starting Service Rate',
  price: '2500000',
  locationId: 'tehran',
  remoteAvailable: true,
  images: [PRESET_GALLERY[1]],
  availabilityDays: ['sat', 'sun', 'mon', 'tue', 'wed'],
  availabilityHours: '09:00 - 20:00',
  urgentAvailable: true,
  weekendAvailable: false,
  contactPref: 'chat',
};

export default function CreateAdPage() {
  const { id: editAdId } = useParams();
  const navigate = useNavigate();
  const { lang, isRTL, l } = useLanguage();
  const { user } = useAuth();
  const {
    activeCategories,
    advertisements,
    createAdvertisement,
    updateAdvertisement,
  } = useMarketplace();
  const { showToast } = useToast();

  const existingAd = useMemo(
    () => (editAdId ? advertisements.find((a) => a.id === editAdId) : null),
    [editAdId, advertisements]
  );

  const isForbiddenEdit = Boolean(
    editAdId &&
      existingAd &&
      existingAd.ownerUserId !== user?.id &&
      existingAd.proId !== user?.proId
  );

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [error, setError] = useState('');
  const [savedDraftBanner, setSavedDraftBanner] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedAd, setPublishedAd] = useState(null);

  useEffect(() => {
    if (isForbiddenEdit) {
      showToast({
        title:
          lang === 'fa'
            ? 'شما فقط مجاز به ویرایش آگهی‌های خود هستید'
            : 'You can only edit your own listings',
        type: 'error',
      });
      navigate('/dashboard?tab=ads', { replace: true });
      return;
    }
    if (existingAd) {
      setForm({
        categoryId: existingAd.categoryId,
        subcategoryId: existingAd.subcategoryId || '',
        title: l(existingAd.title),
        tagline: l(existingAd.shortDesc),
        description: l(existingAd.description),
        deliverables: (existingAd.deliverables || []).map((d) => l(d)),
        skills: (existingAd.skills || []).map((s) => l(s)),
        pricingType: l(existingAd.pricingType),
        price: String(existingAd.price || 1500000),
        locationId: existingAd.locationId || 'tehran',
        remoteAvailable: Boolean(existingAd.remoteAvailable),
        images: existingAd.images?.length ? existingAd.images : [PRESET_GALLERY[0]],
        availabilityDays: existingAd.availabilityDays || ['sat', 'sun', 'mon', 'tue', 'wed'],
        availabilityHours: existingAd.availabilityHours || '09:00 - 20:00',
        urgentAvailable: Boolean(existingAd.urgentAvailable),
        weekendAvailable: Boolean(existingAd.weekendAvailable),
        contactPref: existingAd.contactPref || 'chat',
      });
    } else {
      const draft = marketplaceService.getAdDraft();
      if (draft && draft.title) {
        setSavedDraftBanner(draft);
      }
    }
  }, [existingAd, isForbiddenEdit, navigate, showToast, lang, l]);

  const currentCategory =
    activeCategories.find((c) => c.id === form.categoryId) || getCategoryById(form.categoryId);

  const stepLabels = [
    { n: 1, fa: 'دسته‌بندی', en: 'Category' },
    { n: 2, fa: 'عنوان', en: 'Title' },
    { n: 3, fa: 'توضیحات', en: 'Details' },
    { n: 4, fa: 'مهارت‌ها', en: 'Skills' },
    { n: 5, fa: 'تعرفه', en: 'Pricing' },
    { n: 6, fa: 'موقعیت', en: 'Location' },
    { n: 7, fa: 'تصاویر', en: 'Images' },
    { n: 8, fa: 'زمان‌بندی', en: 'Schedule' },
    { n: 9, fa: 'پیش‌نمایش', en: 'Preview' },
    { n: 10, fa: 'انتشار', en: 'Publish' },
  ];

  const validateStep = (s) => {
    setError('');
    if (s === 1 && !form.categoryId) {
      setError(lang === 'fa' ? 'لطفاً یک دسته‌بندی انتخاب کنید.' : 'Please select a category.');
      return false;
    }
    if (s === 2 && form.title.trim().length < 8) {
      setError(
        lang === 'fa'
          ? 'عنوان آگهی باید حداقل ۸ کاراکتر باشد.'
          : 'Title must be at least 8 characters.'
      );
      return false;
    }
    if (s === 3 && form.description.trim().length < 25) {
      setError(
        lang === 'fa'
          ? 'توضیحات کامل باید حداقل ۲۵ کاراکتر باشد.'
          : 'Detailed description must be at least 25 characters.'
      );
      return false;
    }
    if (s === 4 && form.skills.length === 0) {
      setError(
        lang === 'fa'
          ? 'حداقل یک مهارت تخصصی اضافه کنید.'
          : 'Please add at least one skill.'
      );
      return false;
    }
    if (s === 5 && (!form.price || Number(form.price) <= 0)) {
      setError(lang === 'fa' ? 'مبلغ تعرفه معتبر وارد کنید.' : 'Enter a valid starting price.');
      return false;
    }
    if (s === 7 && form.images.length === 0) {
      setError(lang === 'fa' ? 'حداقل یک تصویر انتخاب کنید.' : 'Add at least one cover image.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(10, prev + 1));
  };

  const handlePrev = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSaveDraft = () => {
    marketplaceService.saveAdDraft({ ...form, step });
    showToast({
      title: lang === 'fa' ? 'پیش‌نویس ذخیره شد' : 'Draft Saved Locally',
      message:
        lang === 'fa'
          ? 'در هر زمان می‌توانید ادامه ثبت آگهی را از سر بگیرید.'
          : 'You can resume editing anytime.',
      type: 'info',
    });
  };

  const handleResumeDraft = () => {
    if (!savedDraftBanner) return;
    setForm((prev) => ({ ...prev, ...savedDraftBanner }));
    if (savedDraftBanner.step) setStep(savedDraftBanner.step);
    setSavedDraftBanner(null);
    showToast({
      title: lang === 'fa' ? 'پیش‌نویس بازیابی شد' : 'Draft Restored',
      type: 'success',
    });
  };

  const handleDiscardDraft = () => {
    marketplaceService.clearAdDraft();
    setSavedDraftBanner(null);
  };

  const addSkill = (val) => {
    const clean = (val || skillInput).trim();
    if (!clean || form.skills.includes(clean)) return;
    setForm((p) => ({ ...p, skills: [...p.skills, clean] }));
    setSkillInput('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setForm((p) => ({ ...p, images: [...p.images, reader.result] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = () => {
    if (!validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      if (existingAd) {
        updateAdvertisement(existingAd.id, form);
        setPublishing(false);
        showToast({
          title: lang === 'fa' ? 'تغییرات آگهی ذخیره شد' : 'Listing Updated',
          type: 'success',
        });
        navigate(`/services/${existingAd.id}`);
      } else {
        const created = createAdvertisement(form, user);
        setPublishing(false);
        setPublishedAd(created);
        showToast({
          title: lang === 'fa' ? 'آگهی شما منتشر شد!' : 'Advertisement Published!',
          type: 'success',
        });
      }
    }, 480);
  };

  const NextArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevArrow = isRTL ? ArrowRight : ArrowLeft;

  if (publishedAd) {
    return (
      <PageTransition>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
          <div className={styles.successStage}>
            <CheckCircle2 size={56} color="#289e67" />
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900 }}>
              {lang === 'fa'
                ? 'تبریک! آگهی خدمت شما منتشر شد'
                : 'Your Service Advertisement is Live!'}
            </h1>
            <p style={{ color: '#666860', maxWidth: 460 }}>
              {lang === 'fa'
                ? 'آگهی شما اکنون در بخش کاوش خدمات و صفحه پروفایل تخصصی شما در معرض دید هزاران کارفرما قرار دارد.'
                : 'Your listing is now discoverable across Explore Marketplace and on your public Specialist Profile.'}
            </p>
            <Stack direction="row" spacing={1.2} flexWrap="wrap" justifyContent="center" useFlexGap sx={{ mt: 1 }}>
              <Link to={`/services/${publishedAd.id}`} className="owj-btn owj-btn--lime">
                {lang === 'fa' ? 'مشاهده آگهی منتشرشده' : 'View Published Ad'}
              </Link>
              <Link to="/dashboard?tab=ads" className="owj-btn owj-btn--dark">
                {lang === 'fa' ? 'مدیریت در داشبورد' : 'Go to Dashboard'}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPublishedAd(null);
                  setForm(INITIAL_FORM);
                  setStep(1);
                }}
                className="owj-btn owj-btn--outline"
              >
                {lang === 'fa' ? 'ثبت آگهی جدید' : 'Create Another'}
              </button>
            </Stack>
          </div>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
        >
          <div>
            <span className="owj-section-tag">
              {existingAd
                ? lang === 'fa'
                  ? 'ویرایش آگهی'
                  : 'Edit Listing'
                : lang === 'fa'
                ? 'ویزارد ۱۰ مرحله‌ای انتشار خدمت'
                : '10-Step Service Wizard'}
            </span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontWeight: 900, marginTop: 8 }}>
              {existingAd
                ? lang === 'fa'
                  ? 'ویرایش جزئیات خدمت تخصصی'
                  : 'Update Service Advertisement'
                : lang === 'fa'
                ? 'ثبت آگهی خدمت حرفه‌ای در اوجیفای'
                : 'Publish a Professional Service'}
            </h1>
          </div>

          {!existingAd && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="owj-btn owj-btn--outline owj-btn--sm"
            >
              <Save size={15} />
              <span>{lang === 'fa' ? 'ذخیره پیش‌نویس' : 'Save Draft'}</span>
            </button>
          )}
        </Stack>

        <Box sx={{ mt: 2.5, mb: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={step * 10}
            sx={{
              height: 8,
              borderRadius: '999px',
              bgcolor: 'rgba(17,18,15,0.08)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#11120F',
                borderRadius: '999px',
              },
            }}
          />
        </Box>

        {savedDraftBanner && (
          <div className={styles.draftBanner}>
            <span>
              {lang === 'fa'
                ? `یک پیش‌نویس ذخیره‌شده («${savedDraftBanner.title}») وجود دارد.`
                : `Saved draft found: "${savedDraftBanner.title}".`}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleResumeDraft}
                className="owj-btn owj-btn--dark owj-btn--sm"
              >
                {lang === 'fa' ? 'ادامه پیش‌نویس' : 'Resume Draft'}
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="owj-btn owj-btn--ghost owj-btn--sm"
              >
                {lang === 'fa' ? 'حذف' : 'Discard'}
              </button>
            </div>
          </div>
        )}

        {/* 10-Step Indicator */}
        <div className={styles.stepper}>
          {stepLabels.map((item) => (
            <button
              key={item.n}
              type="button"
              onClick={() => {
                if (item.n < step || validateStep(step)) setStep(item.n);
              }}
              className={`${styles.stepDot} ${step === item.n ? styles.current : ''} ${
                item.n < step ? styles.done : ''
              }`}
            >
              <div>{formatNumber(item.n, lang)}</div>
              <div style={{ fontSize: '0.67rem', marginTop: 2 }}>{item[lang]}</div>
            </button>
          ))}
        </div>

        <div className={styles.wizardCard}>
          {error && <div className={styles.errorBox}>{error}</div>}

          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa'
                  ? '۱. انتخاب دسته‌بندی و زیردسته تخصصی'
                  : '1. Select Category & Subcategory'}
              </h2>
              <div className={styles.catSelectGrid}>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        categoryId: cat.id,
                        subcategoryId: cat.subcategories?.[0]?.id || '',
                      }))
                    }
                    className={`${styles.catOption} ${
                      form.categoryId === cat.id ? styles.selected : ''
                    }`}
                  >
                    <CategoryIcon name={cat.icon} size={22} />
                    <div>
                      <div style={{ fontWeight: 800 }}>{l(cat.name)}</div>
                      <div style={{ fontSize: '0.76rem', opacity: 0.72 }}>{l(cat.tagline)}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className={styles.field} style={{ marginTop: '1.25rem' }}>
                <label>{lang === 'fa' ? 'زیردسته دقیق' : 'Subcategory'}</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => setForm((p) => ({ ...p, subcategoryId: e.target.value }))}
                >
                  {currentCategory.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {l(sub.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: TITLE */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? '۲. عنوان جذاب و خلاصه خدمت' : '2. Advertisement Title & Summary'}
              </h2>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'عنوان اصلی آگهی *' : 'Service Title *'}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder={
                    lang === 'fa'
                      ? 'مثلاً: طراحی و پیاده‌سازی وب‌اپلیکیشن اختصاصی React با معماری مدرن'
                      : 'e.g. Custom Minimalist Interior Architecture & 3D BIM Blueprints'
                  }
                />
              </div>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'خلاصه کوتاه برای کارت آگهی' : 'Short Card Tagline'}</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder={
                    lang === 'fa'
                      ? 'یک جمله خلاصه از مزیت اصلی و ضمانت کار شما...'
                      : 'One crisp sentence highlighting your key value proposition...'
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3: DESCRIPTION */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa'
                  ? '۳. شرح کامل خدمت و موارد تحویلی'
                  : '3. Detailed Description & Deliverables'}
              </h2>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'توضیحات کامل اجرایی *' : 'Full Service Description *'}</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder={
                    lang === 'fa'
                      ? 'فرآیند انجام کار، تجهیزات، استانداردهای کیفی و شرایط ضمانت خود را بنویسید...'
                      : 'Describe your workflow, tools, standards, and what clients can expect...'
                  }
                />
              </div>

              <div className={styles.field}>
                <label>{lang === 'fa' ? 'موارد تحویلی مشخص به کارفرما' : 'Included Deliverables'}</label>
                {form.deliverables.map((deliv, i) => (
                  <input
                    key={i}
                    type="text"
                    style={{ marginBottom: 8 }}
                    value={deliv}
                    onChange={(e) => {
                      const copy = [...form.deliverables];
                      copy[i] = e.target.value;
                      setForm((p) => ({ ...p, deliverables: copy }));
                    }}
                    placeholder={
                      lang === 'fa' ? `مورد تحویلی ${i + 1}` : `Deliverable item #${i + 1}`
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, deliverables: [...p.deliverables, ''] }))
                  }
                  className="owj-btn owj-btn--ghost owj-btn--sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Plus size={14} />
                  <span>{lang === 'fa' ? 'افزودن مورد جدید' : 'Add Deliverable'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SKILLS */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? '۴. افزودن مهارت‌ها و تخصص‌ها' : '4. Add Skills & Specialties'}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder={lang === 'fa' ? 'نام مهارت را تایپ کنید...' : 'Type a skill...'}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(17,18,15,0.16)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="owj-btn owj-btn--dark owj-btn--sm"
                >
                  <Plus size={15} />
                  <span>{lang === 'fa' ? 'افزودن' : 'Add'}</span>
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#666860' }}>
                  {lang === 'fa' ? 'پیشنهادهای هوشمند این دسته: ' : 'Suggested for category: '}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: 6 }}>
                  {(currentCategory.suggestedSkills || []).map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addSkill(l(sug))}
                      style={{
                        padding: '0.32rem 0.75rem',
                        borderRadius: '999px',
                        background: '#F6F5F0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      + {l(sug)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {form.skills.map((sk) => (
                  <span
                    key={sk}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '0.42rem 0.85rem',
                      borderRadius: '999px',
                      background: '#11120F',
                      color: '#C7F36B',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          skills: p.skills.filter((item) => item !== sk),
                        }))
                      }
                      style={{ color: '#F6F5F0' }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PRICING */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? '۵. تعیین مدل قیمت‌گذاری و تعرفه پایه' : '5. Set Pricing'}
              </h2>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'نوع تعرفه' : 'Pricing Model'}</label>
                <select
                  value={form.pricingType}
                  onChange={(e) => setForm((p) => ({ ...p, pricingType: e.target.value }))}
                >
                  <option value="شروع تعرفه خدمت">
                    {lang === 'fa' ? 'شروع تعرفه خدمت' : 'Starting Rate'}
                  </option>
                  <option value="ساعتی / جلسه‌ای">
                    {lang === 'fa' ? 'ساعتی / جلسه‌ای' : 'Hourly / Per Session'}
                  </option>
                  <option value="پروژه‌ای مقطوع">
                    {lang === 'fa' ? 'پروژه‌ای مقطوع' : 'Fixed Project Package'}
                  </option>
                </select>
              </div>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'مبلغ تعرفه پایه (تومان) *' : 'Base Amount (Toman) *'}</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                />
                <span style={{ fontSize: '0.82rem', color: '#289e67', fontWeight: 700 }}>
                  {lang === 'fa' ? 'نمایش به کارفرما: ' : 'Displayed as: '}
                  {formatPrice(Number(form.price || 0), lang)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: LOCATION */}
          {step === 6 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? '۶. انتخاب شهر و محدوده ارائه خدمت' : '6. Select Location'}
              </h2>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'شهر اصلی فعالیت' : 'Primary City'}</label>
                <select
                  value={form.locationId}
                  onChange={(e) => setForm((p) => ({ ...p, locationId: e.target.value }))}
                >
                  {LOCATIONS.map((locItem) => (
                    <option key={locItem.id} value={locItem.id}>
                      {l(locItem.name)}
                    </option>
                  ))}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.remoteAvailable}
                  onChange={(e) => setForm((p) => ({ ...p, remoteAvailable: e.target.checked }))}
                />
                <span>
                  {lang === 'fa'
                    ? 'امکان ارائه خدمت به‌صورت آنلاین / دورکاری نیز وجود دارد'
                    : 'This service can also be delivered remotely / online'}
                </span>
              </label>
            </div>
          )}

          {/* STEP 7: IMAGES */}
          {step === 7 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? '۷. بارگذاری تصاویر نمونه کار و کاور' : '7. Upload Cover & Gallery Images'}
              </h2>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <label className="owj-btn owj-btn--dark owj-btn--sm" style={{ cursor: 'pointer' }}>
                  <Upload size={15} />
                  <span>{lang === 'fa' ? 'انتخاب تصویر از دستگاه' : 'Upload from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                <div style={{ display: 'flex', gap: '0.4rem', flex: 1, minWidth: 240 }}>
                  <input
                    type="url"
                    value={customImgUrl}
                    onChange={(e) => setCustomImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.85rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(17,18,15,0.16)',
                      direction: 'ltr',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImgUrl.trim()) {
                        setForm((p) => ({ ...p, images: [...p.images, customImgUrl.trim()] }));
                        setCustomImgUrl('');
                      }
                    }}
                    className="owj-btn owj-btn--outline owj-btn--sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#666860', marginBottom: 6 }}>
                {lang === 'fa'
                  ? 'یا انتخاب سریع از تصاویر استودیویی پیشنهادی:'
                  : 'Or add from curated studio presets:'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: 6 }}>
                {PRESET_GALLERY.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!form.images.includes(url)) {
                        setForm((p) => ({ ...p, images: [...p.images, url] }));
                      }
                    }}
                    style={{
                      width: 78,
                      height: 56,
                      borderRadius: 10,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: form.images.includes(url)
                        ? '2px solid #C7F36B'
                        : '1px solid rgba(17,18,15,0.15)',
                    }}
                  >
                    <SmartImage src={url} alt="Preset" />
                  </button>
                ))}
              </div>

              <div className={styles.imgGrid}>
                {form.images.map((img, idx) => (
                  <div key={idx} className={styles.imgThumb}>
                    <SmartImage src={img} alt={`Preview ${idx + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImgBtn}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          images: p.images.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: AVAILABILITY & CONTACT */}
          {step === 8 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa'
                  ? '۸. زمان‌بندی پاسخ‌گویی و ترجیحات تماس'
                  : '8. Availability & Contact Preferences'}
              </h2>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'ساعات کاری و پاسخ‌گویی' : 'Working Hours'}</label>
                <input
                  type="text"
                  value={form.availabilityHours}
                  onChange={(e) => setForm((p) => ({ ...p, availabilityHours: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.urgentAvailable}
                    onChange={(e) => setForm((p) => ({ ...p, urgentAvailable: e.target.checked }))}
                  />
                  <span>
                    {lang === 'fa'
                      ? 'امکان اعزام / پاسخ‌گویی فوری وجود دارد'
                      : 'Available for urgent / express requests'}
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.weekendAvailable}
                    onChange={(e) => setForm((p) => ({ ...p, weekendAvailable: e.target.checked }))}
                  />
                  <span>
                    {lang === 'fa' ? 'در روزهای پایان هفته نیز فعال هستم' : 'Available on weekends'}
                  </span>
                </label>
              </div>

              <div className={styles.field}>
                <label>{lang === 'fa' ? 'روش ارتباط ترجیحی' : 'Preferred Contact Channel'}</label>
                <select
                  value={form.contactPref}
                  onChange={(e) => setForm((p) => ({ ...p, contactPref: e.target.value }))}
                >
                  <option value="chat">
                    {lang === 'fa' ? 'پیام‌رسان داخلی اوجیفای' : 'OWJIFY Internal Messenger'}
                  </option>
                  <option value="both">
                    {lang === 'fa' ? 'پیام‌رسان و هماهنگی تلفنی' : 'Messenger + Phone Call'}
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 9: PREVIEW */}
          {step === 9 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa'
                  ? '۹. پیش‌نمایش نهایی آگهی پیش از انتشار'
                  : '9. Preview Advertisement'}
              </h2>
              <div
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(17,18,15,0.12)',
                  overflow: 'hidden',
                  background: '#F6F5F0',
                }}
              >
                <div style={{ height: 220 }}>
                  <SmartImage src={form.images[0]} alt={form.title} />
                </div>
                <div style={{ padding: '1.35rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#666860' }}>
                    {l(currentCategory.name)} • {l(getLocationById(form.locationId).name)}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: 4 }}>
                    {form.title || (lang === 'fa' ? 'بدون عنوان' : 'Untitled')}
                  </h3>
                  <p style={{ marginTop: 8, fontSize: '0.9rem', color: '#464841', lineHeight: 1.75 }}>
                    {form.description}
                  </p>
                  <div style={{ marginTop: 12, fontWeight: 900, fontSize: '1.15rem' }}>
                    {formatPrice(Number(form.price || 0), lang)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: PUBLISH */}
          {step === 10 && (
            <div style={{ textAlign: 'center', paddingBlock: '1.5rem' }}>
              <Sparkles size={44} color="#289e67" style={{ marginInline: 'auto' }} />
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, marginTop: '0.85rem' }}>
                {lang === 'fa'
                  ? '۱۰. همه‌چیز آماده انتشار در ویترین اوجیفای است!'
                  : '10. Ready to Publish Your Listing'}
              </h2>
              <p style={{ color: '#666860', maxWidth: 460, margin: '0.65rem auto 1.5rem' }}>
                {lang === 'fa'
                  ? 'با کلیک بر روی دکمه زیر، آگهی شما بلافاصله در بازارگاه فعال شده و برای کارفرمایان قابل جستجو خواهد بود.'
                  : 'Click Publish below to make your service immediately searchable across OWJIFY.'}
              </p>
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublish}
                className="owj-btn owj-btn--lime owj-btn--lg"
              >
                {publishing ? <span className="owj-spinner" /> : <CheckCircle2 size={18} />}
                <span>
                  {existingAd
                    ? lang === 'fa'
                      ? 'ذخیره تغییرات آگهی'
                      : 'Save Changes'
                    : lang === 'fa'
                    ? 'انتشار نهایی آگهی'
                    : 'Publish Advertisement Now'}
                </span>
              </button>
            </div>
          )}

          {/* Step Navigation */}
          <div className={styles.navBar}>
            <button
              type="button"
              disabled={step === 1}
              onClick={handlePrev}
              className="owj-btn owj-btn--outline owj-btn--sm"
            >
              <PrevArrow size={15} />
              <span>{lang === 'fa' ? 'مرحله قبل' : 'Previous'}</span>
            </button>

            <span style={{ fontSize: '0.82rem', color: '#666860', fontWeight: 700 }}>
              {lang === 'fa'
                ? `گام ${formatNumber(step, lang)} از ${formatNumber(10, lang)}`
                : `Step ${step} of 10`}
            </span>

            {step < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                className="owj-btn owj-btn--dark owj-btn--sm"
              >
                <span>{lang === 'fa' ? 'مرحله بعد' : 'Next Step'}</span>
                <NextArrow size={15} />
              </button>
            ) : (
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublish}
                className="owj-btn owj-btn--lime owj-btn--sm"
              >
                {lang === 'fa' ? 'انتشار' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
