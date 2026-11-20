// Data for Verdelle's services: gift cards, subscriptions, gift occasions, Plant Doctor,
// the free care course and the Verdelle Leaves rewards programme.
// Prices and programme rules are proposals for the client to confirm.

import { products } from './products';

/* ------------------------------------------------------------------ */
/* Gift cards                                                           */
/* ------------------------------------------------------------------ */
export const GIFT_CARD_ID = 'gift-card';
export const GIFT_CARD_AMOUNTS = [25, 50, 75, 100];
export const GIFT_CARD_VALIDITY_MONTHS = 12;
export const GIFT_CARD_DESIGNS = [
  { key: 'forest', label: 'Forest', from: '#0B2418', to: '#2F6245', ink: '#FFFFFF' },
  { key: 'sage', label: 'Sage', from: '#8FA88F', to: '#DDE8DC', ink: '#0B2418' },
  { key: 'terracotta', label: 'Terracotta', from: '#B5663F', to: '#E9C2A6', ink: '#FFFFFF' },
];

/** A cart-compatible "product" for a gift card of a given amount. */
export function giftCardProduct(amount, design = 'forest') {
  const label = `$${amount}`;
  return {
    id: GIFT_CARD_ID,
    slug: GIFT_CARD_ID,
    type: 'giftcard',
    name: 'Verdelle Gift Card',
    botanical: 'Digital gift card',
    plantType: 'Gift card',
    design,
    amount,
    art: { species: 'none', pot: 'none' },
    sizes: [{ label, detail: `Emailed · valid ${GIFT_CARD_VALIDITY_MONTHS} months`, price: amount, regular: amount }],
    potOptions: [],
    stock: 'in-stock',
    price: amount,
    imageAlt: `Verdelle gift card worth $${amount}`,
  };
}

/* ------------------------------------------------------------------ */
/* Plant subscription                                                   */
/* ------------------------------------------------------------------ */
export const SUBSCRIPTION_PLANS = [
  {
    key: 'easy-care',
    name: 'Easy-Care Club',
    blurb: 'Forgiving, beginner-friendly plants that thrive on a little neglect.',
    price: 39,
    includes: ['One easy-care plant (17 cm pot)', 'Matching ceramic planter', 'Printed care card'],
    sample: ['zz-plant', 'pothos', 'snake-plant'],
  },
  {
    key: 'pet-friendly',
    name: 'Pet-Friendly Club',
    blurb: 'Plants listed as non-toxic to cats and dogs — peace of mind for pet parents.',
    price: 39,
    includes: ['One pet-friendly plant (17 cm pot)', 'Matching ceramic planter', 'Printed care card'],
    sample: ['calathea', 'spider-plant', 'peperomia'],
    popular: true,
  },
  {
    key: 'statement',
    name: 'Statement Club',
    blurb: 'Bigger, bolder plants that become the focal point of a room.',
    price: 69,
    includes: ['One large statement plant (24 cm pot)', 'Premium planter', 'Printed care card + styling tips'],
    sample: ['monstera-deliciosa', 'bird-of-paradise', 'ficus-lyrata'],
  },
];
export const SUBSCRIPTION_FREQUENCIES = [
  { key: 'monthly', label: 'Every month', discount: 0 },
  { key: 'bimonthly', label: 'Every 2 months', discount: 0 },
  { key: 'quarterly', label: 'Every 3 months', discount: 0.1, note: 'Save 10%' },
];
export const planPrice = (plan, freq) => +(plan.price * (1 - (SUBSCRIPTION_FREQUENCIES.find((f) => f.key === freq)?.discount || 0))).toFixed(2);

/* ------------------------------------------------------------------ */
/* Gift occasions                                                        */
/* ------------------------------------------------------------------ */
const bySlug = (slugs) => slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
export const OCCASIONS = [
  { key: 'housewarming', label: 'Housewarming', icon: 'home', blurb: 'Easy, elegant plants to make a new place feel like home.', picks: bySlug(['zz-plant', 'monstera-deliciosa', 'snake-plant', 'pothos', 'rubber-plant', 'ceramic-planter']) },
  { key: 'birthday', label: 'Birthday', icon: 'cake', blurb: 'Colourful, joyful picks for a gift that keeps on growing.', picks: bySlug(['anthurium', 'caladium', 'peace-lily', 'calathea', 'string-of-pearls', 'jade-plant']) },
  { key: 'thank-you', label: 'Thank you', icon: 'heart', blurb: 'Small, thoughtful plants that say it better than words.', picks: bySlug(['peperomia', 'aloe-vera', 'jade-plant', 'syngonium', 'spider-plant', 'terracotta-pot-set']) },
  { key: 'sympathy', label: 'Sympathy', icon: 'flower', blurb: 'Calm, graceful plants to offer comfort and care.', picks: bySlug(['peace-lily', 'chinese-evergreen', 'dracaena', 'boston-fern', 'philodendron', 'snake-plant']) },
  { key: 'pet-lovers', label: 'For pet lovers', icon: 'paw', blurb: 'Plants listed as non-toxic to cats and dogs.', picks: products.filter((p) => p.pet === 'safe').slice(0, 6) },
  { key: 'office', label: 'Office & corporate', icon: 'briefcase', blurb: 'Low-maintenance desk and floor plants for clients and teams.', picks: bySlug(['zz-plant', 'snake-plant', 'areca-palm', 'peperomia', 'dracaena', 'chinese-evergreen']) },
];

