export const SEED_SUPPORT_TICKETS = [
  {
    id: 'SUP-1041',
    category: 'report_listing', // 'report_listing' | 'technical' | 'dispute' | 'general'
    priority: 'high', // 'normal' | 'high' | 'urgent'
    status: 'open', // 'open' | 'in_progress' | 'answered' | 'resolved'
    reporterUserId: 'user-client-demo',
    reporterRole: 'customer',
    reporterName: 'پارسا نیک‌فر | Parsa Nikfar',
    reporterEmail: 'client@owjify.com',
    relatedAdId: 'ad-104',
    relatedAdTitle: {
      fa: 'طراحی هویت بصری و کتابچه برند',
      en: 'Complete Brand Identity System',
    },
    subject: {
      fa: 'گزارش مغایرت جزئیات زمان تحویل در آگهی',
      en: 'Report: Delivery timeline discrepancy on listing',
    },
    messages: [
      {
        id: 'st-m1',
        authorRole: 'reporter',
        authorName: 'پارسا نیک‌فر | Parsa Nikfar',
        text: {
          fa: 'سلام وقت بخیر، در توضیحات این آگهی زمان تحویل ۷ روز ذکر شده اما در فایل پیوست ۲۰ روز اعلام می‌شود. لطفاً بررسی بفرمایید.',
          en: 'Hello Support, the listing states a 7-day delivery timeline in the summary, whereas the scope notes mention 20 business days. Please review.',
        },
        createdAt: '2026-10-30T10:12:00Z',
      },
    ],
    createdAt: '2026-10-30T10:12:00Z',
    updatedAt: '2026-10-30T10:12:00Z',
  },
  {
    id: 'SUP-1040',
    category: 'dispute',
    priority: 'urgent',
    status: 'open',
    reporterUserId: 'cust-mahsa',
    reporterRole: 'customer',
    reporterName: 'مهسا شریفی | Mahsa Sharifi',
    reporterEmail: 'mahsa.sharifi@example.com',
    relatedAdId: 'ad-101',
    relatedAdTitle: {
      fa: 'سرویس تخصصی کولر گازی اینورتر و سیستم‌های VRF',
      en: 'Precision Inverter AC & VRF Diagnostics',
    },
    subject: {
      fa: 'درخواست هماهنگی فوری بازدید خارج از نوبت کلینیک',
      en: 'Urgent scheduling assistance for medical clinic VRF',
    },
    messages: [
      {
        id: 'st-m2',
        authorRole: 'reporter',
        authorName: 'مهسا شریفی | Mahsa Sharifi',
        text: {
          fa: 'سلام به تیم پشتیبانی اوجیفای، سیستم تهویه اتاق کلینیک متوقف شده و نیاز به تسریع هماهنگی با متخصص داریم.',
          en: 'Hello OWJIFY Support, our clinic HVAC unit halted and we need operator help expediting specialist dispatch.',
        },
        createdAt: '2026-10-30T09:30:00Z',
      },
    ],
    createdAt: '2026-10-30T09:30:00Z',
    updatedAt: '2026-10-30T09:30:00Z',
  },
  {
    id: 'SUP-1039',
    category: 'technical',
    priority: 'normal',
    status: 'answered',
    reporterUserId: 'user-pro-demo',
    reporterRole: 'professional',
    reporterName: 'آرین رادمهر | Arian Radmehr',
    reporterEmail: 'pro@owjify.com',
    relatedAdId: null,
    relatedAdTitle: null,
    subject: {
      fa: 'سوال درباره ارتقای نشان تایید مدارک نظام مهندسی',
      en: 'Question regarding Engineering Council badge verification',
    },
    messages: [
      {
        id: 'st-m3',
        authorRole: 'reporter',
        authorName: 'آرین رادمهر | Arian Radmehr',
        text: {
          fa: 'سلام، گواهینامه جدید VRF بین‌المللی خود را بارگذاری کرده‌ام. چه زمانی در پروفایل عمومی تایید نهایی می‌شود؟',
          en: 'Hello, I uploaded my updated international VRF certification. How soon will the credential appear on my public profile?',
        },
        createdAt: '2026-10-29T14:20:00Z',
      },
      {
        id: 'st-m4',
        authorRole: 'operator',
        authorName: 'سحر پناهی (اپراتور پشتیبانی) | Support Operator',
        text: {
          fa: 'سلام مهندس رادمهر عزیز، مدرک شما توسط واحد احراز صلاحیت اوجیفای بررسی و تایید شد و هم‌اکنون در پروفایل شما فعال است.',
          en: 'Hello Arian! Your certification has been verified by our Trust & Quality team and is now active on your public profile.',
        },
        createdAt: '2026-10-29T15:05:00Z',
      },
    ],
    createdAt: '2026-10-29T14:20:00Z',
    updatedAt: '2026-10-29T15:05:00Z',
  },
  {
    id: 'SUP-1038',
    category: 'general',
    priority: 'normal',
    status: 'resolved',
    reporterUserId: 'cust-amir',
    reporterRole: 'customer',
    reporterName: 'امیرحسین توکلی | Amirhossein Tavakoli',
    reporterEmail: 'amir.tavakoli@example.com',
    relatedAdId: null,
    relatedAdTitle: null,
    subject: {
      fa: 'تقدیر از سرعت ارتباط با متخصص در اوجیفای',
      en: 'Positive feedback on direct specialist matching',
    },
    messages: [
      {
        id: 'st-m5',
        authorRole: 'reporter',
        authorName: 'امیرحسین توکلی | Amirhossein Tavakoli',
        text: {
          fa: 'فقط خواستم تشکر کنم؛ در کمتر از ۲۰ دقیقه متخصص مناسب را پیدا کردم و کار با کیفیت عالی انجام شد.',
          en: 'Wanted to share appreciation—found a vetted engineer in under 20 minutes and the repair went seamlessly.',
        },
        createdAt: '2026-10-28T11:00:00Z',
      },
      {
        id: 'st-m6',
        authorRole: 'operator',
        authorName: 'سحر پناهی (اپراتور پشتیبانی) | Support Operator',
        text: {
          fa: 'سپاس از همراهی گرم شما! هدف اوجیفای دقیقاً ایجاد همین ارتباط سریع و مطمئن میان انسان‌هاست.',
          en: 'Thank you so much! Connecting people reliably and effortlessly is the heart of OWJIFY.',
        },
        createdAt: '2026-10-28T11:45:00Z',
      },
    ],
    createdAt: '2026-10-28T11:00:00Z',
    updatedAt: '2026-10-28T11:45:00Z',
  },
];
