export const CATEGORIES = [
  {
    id: 'home',
    slug: 'home-services',
    icon: 'Wrench',
    name: { fa: 'خدمات منزل و تاسیسات', en: 'Home Services' },
    tagline: {
      fa: 'تعمیر و نگهداری تخصصی تاسیسات، برق و دکوراسیون چوبی',
      en: 'Precision HVAC, electrical, plumbing & bespoke home care',
    },
    accent: '#C7F36B',
    cover:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'ac', name: { fa: 'تعمیر و سرویس کولر و تهویه', en: 'Air Conditioning' } },
      { id: 'plumbing', name: { fa: 'لوله‌کشی و تاسیسات مکانیکی', en: 'Plumbing' } },
      { id: 'electrical', name: { fa: 'برق‌کاری و تابلو برق', en: 'Electrical' } },
      { id: 'cleaning', name: { fa: 'نظافت تخصصی و کفسابی', en: 'Deep Cleaning' } },
      { id: 'painting', name: { fa: 'نقاشی و پتینه ساختمان', en: 'Painting' } },
      { id: 'carpentry', name: { fa: 'نجاری، کابینت و سازه چوبی', en: 'Carpentry' } },
    ],
    suggestedSkills: [
      { fa: 'کولر گازی اینورتر', en: 'Inverter HVAC' },
      { fa: 'عیب‌یابی تابلو برق', en: 'Panel Diagnostics' },
      { fa: 'لوله‌کشی پنج‌لایه', en: 'PEX Piping' },
      { fa: 'نجاری سفارشی', en: 'Custom Millwork' },
      { fa: 'رنگ اکریلیک بدون بو', en: 'Zero-VOC Painting' },
    ],
  },
  {
    id: 'technology',
    slug: 'technology',
    icon: 'Code2',
    name: { fa: 'فناوری و توسعه نرم‌افزار', en: 'Technology' },
    tagline: {
      fa: 'مهندسان نرم‌افزار، طراحان محصول، شبکه و امنیت سایبری',
      en: 'Full-stack engineers, product designers, cloud & security specialists',
    },
    accent: '#9FE870',
    cover:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'web-dev', name: { fa: 'توسعه وب و سامانه', en: 'Web Development' } },
      { id: 'mobile-dev', name: { fa: 'توسعه اپلیکیشن موبایل', en: 'Mobile Development' } },
      { id: 'ui-ux', name: { fa: 'طراحی رابط و تجربه کاربری', en: 'UI/UX Design' } },
      { id: 'it-support', name: { fa: 'پشتیبانی آی‌تی و سرور', en: 'IT Support' } },
      { id: 'networking', name: { fa: 'شبکه، میکروتیک و زیرساخت', en: 'Networking' } },
      { id: 'cybersecurity', name: { fa: 'امنیت سایبری و تست نفوذ', en: 'Cybersecurity' } },
    ],
    suggestedSkills: [
      { fa: 'React و معماری فرانت‌اند', en: 'React Architecture' },
      { fa: 'سیستم طراحی Figma', en: 'Figma Design Systems' },
      { fa: 'تست نفوذ وب', en: 'Penetration Testing' },
      { fa: 'مجازی‌سازی و Docker', en: 'Docker & DevOps' },
    ],
  },
  {
    id: 'construction',
    slug: 'construction',
    icon: 'Building2',
    name: { fa: 'معماری و بازسازی ساختمان', en: 'Construction' },
    tagline: {
      fa: 'معماری مدرن، طراحی داخلی لوکس، نظارت سازه و بازسازی کامل',
      en: 'Architectural studios, luxury interiors, structural & turnkey renovation',
    },
    accent: '#D8F892',
    cover:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'architecture', name: { fa: 'طراحی معماری و نما', en: 'Architecture' } },
      { id: 'interior', name: { fa: 'معماری و دکوراسیون داخلی', en: 'Interior Design' } },
      { id: 'civil', name: { fa: 'مهندسی عمران و محاسبات سازه', en: 'Civil Engineering' } },
      { id: 'renovation', name: { fa: 'بازسازی صفر تا صد', en: 'Renovation' } },
    ],
    suggestedSkills: [
      { fa: 'مدل‌سازی BIM و Revit', en: 'BIM & Revit' },
      { fa: 'نورپردازی معماری', en: 'Architectural Lighting' },
      { fa: 'مدیریت پیمان', en: 'Turnkey Contracting' },
      { fa: 'رندرینگ سه‌بعدی', en: '3D Visualization' },
    ],
  },
  {
    id: 'education',
    slug: 'education',
    icon: 'GraduationCap',
    name: { fa: 'آموزش و تدریس خصوصی', en: 'Education' },
    tagline: {
      fa: 'اساتید برجسته زبان، ریاضیات، برنامه‌نویسی و موسیقی',
      en: '1-on-1 mentorship in languages, STEM, coding & classical/modern music',
    },
    accent: '#C7F36B',
    cover:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'mathematics', name: { fa: 'ریاضیات و المپیاد', en: 'Mathematics' } },
      { id: 'languages', name: { fa: 'زبان‌های خارجی و آیلتس', en: 'Languages' } },
      { id: 'programming', name: { fa: 'آموزش برنامه‌نویسی و هوش مصنوعی', en: 'Programming' } },
      { id: 'music', name: { fa: 'آموزش ساز و تئوری موسیقی', en: 'Music' } },
    ],
    suggestedSkills: [
      { fa: 'آیلتس آکادمیک +۸', en: 'IELTS Band 8+ Prep' },
      { fa: 'پایتون و علم داده', en: 'Python & Data Science' },
      { fa: 'پیانو کلاسیک', en: 'Classical Piano' },
      { fa: 'ریاضیات مهندسی', en: 'Calculus & Linear Algebra' },
    ],
  },
  {
    id: 'automotive',
    slug: 'automotive',
    icon: 'Car',
    name: { fa: 'خدمات تخصصی خودرو', en: 'Automotive' },
    tagline: {
      fa: 'عیب‌یابی موتور، برق و دیاگ تخصصی، دیتیلینگ و سرامیک بدنه',
      en: 'Master mechanics, ECU diagnostics, auto-electrical & ceramic detailing',
    },
    accent: '#B5E650',
    cover:
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'car-repair', name: { fa: 'مکانیکی و تعمیر موتور', en: 'Car Repair' } },
      { id: 'auto-elec', name: { fa: 'برق خودرو و دیاگ تخصصی', en: 'Auto Electrical' } },
      { id: 'detailing', name: { fa: 'دیتیلینگ، پولیش و سرامیک', en: 'Car Detailing' } },
    ],
    suggestedSkills: [
      { fa: 'دیاگ خودروهای وارداتی', en: 'European ECU Diagnostics' },
      { fa: 'پوشش نانو سرامیک', en: '9H Ceramic Coating' },
      { fa: 'تعمیر گیربکس اتوماتیک', en: 'Automatic Transmission' },
    ],
  },
  {
    id: 'business',
    slug: 'business',
    icon: 'Briefcase',
    name: { fa: 'کسب‌وکار و مشاوره', en: 'Business' },
    tagline: {
      fa: 'مشاوران مالی و مالیاتی، استراتژی رشد، بازاریابی و امور حقوقی',
      en: 'Financial controllers, strategy advisors, growth marketers & legal counsel',
    },
    accent: '#C7F36B',
    cover:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'accounting', name: { fa: 'حسابداری و مشاوره مالیاتی', en: 'Accounting' } },
      { id: 'consulting', name: { fa: 'مشاوره مدیریت و استارتاپ', en: 'Consulting' } },
      { id: 'marketing', name: { fa: 'مارکتینگ و سئو استراتژیک', en: 'Marketing' } },
      { id: 'legal', name: { fa: 'قراردادها و مشاوره حقوقی', en: 'Legal Services' } },
    ],
    suggestedSkills: [
      { fa: 'مدل‌سازی مالی', en: 'Financial Modeling' },
      { fa: 'قراردادهای تجاری', en: 'Commercial Contracts' },
      { fa: 'استراتژی ورود به بازار', en: 'Go-To-Market Strategy' },
      { fa: 'سئو تکنیکال', en: 'Technical SEO' },
    ],
  },
  {
    id: 'creative',
    slug: 'creative',
    icon: 'Camera',
    name: { fa: 'هنر، عکاسی و برندینگ', en: 'Creative' },
    tagline: {
      fa: 'عکاسی تبلیغاتی و معماری، تدوین سینمایی، هویت بصری برند',
      en: 'Commercial photography, cinema editing, graphic systems & brand identity',
    },
    accent: '#D8F892',
    cover:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'photography', name: { fa: 'عکاسی صنعتی، پرتره و معماری', en: 'Photography' } },
      { id: 'video-editing', name: { fa: 'تدوین ویدیو و اصلاح رنگ', en: 'Video Editing' } },
      { id: 'graphic-design', name: { fa: 'طراحی گرافیک و بسته‌بندی', en: 'Graphic Design' } },
      { id: 'branding', name: { fa: 'طراحی لوگو و هویت بصری', en: 'Branding' } },
    ],
    suggestedSkills: [
      { fa: 'عکاسی استودیویی محصول', en: 'Studio Product Photography' },
      { fa: 'اصلاح رنگ DaVinci', en: 'DaVinci Color Grading' },
      { fa: 'کتابچه هویت برند', en: 'Brand Guidelines' },
    ],
  },
  {
    id: 'smart-living',
    slug: 'smart-living',
    icon: 'Cpu',
    name: { fa: 'خانه هوشمند و تشریفات', en: 'Smart Living & Events' },
    tagline: {
      fa: 'هوشمندسازی ساختمان، سیستم‌های صوتی و برنامه‌ریزی رویدادهای خاص',
      en: 'KNX smart home automation, acoustic engineering & curated private events',
    },
    accent: '#C7F36B',
    cover:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
    subcategories: [
      { id: 'smart-home', name: { fa: 'هوشمندسازی KNX و کنترل تردد', en: 'Smart Home Automation' } },
      { id: 'event-design', name: { fa: 'طراحی و اجرای رویداد و همایش', en: 'Event Production' } },
      { id: 'appliances', name: { fa: 'تعمیر تخصصی لوازم خانگی لوکس', en: 'Appliance Engineering' } },
    ],
    suggestedSkills: [
      { fa: 'پروتکل KNX و Zigbee', en: 'KNX & Zigbee Systems' },
      { fa: 'طراحی صحنه و رویداد', en: 'Stage & Event Curation' },
      { fa: 'کالیبراسیون صوتی', en: 'Acoustic Calibration' },
    ],
  },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

export function getSubcategoryById(catId, subId) {
  const cat = getCategoryById(catId);
  if (!cat) return null;
  return cat.subcategories.find((s) => s.id === subId) || null;
}