/* ------------------------------------------------------------------ */
/* Plant Doctor                                                          */
/* ------------------------------------------------------------------ */
export const SYMPTOMS = [
  {
    key: 'yellow',
    label: 'Yellow leaves',
    causes: [
      ['Overwatering', 'The most common cause. Soil that stays wet starves roots of air.', 'Let the top few centimetres dry out before watering, and empty saucers after 15–30 minutes.'],
      ['Natural ageing', 'One or two old lower leaves yellowing is normal.', 'Snip them off at the base — nothing else needed.'],
      ['Too little light', 'Leaves far from the window yellow and drop.', 'Move the plant closer to a bright window, out of harsh direct sun.'],
    ],
    guide: 'yellow-leaves',
  },
  {
    key: 'brown-tips',
    label: 'Brown, crispy tips',
    causes: [
      ['Low humidity', 'Dry air from heating or air-conditioning dries leaf edges.', 'Group plants together or use a pebble tray; keep away from radiators and vents.'],
      ['Underwatering', 'Soil drying out completely between drinks.', 'Water thoroughly when the top few centimetres are dry, until it runs from the drainage hole.'],
      ['Mineral build-up', 'Salts from tap water or too much fertiliser.', 'Flush the soil with plenty of water and feed less often.'],
    ],
    guide: 'watering-frequency',
  },
  {
    key: 'drooping',
    label: 'Drooping or wilting',
    causes: [
      ['Thirsty', 'Dry soil and limp leaves — common with peace lilies.', 'Water thoroughly; most plants perk up within hours.'],
      ['Root rot', 'Wet soil but still wilting, sometimes with a sour smell.', 'Remove from the pot, trim soft brown roots and repot in fresh, free-draining mix.'],
      ['Transplant or travel stress', 'Normal for a week or two after delivery or repotting.', 'Keep it in bright, indirect light and avoid moving it again.'],
    ],
    guide: 'root-rot-basics',
  },
  {
    key: 'spots',
    label: 'Brown or black spots',
    causes: [
      ['Sunburn', 'Pale or brown patches on leaves facing a sunny window.', 'Move out of direct afternoon sun or filter it with a sheer curtain.'],
      ['Fungal leaf spot', 'Spots with yellow halos, often after water sits on leaves.', 'Remove affected leaves, water the soil not the foliage, and improve airflow.'],
    ],
    guide: 'direct-vs-indirect-light',
  },
  {
    key: 'pests',
    label: 'Bugs or sticky leaves',
    causes: [
      ['Fungus gnats', 'Tiny flies around the soil — a sign it stays too damp.', 'Let the soil dry out more between waterings and use yellow sticky traps.'],
      ['Spider mites', 'Fine webbing and speckled leaves, often in dry air.', 'Wipe leaves, shower the plant and raise humidity; isolate it from others.'],
      ['Mealybugs or scale', 'White fluffy spots or brown bumps, sticky residue.', 'Dab with a cotton bud dipped in rubbing alcohol; repeat weekly.'],
    ],
    guide: 'pest-prevention',
  },
  {
    key: 'leggy',
    label: 'Leggy or slow growth',
    causes: [
      ['Not enough light', 'Long gaps between leaves, stretching towards the window.', 'Give it a brighter spot and rotate it every few weeks.'],
      ['Needs feeding', 'Pale new growth in spring and summer.', 'Feed with a diluted liquid fertiliser monthly during the growing season.'],
      ['Root-bound', 'Roots circling the pot or growing out of the drainage hole.', 'Repot into a pot 2–5 cm wider in spring.'],
    ],
    guide: 'drainage-and-repotting',
  },
];

/* ------------------------------------------------------------------ */
/* Free 5-day care course                                               */
/* ------------------------------------------------------------------ */
export const COURSE_DAYS = [
  ['Welcome home', 'Unboxing, the first 48 hours and how to help a new plant settle in.'],
  ['Reading the light', 'How to judge the light in every room — and which plants love it.'],
  ['Watering without worry', 'The finger test, drainage and the #1 mistake new plant parents make.'],
  ['Spotting trouble early', 'What yellow leaves, brown tips and drooping are really telling you.'],
  ['Growing your jungle', 'Feeding, repotting and propagating — plus your graduation gift.'],
];

/* ------------------------------------------------------------------ */
/* Verdelle Leaves rewards                                              */
/* ------------------------------------------------------------------ */
export const REWARDS = {
  name: 'Verdelle Leaves',
  perDollar: 1, // leaves earned per $1 spent
  welcome: 50, // leaves for joining
  redeem: [
    { leaves: 100, value: 5 },
    { leaves: 200, value: 12 },
    { leaves: 400, value: 30 },
  ],
  tiers: [
    { key: 'seedling', name: 'Seedling', min: 0, perks: ['1 leaf for every $1 spent', '50 welcome leaves', 'Birthday surprise'] },
    { key: 'sprout', name: 'Sprout', min: 250, perks: ['Everything in Seedling', 'Free express upgrade twice a year', 'Early access to new arrivals'] },
    { key: 'evergreen', name: 'Evergreen', min: 750, perks: ['Everything in Sprout', 'Free gift wrap on every order', 'A free plant every year'] },
  ],
};

/** Reward codes created when members redeem leaves (read by the cart). */
export function readRewardCodes() {
  try {
    return JSON.parse(window.localStorage.getItem('gn_reward_codes') || '[]');
  } catch {
    return [];
  }
}
