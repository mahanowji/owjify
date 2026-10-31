/**
 * Role-aware two-way conversations for OWJIFY:
 * - Demo Client: userId = 'user-client-demo' (Parsa Nikfar, customer)
 * - Demo Specialist: userId = 'user-pro-demo', proId = 'pro-1' (Arian Radmehr, provider)
 *
 * Rules supported:
 * 1. Customers see messages they sent to providers (initiatorUserId === customer.id).
 * 2. Providers see:
 *    - Messages they received from customers (recipientProId === provider.proId || recipientUserId === provider.id)
 *    - Messages & Skill Requests they sent to others (initiatorUserId === provider.id || initiatorProId === provider.proId)
 */
export const SEED_CONVERSATIONS = [
  // 1) Sent by Demo Client (Parsa Nikfar) -> Received by Demo Provider (Arian Radmehr, pro-1)
  {
    id: 'conv-client-pro1',
    threadKind: 'service_inquiry',
    initiatorUserId: 'user-client-demo',
    initiatorProId: null,
    initiatorRole: 'customer',
    initiatorName: { fa: 'پارسا نیک‌فر', en: 'Parsa Nikfar' },
    initiatorTitle: { fa: 'مدیر محصول و کارفرما', en: 'Product Manager & Client' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-demo',
    recipientProId: 'pro-1',
    recipientName: { fa: 'آرین رادمهر', en: 'Arian Radmehr' },
    recipientTitle: { fa: 'مهندس ارشد تهویه مطبوع و VRF', en: 'Master HVAC Engineer' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    online: true,
    unreadByInitiator: 1,
    unreadByRecipient: 1,
    serviceTitle: {
      fa: 'سرویس تخصصی کولر گازی اینورتر و VRF',
      en: 'Precision Inverter AC & VRF Diagnostics',
    },
    updatedAt: '2026-10-30T11:20:00Z',
    messages: [
      {
        id: 'm-cp1-1',
        senderUserId: 'user-client-demo',
        text: {
          fa: 'سلام مهندس رادمهر، داکت اسپلیت دفتر ما ارور E4 می‌دهد. امکان بازدید امروز عصر هست؟',
          en: 'Hi Arian, our office ducted split unit is showing an E4 fault code. Are you available this afternoon?',
        },
        createdAt: '2026-10-30T10:55:00Z',
      },
      {
        id: 'm-cp1-2',
        senderUserId: 'user-pro-demo',
        text: {
          fa: 'سلام آقای نیک‌فر، بله ساعت ۱۷:۳۰ در محدوده سعادت‌آباد هستم و تجهیزات تست برد و گیج دیجیتال همراهم هست.',
          en: 'Hello Parsa! Yes, I will be in Saadat Abad at 5:30 PM with full PCB and digital manifold diagnostic gear.',
        },
        createdAt: '2026-10-30T11:20:00Z',
      },
    ],
  },

  // 2) Sent by Demo Client (Parsa Nikfar) -> Sara Kazeminia (pro-2)
  {
    id: 'conv-client-pro2',
    threadKind: 'service_inquiry',
    initiatorUserId: 'user-client-demo',
    initiatorProId: null,
    initiatorRole: 'customer',
    initiatorName: { fa: 'پارسا نیک‌فر', en: 'Parsa Nikfar' },
    initiatorTitle: { fa: 'مدیر محصول و کارفرما', en: 'Product Manager & Client' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-2',
    recipientProId: 'pro-2',
    recipientName: { fa: 'سارا کاظمی‌نیا', en: 'Sara Kazeminia' },
    recipientTitle: { fa: 'معمار ارشد و طراح داخلی', en: 'Principal Interior Architect' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    online: true,
    unreadByInitiator: 1,
    unreadByRecipient: 0,
    serviceTitle: {
      fa: 'طراحی معماری داخلی مدرن مسکونی',
      en: 'Bespoke Minimalist Interior Architecture',
    },
    updatedAt: '2026-10-30T11:42:00Z',
    messages: [
      {
        id: 'm-cp2-1',
        senderUserId: 'user-client-demo',
        text: {
          fa: 'سلام خانم مهندس کاظمی‌نیا، برای بازسازی یک واحد ۱۶۵ متری در شهرک غرب می‌خواستم زمان بازدید اولیه را هماهنگ کنم.',
          en: 'Hello Sara, I would love to schedule an initial spatial survey for our 165sqm apartment renovation.',
        },
        createdAt: '2026-10-30T10:15:00Z',
      },
      {
        id: 'm-cp2-2',
        senderUserId: 'user-pro-2',
        text: {
          fa: 'سلام و وقت بخیر! با کمال میل. روز دوشنبه ساعت ۱۶ یا سه‌شنبه ساعت ۱۱ صبح برای برداشت لیزری پلان برایتان مناسب است؟',
          en: 'Hello! Delighted to connect. Would Monday at 4:00 PM or Tuesday at 11:00 AM work for our laser floorplan survey?',
        },
        createdAt: '2026-10-30T11:42:00Z',
      },
    ],
  },

  // 3) Sent by Demo Client (Parsa Nikfar) -> Keyvan Bahrami (pro-3)
  {
    id: 'conv-client-pro3',
    threadKind: 'service_inquiry',
    initiatorUserId: 'user-client-demo',
    initiatorProId: null,
    initiatorRole: 'customer',
    initiatorName: { fa: 'پارسا نیک‌فر', en: 'Parsa Nikfar' },
    initiatorTitle: { fa: 'مدیر محصول و کارفرما', en: 'Product Manager & Client' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-3',
    recipientProId: 'pro-3',
    recipientName: { fa: 'کیوان بهرامی', en: 'Keyvan Bahrami' },
    recipientTitle: { fa: 'مهندس فول‌استک و معمار سامانه', en: 'Senior Full-Stack Architect' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    online: false,
    unreadByInitiator: 0,
    unreadByRecipient: 0,
    serviceTitle: {
      fa: 'توسعه وب‌اپلیکیشن اختصاصی React',
      en: 'Custom React SaaS Engineering',
    },
    updatedAt: '2026-10-29T19:50:00Z',
    messages: [
      {
        id: 'm-cp3-1',
        senderUserId: 'user-client-demo',
        text: {
          fa: 'مستند نیازمندی‌های فاز اول سامانه مشتریان ما را بررسی فرمودید؟',
          en: 'Did you get a chance to review our Phase-1 client portal specification doc?',
        },
        createdAt: '2026-10-29T18:30:00Z',
      },
      {
        id: 'm-cp3-2',
        senderUserId: 'user-pro-3',
        text: {
          fa: 'بله کامل بررسی کردم. معماری پیشنهادی در ۴ اسپرینت دو هفته‌ای قابل تحویل است.',
          en: 'Reviewed thoroughly—we can ship cleanly across four 2-week sprints.',
        },
        createdAt: '2026-10-29T19:50:00Z',
      },
    ],
  },

  // 4) Received by Demo Provider (Arian Radmehr, pro-1) from Customer Mahsa Sharifi
  {
    id: 'conv-mahsa-pro1',
    threadKind: 'service_inquiry',
    initiatorUserId: 'cust-mahsa',
    initiatorProId: null,
    initiatorRole: 'customer',
    initiatorName: { fa: 'مهسا شریفی', en: 'Mahsa Sharifi' },
    initiatorTitle: { fa: 'مدیر کلینیک سلامت (کارفرما)', en: 'Clinic Director (Customer)' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-demo',
    recipientProId: 'pro-1',
    recipientName: { fa: 'آرین رادمهر', en: 'Arian Radmehr' },
    recipientTitle: { fa: 'مهندس ارشد تهویه مطبوع و VRF', en: 'Master HVAC Engineer' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    online: true,
    unreadByInitiator: 0,
    unreadByRecipient: 2,
    serviceTitle: {
      fa: 'سرویس دوره‌ای سیستم VRF کلینیک جردن',
      en: 'Seasonal VRF Maintenance — Jordan Clinic',
    },
    updatedAt: '2026-10-30T12:10:00Z',
    messages: [
      {
        id: 'm-mp1-1',
        senderUserId: 'cust-mahsa',
        text: {
          fa: 'سلام وقت بخیر مهندس رادمهر، برای سرویس فصلی ۴ یونیت VRF کلینیک در خیابان جردن نیاز به بازدید و پیش‌فاکتور داریم.',
          en: 'Hello Arian, we need seasonal servicing and a formal quote for 4 VRF units at our clinic on Jordan Ave.',
        },
        createdAt: '2026-10-30T12:04:00Z',
      },
      {
        id: 'm-mp1-2',
        senderUserId: 'cust-mahsa',
        text: {
          fa: 'آیا پنج‌شنبه صبح امکان حضور دارید که کلینیک خلوت‌تر است؟',
          en: 'Would Thursday morning work for you while patient traffic is lighter?',
        },
        createdAt: '2026-10-30T12:10:00Z',
      },
    ],
  },

  // 5) Received by Demo Provider (Arian Radmehr, pro-1) from Customer Amirhossein Tavakoli
  {
    id: 'conv-amir-pro1',
    threadKind: 'service_inquiry',
    initiatorUserId: 'cust-amir',
    initiatorProId: null,
    initiatorRole: 'customer',
    initiatorName: { fa: 'امیرحسین توکلی', en: 'Amirhossein Tavakoli' },
    initiatorTitle: { fa: 'کارفرمای مسکونی', en: 'Homeowner (Customer)' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-demo',
    recipientProId: 'pro-1',
    recipientName: { fa: 'آرین رادمهر', en: 'Arian Radmehr' },
    recipientTitle: { fa: 'مهندس ارشد تهویه مطبوع و VRF', en: 'Master HVAC Engineer' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    online: false,
    unreadByInitiator: 0,
    unreadByRecipient: 0,
    serviceTitle: {
      fa: 'تعمیر تخصصی برد اینورتر کولر گازی',
      en: 'Inverter Compressor PCB Repair',
    },
    updatedAt: '2026-10-29T16:40:00Z',
    messages: [
      {
        id: 'm-ap1-1',
        senderUserId: 'cust-amir',
        text: {
          fa: 'سلام مهندس، ممنون بابت تعمیر برد اینورتر دیروز. دستگاه بدون کوچک‌ترین صدا کار می‌کند.',
          en: 'Hi Arian, thank you for repairing the inverter PCB yesterday—the unit is running whisper-quiet now.',
        },
        createdAt: '2026-10-29T16:20:00Z',
      },
      {
        id: 'm-ap1-2',
        senderUserId: 'user-pro-demo',
        text: {
          fa: 'ارادتمندم آقای توکلی، خوشحالم که مشکل کامل برطرف شد. گارانتی ۶ ماهه تعمیر برد برایتان فعال است.',
          en: 'My pleasure Amirhossein! Glad it is running smoothly—your 6-month PCB repair warranty is active.',
        },
        createdAt: '2026-10-29T16:40:00Z',
      },
    ],
  },

  // 6) SENT BY Demo Provider (Arian Radmehr) TO Another Provider (Keyvan Bahrami, pro-3)
  {
    id: 'conv-pro1-to-pro3',
    threadKind: 'direct_message',
    initiatorUserId: 'user-pro-demo',
    initiatorProId: 'pro-1',
    initiatorRole: 'professional',
    initiatorName: { fa: 'آرین رادمهر', en: 'Arian Radmehr' },
    initiatorTitle: { fa: 'مهندس ارشد تهویه مطبوع و VRF', en: 'Master HVAC Engineer' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-3',
    recipientProId: 'pro-3',
    recipientName: { fa: 'کیوان بهرامی', en: 'Keyvan Bahrami' },
    recipientTitle: { fa: 'مهندس فول‌استک و معمار سامانه', en: 'Senior Full-Stack Architect' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    online: true,
    unreadByInitiator: 1,
    unreadByRecipient: 0,
    serviceTitle: {
      fa: 'طراحی پنل مانیتورینگ سنسورهای موتورخانه هوشمند',
      en: 'Smart Chiller Room IoT Dashboard',
    },
    updatedAt: '2026-10-30T10:35:00Z',
    messages: [
      {
        id: 'm-pp3-1',
        senderUserId: 'user-pro-demo',
        text: {
          fa: 'سلام مهندس بهرامی، آگهی طراحی سامانه شما را دیدم. برای یکی از پروژه‌های برج اداری نیاز به پنل مانیتورینگ لحظه‌ای سنسورهای چیلر دارم. شرایط همکاری چطور است؟',
          en: 'Hi Keyvan, I saw your web engineering listing and would like to connect regarding a live chiller room sensor dashboard for a commercial tower.',
        },
        createdAt: '2026-10-30T09:50:00Z',
      },
      {
        id: 'm-pp3-2',
        senderUserId: 'user-pro-3',
        text: {
          fa: 'سلام مهندس رادمهر عزیز! بله حتماً، قبلاً با پروتکل‌های MQTT و Modbus کار کرده‌ام. مشخصات سنسورها را بفرستید تا جزئیات را هماهنگ کنیم.',
          en: 'Hi Arian! Absolutely—I have built real-time MQTT/Modbus dashboards before. Send over the sensor specs and we can coordinate right away.',
        },
        createdAt: '2026-10-30T10:35:00Z',
      },
    ],
  },

  // 7) SENT BY Demo Provider (Arian Radmehr) TO Another Provider (Sara Kazeminia, pro-2)
  {
    id: 'conv-pro1-to-pro2',
    threadKind: 'direct_message',
    initiatorUserId: 'user-pro-demo',
    initiatorProId: 'pro-1',
    initiatorRole: 'professional',
    initiatorName: { fa: 'آرین رادمهر', en: 'Arian Radmehr' },
    initiatorTitle: { fa: 'مهندس ارشد تهویه مطبوع و VRF', en: 'Master HVAC Engineer' },
    initiatorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    recipientUserId: 'user-pro-2',
    recipientProId: 'pro-2',
    recipientName: { fa: 'سارا کاظمی‌نیا', en: 'Sara Kazeminia' },
    recipientTitle: { fa: 'معمار ارشد و طراح داخلی', en: 'Principal Interior Architect' },
    recipientAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    online: true,
    unreadByInitiator: 0,
    unreadByRecipient: 0,
    serviceTitle: {
      fa: 'هماهنگی جانمایی دریچه‌های خطی سقف کاذب پنت‌هاوس',
      en: 'Linear Slot Diffuser Ceiling Coordination',
    },
    updatedAt: '2026-10-28T17:15:00Z',
    messages: [
      {
        id: 'm-pp2-1',
        senderUserId: 'user-pro-demo',
        text: {
          fa: 'سلام خانم مهندس کاظمی‌نیا، نقشه اجرایی کانال‌های خطی پروژه الهیه را برایتان فرستادم تا با طراحی سقف کاذب هماهنگ باشد.',
          en: 'Hello Sara, sharing our linear slot diffuser CAD layout for the Elahieh penthouse so it aligns cleanly with your ceiling recess details.',
        },
        createdAt: '2026-10-28T16:45:00Z',
      },
      {
        id: 'm-pp2-2',
        senderUserId: 'user-pro-2',
        text: {
          fa: 'سپاسگزارم مهندس رادمهر، ابعاد بسیار دقیق بود و در پلان نهایی لحاظ شد.',
          en: 'Thank you Arian! The clearances match our cove lighting profile—integrated into the final reflected ceiling plan.',
        },
        createdAt: '2026-10-28T17:15:00Z',
      },
    ],
  },
];
