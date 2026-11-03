import type { Product, ShopSettings } from '../core/models';

/**
 * All shop content lives here. Edit this file to change products or settings.
 * - price is in Saudi Riyals
 * - images are files in frontend/public (e.g. /products/cartoon-1.jpg); the first one is the cover
 * - set isAvailable: false to hide a product
 */
export const SETTINGS: ShopSettings = {
  profileXUsername: 'RSR_121',
  xUsername: 'Paihs',
  xUserId: '1350830939358842881',
  orderMessage: 'مرحباً، أرغب في طلب {product} بسعر {price} ريال.',
  seoTitle: 'الكوين عمتك',
  seoDescription: 'شرابات ناعمة ومرحة — الطلب عبر الخاص في تويتر.',
  logoUrl: '/logo.jpg',
};

export const PRODUCTS: Product[] = [
  {
    id: 'shafiq',
    name: 'شراب شفيق',
    description: 'شراب على رسمة شفيق تستخدمه الكوين بكثرة وتلبسه لفترات طويلة وتوجد صور كثيرة له على أقدامها اللذيذة',
    price: 1000,
    images: [
      { url: '/products/cartoon-1.jpg', alt: 'Mint cartoon crew socks' },
      { url: '/products/cartoon-2.jpg', alt: 'Mint cartoon socks at the gym' },
      { url: '/products/cartoon-3.jpg', alt: 'Cartoon socks side view' },
    ],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    id: 'pink-crew',
    name: 'شراب وردي طويل',
    description: 'شراب وردي طويل من المحببات عند الكوين تلبسه كثير داخل وبرا النادي لفترات تتجاوز 12 ساعة متواصلة يوميا لانه يحسسها بالانوثة',
    price: 1000,
    images: [
      { url: '/products/pink-crew-1.jpg', alt: 'Blush pink crew socks' },
      { url: '/products/pink-crew-2.jpg', alt: 'Pink crew socks detail' },
      { url: '/products/pink-crew-3.jpg', alt: 'Pink socks with workout gear' },
    ],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    id: 'red-bow',
    name: 'شراب الفيونكة الحمراء',
    description: 'شراب هيلوكيتي الأبيض يتميز برائحه قوية وطابع لطيف وكيوت ، من أقدم الشرابات عند الكوين وتستهلكه من فترة طويلة',
    price: 1000,
    images: [
      { url: '/products/red-bow-1.jpg', alt: 'White ankle socks with a red bow kitty print' },
      { url: '/products/white-sport-1.jpg', alt: 'Red bow socks rolled up' },
    ],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    id: 'telegram-channel',
    name: 'الدخول للقناة الخاصة في تيليجرام',
    description: 'محتوى خاص (+18). عرض رجول تفال ديرتي بول الدخول بـ 500 ريال.',
    price: 500,
    images: [
      { url: '/products/telegram-channel.jpg', alt: 'Private Telegram channel' },
    ],
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
  },
];
