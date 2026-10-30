export const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'message',
    read: false,
    createdAt: '2026-10-30T11:42:00Z',
    link: '/messages',
    title: {
      fa: 'پیام جدید از سارا کاظمی‌نیا',
      en: 'New message from Sara Kazeminia',
    },
    body: {
      fa: 'پیشنهاد زمان بازدید و برداشت لیزری پلان برای روز دوشنبه یا سه‌شنبه ارسال شد.',
      en: 'Sent available time slots for your apartment laser floorplan survey.',
    },
  },
  {
    id: 'notif-2',
    type: 'review',
    read: false,
    createdAt: '2026-10-30T08:15:00Z',
    link: '/dashboard?tab=reviews',
    title: {
      fa: 'دیدگاه ۵ ستاره جدید ثبت شد',
      en: 'New 5-star client review received',
    },
    body: {
      fa: 'نیما رحمانی برای خدمت سرویس تخصصی کولر گازی امتیاز کامل ۵.۰ ثبت کرد.',
      en: 'Nima Rahmani rated your HVAC service 5.0 stars with a detailed review.',
    },
  },
  {
    id: 'notif-3',
    type: 'ad_status',
    read: false,
    createdAt: '2026-10-29T18:30:00Z',
    link: '/dashboard?tab=ads',
    title: {
      fa: 'آگهی شما تایید و در ویترین منتشر شد',
      en: 'Your service advertisement is live',
    },
    body: {
      fa: 'آگهی شما پس از بررسی کیفیت محتوا در فهرست خدمات تاییدشده اوجیفای قرار گرفت.',
      en: 'Your listing passed quality review and is now discoverable across Explore.',
    },
  },
  {
    id: 'notif-4',
    type: 'profile',
    read: true,
    createdAt: '2026-10-28T20:10:00Z',
    link: '/dashboard',
    title: {
      fa: 'افزایش ۳۴٪ بازدید پروفایل تخصصی در این هفته',
      en: 'Profile views surged +34% this week',
    },
    body: {
      fa: 'پروفایل شما در این هفته ۱۲۸ بار توسط کارفرمایان در دسته‌بندی مرتبط مشاهده شده است.',
      en: '128 prospective clients viewed your specialist portfolio over the past 7 days.',
    },
  },
  {
    id: 'notif-5',
    type: 'account',
    read: true,
    createdAt: '2026-10-26T12:00:00Z',
    link: '/settings',
    title: {
      fa: 'نشان تایید هویت حرفه‌ای فعال شد',
      en: 'Verified Specialist badge activated',
    },
    body: {
      fa: 'مدارک تخصصی و هویتی حساب کاربری شما با موفقیت تایید گردید.',
      en: 'Your identity and professional credentials have been verified on OWJIFY.',
    },
  },
  {
    id: 'notif-6',
    type: 'message',
    read: true,
    createdAt: '2026-10-25T16:40:00Z',
    link: '/messages',
    title: {
      fa: 'پاسخ جدید از آرین رادمهر',
      en: 'Reply from Arian Radmehr',
    },
    body: {
      fa: 'ساعت ۱۷:۳۰ در محدوده سعادت‌آباد جهت عیب‌یابی حضور خواهم داشت.',
      en: 'Confirmed 5:30 PM arrival window for inverter unit diagnostics.',
    },
  },
];

export const SEED_INQUIRIES = [
  {
    id: 'inq-1',
    clientName: { fa: 'کوروش پناهی', en: 'Kourosh Panahi' },
    clientEmail: 'kourosh.panahi@example.com',
    serviceTitle: {
      fa: 'طراحی و توسعه وب‌اپلیکیشن اختصاصی React',
      en: 'Custom React Web Application Engineering',
    },
    budget: 34000000,
    budgetUsd: 890,
    preferredDate: '2026-11-04',
    status: 'pending',
    message: {
      fa: 'نیاز به طراحی و پیاده‌سازی پنل رزرواسیون کلینیک با تقویم نوبت‌دهی آنلاین و درگاه پیامک داریم.',
      en: 'Looking to build a modern multi-branch booking portal with interactive scheduling.',
    },
    createdAt: '2026-10-30T09:40:00Z',
  },
  {
    id: 'inq-2',
    clientName: { fa: 'پریناز دولت‌آبادی', en: 'Parinaz Dolatabadi' },
    clientEmail: 'parinaz@example.com',
    serviceTitle: {
      fa: 'سرویس تخصصی کولر گازی اینورتر',
      en: 'Precision Inverter AC Diagnostics',
    },
    budget: 2900000,
    budgetUsd: 95,
    preferredDate: '2026-11-01',
    status: 'accepted',
    message: {
      fa: 'سرویس فصلی دو دستگاه اسپلیت ۲۴ هزار در محدوده ولنجک.',
      en: 'Seasonal servicing and pressure check for two 24,000 BTU split units.',
    },
    createdAt: '2026-10-29T14:15:00Z',
  },
  {
    id: 'inq-3',
    clientName: { fa: 'مازیار خسروی', en: 'Maziar Khosravi' },
    clientEmail: 'maziar.k@example.com',
    serviceTitle: {
      fa: 'طراحی هویت بصری برند و کتابچه راهنما',
      en: 'Complete Brand Identity System',
    },
    budget: 16000000,
    budgetUsd: 440,
    preferredDate: '2026-11-10',
    status: 'completed',
    message: {
      fa: 'طراحی نشانه، پالت رنگی و بسته‌بندی خط جدید محصولات ارگانیک.',
      en: 'Logo mark, color system, and sustainable box sleeves for organic skincare.',
    },
    createdAt: '2026-10-22T11:00:00Z',
  },
];
