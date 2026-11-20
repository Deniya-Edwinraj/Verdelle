// Business details below are realistic demo values — replace with the client's real details before launch.
export const SITE = {
  name: 'Verdelle',
  tagline: 'Bringing nature home, one plant at a time.',
  email: 'hello@verdelle.com',
  phone: '+1 (555) 014-2368',
  address: '214 Fernwood Lane, Portland, OR 97205, United States',
  hours: 'Mon–Fri 9am–5pm · Sat 10am–2pm',
  instagramHandle: '@verdelle',
  // Add real profile URLs to enable these links. Empty = shows a "coming soon" note.
  social: { instagram: '', facebook: '', pinterest: '', youtube: '' },

  // One currency setting used everywhere (listing, product, cart, checkout).
  currency: { code: 'USD', locale: 'en-US' },

  // Spring into Green promotion (demo). Applied to products flagged `onSale`.
  saleDiscount: 0.25,
  saleName: 'Spring into Green',

  freeShippingThreshold: 75,
  // Plant guarantee: damaged on arrival or fails to settle in within this many days of delivery.
  guaranteeDays: 30,
  giftWrap: { price: 4.95, label: 'Gift wrap & handwritten note' },
  shipping: {
    standard: { label: 'Standard delivery (3–5 business days)', price: 7.95 },
    express: { label: 'Express delivery (1–2 business days)', price: 16.95 },
  },
  // Demo coupons — validate server-side in production.
  coupons: {
    GREEN10: { type: 'percent', value: 10, label: '10% off your order' },
    WELCOME5: { type: 'fixed', value: 5, label: '$5 off your order' },
  },
};

export const SHOP_MENU = [
  { label: 'All Plants', to: '/shop', icon: 'leaf', desc: 'Browse the full collection' },
  { label: 'Plant Finder', to: '/plant-finder', icon: 'compass', desc: 'Find your perfect match in 4 questions' },
  { label: 'Compare Plants', to: '/compare', icon: 'scale', desc: 'See plants side by side' },
  { label: 'New Arrivals', to: '/shop/new-arrivals', icon: 'sparkles', desc: 'Fresh from the greenhouse' },
  { label: 'Easy-Care', to: '/shop/easy-care', icon: 'sprout', desc: 'Forgiving plants for beginners' },
  { label: 'Low-Light', to: '/shop/low-light', icon: 'moon', desc: 'Happy in dimmer rooms' },
  { label: 'Pet-Friendly', to: '/shop/pet-friendly', icon: 'paw', desc: 'Non-toxic to cats and dogs' },
  { label: 'Pots & Planters', to: '/shop/pots-and-planters', icon: 'pot', desc: 'Planters, pots and saucers' },
];

export const CARE_MENU = [
  { label: 'Care Guides', to: '/plant-care', icon: 'book', desc: 'Every guide in one place' },
  { label: 'Watering', to: '/plant-care?topic=Watering', icon: 'drop', desc: 'How much and how often' },
  { label: 'Lighting', to: '/plant-care?topic=Lighting', icon: 'sun', desc: 'Find the right spot' },
  { label: 'Common Problems', to: '/plant-care?topic=Problems', icon: 'alert', desc: 'Yellow leaves, pests and more' },
  { label: 'Plant Doctor', to: '/plant-doctor', icon: 'stethoscope', desc: 'Diagnose a problem or ask an expert' },
  { label: 'Plant Styling', to: '/plant-styling', icon: 'sofa', desc: 'Free styling advice for your space' },
  { label: 'Free Care Course', to: '/care-course', icon: 'graduation', desc: '5 days to confident plant care' },
];

export const GIFT_MENU = [
  { label: 'Gift Shop', to: '/gifts', icon: 'gift', desc: 'Plants for every occasion' },
  { label: 'Gift Cards', to: '/gift-cards', icon: 'card', desc: 'Let them choose — emailed instantly' },
  { label: 'Plant Subscription', to: '/subscription', icon: 'repeat', desc: 'A new plant delivered on repeat' },
  { label: 'Verdelle Leaves', to: '/rewards', icon: 'leaf', desc: 'Earn rewards on every order' },
];

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/shop', menu: SHOP_MENU, heading: 'Shop by category', cta: 'View all plants' },
  { label: 'Plant Care', to: '/plant-care', menu: CARE_MENU, heading: 'Plant care & services', cta: 'Browse all guides' },
  { label: 'Gifts', to: '/gifts', menu: GIFT_MENU, heading: 'Gifts & extras', cta: 'Visit the gift shop' },
  { label: 'Contact', to: '/contact' },
];
