// Mock catalogue — kept separate from UI so an API can replace it later.
// Prices are USD demo prices. Sale items use the site-wide "Spring into Green" 25% discount,
// computed from each size's regular price so listing, product page, cart and checkout always agree.
// Pet safety follows ASPCA toxic/non-toxic listings; it is general guidance, not veterinary advice.

import { SITE } from './site';

const POT_OPTIONS = [
  { label: 'Nursery grow pot', price: 0 },
  { label: 'Matte ceramic planter', price: 14 },
  { label: 'Terracotta planter', price: 8 },
];

const sizes = (s, m, l) =>
  [
    s && { label: 'Small', detail: '12 cm pot · 20–30 cm tall', price: s },
    m && { label: 'Medium', detail: '17 cm pot · 40–60 cm tall', price: m },
    l && { label: 'Large', detail: '24 cm pot · 80–120 cm tall', price: l },
  ].filter(Boolean);

const round = (n) => Math.round(n * 100) / 100;

function make(p) {
  const discount = p.onSale ? SITE.saleDiscount : 0;
  const sizeList = p.sizes.map((s) => ({ ...s, regular: s.price, price: round(s.price * (1 - discount)) }));
  return {
    type: 'plant',
    potOptions: p.type === 'planter' ? [] : POT_OPTIONS,
    images: [{ view: 'front' }, { view: 'room' }, { view: 'detail' }, { view: 'pot' }],
    imageAlt: `${p.name} (${p.botanical}) in a ${p.art.pot} pot`,
    shipping: 'Ships in a recyclable, padded box with the soil secured — usually dispatched within 1–2 business days.',
    reviewCount: 0,
    ...p,
    sizes: sizeList,
    price: sizeList[0].price,
    originalPrice: discount ? sizeList[0].regular : null,
    discount,
  };
}

export const PLANT_TYPES = ['Foliage', 'Flowering', 'Trailing', 'Palms & Trees', 'Succulents', 'Ferns', 'Pots & Planters'];
export const LIGHT = ['Low', 'Medium', 'Bright indirect', 'Direct'];
export const WATERING = ['Weekly', 'Every 1–2 weeks', 'Every 2–3 weeks', 'Every 3–4 weeks'];
export const DIFFICULTY = ['Easy', 'Moderate', 'Advanced'];
export const SIZES = ['Small', 'Medium', 'Large'];

export const PET = {
  safe: { label: 'Pet-friendly', detail: 'Listed as non-toxic to cats and dogs by the ASPCA. Still discourage nibbling.', tone: 'safe' },
  toxic: { label: 'Toxic to pets', detail: 'Listed as toxic to cats and dogs by the ASPCA. Keep out of reach of pets and children.', tone: 'toxic' },
  unknown: { label: 'Pet safety: check before purchasing', detail: 'We don’t have confirmed toxicity data. Please check with your vet before purchasing.', tone: 'unknown' },
  na: { label: 'Not a plant', detail: 'Ceramic planter — no plant included.', tone: 'unknown' },
};

export const products = [
  make({
    id: 'gn-001', slug: 'philodendron', name: 'Philodendron', botanical: 'Philodendron spp.', plantType: 'Foliage',
    art: { species: 'philodendron', pot: 'white' },
    description: 'Big, glossy heart-shaped leaves that bring instant jungle energy. A forgiving plant that tells you when it’s thirsty with a gentle droop.',
    growth: 'Upright and bushy; new leaves unfurl from the centre.', matureSize: 'Up to 90 cm tall indoors',
    sizes: sizes(28, 44, 64), onSale: true, rating: 4.8, reviewCount: 214,
    light: ['Medium', 'Bright indirect'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['low-maintenance-greens', 'statement-floor-plants'], careGuide: 'beginners-indoor-plant-care', popularity: 96, createdAt: '2026-03-02',
  }),
  make({
    id: 'gn-002', slug: 'peace-lily', name: 'Peace Lily', botanical: 'Spathiphyllum wallisii', plantType: 'Flowering',
    art: { species: 'peace-lily', pot: 'basket' },
    description: 'Elegant dark leaves and pure white blooms. Tolerates lower light and droops dramatically when dry — then perks right back up after a drink.',
    growth: 'Clumping, with blooms on tall stems.', matureSize: '40–65 cm tall',
    sizes: sizes(28, 36), onSale: true, rating: 4.7, reviewCount: 188,
    light: ['Low', 'Medium'], watering: 'Weekly', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'toxic',
    flowering: true, stock: 'in-stock', bestSeller: true, isNew: false, collections: ['low-light-plants', 'air-purifying-favorites', 'flowering-plants'], careGuide: 'watering-frequency', popularity: 92, createdAt: '2026-02-11',
  }),
  make({
    id: 'gn-003', slug: 'caladium', name: 'Caladium', botanical: 'Caladium bicolor', plantType: 'Foliage',
    art: { species: 'caladium', pot: 'white' },
    description: 'Paper-thin, painterly leaves in white and green. A seasonal showstopper that loves warmth, humidity and bright, filtered light.',
    growth: 'Grows from a tuber; may go dormant in winter.', matureSize: '30–45 cm tall',
    sizes: sizes(28, 36), onSale: true, rating: 4.5, reviewCount: 74,
    light: ['Bright indirect'], watering: 'Weekly', humidity: 'High', temperature: '21–29°C (70–85°F)', difficulty: 'Advanced', pet: 'toxic',
    stock: 'low-stock', bestSeller: false, isNew: true, collections: ['desk-plants'], careGuide: 'direct-vs-indirect-light', popularity: 70, createdAt: '2026-09-20',
  }),
  make({
    id: 'gn-004', slug: 'zz-plant', name: 'ZZ Plant', botanical: 'Zamioculcas zamiifolia', plantType: 'Foliage',
    art: { species: 'zz', pot: 'terracotta' },
    description: 'Waxy, upright stems that shrug off low light and missed waterings. The plant we recommend most to first-time plant parents.',
    growth: 'Slow-growing, upright stems from underground rhizomes.', matureSize: '60–90 cm tall',
    sizes: sizes(28, 44, 64), onSale: true, rating: 4.9, reviewCount: 302,
    light: ['Low', 'Medium', 'Bright indirect'], watering: 'Every 2–3 weeks', humidity: 'Low', temperature: '16–27°C (60–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['low-maintenance-greens', 'low-light-plants', 'desk-plants'], careGuide: 'beginners-indoor-plant-care', popularity: 99, createdAt: '2026-01-14',
  }),
  make({
    id: 'gn-005', slug: 'ficus-lyrata', name: 'Ficus Lyrata', botanical: 'Ficus lyrata (Fiddle-leaf fig)', plantType: 'Palms & Trees',
    art: { species: 'fiddle', pot: 'white' },
    description: 'The statement tree of interior design, with large violin-shaped leaves. Happiest in one bright spot it doesn’t have to move from.',
    growth: 'Tree-like; can be pruned to branch.', matureSize: '1.2–1.8 m indoors',
    sizes: sizes(null, 52, 120), onSale: true, rating: 4.4, reviewCount: 156,
    light: ['Bright indirect', 'Direct'], watering: 'Weekly', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Advanced', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['statement-floor-plants', 'garden-ready-plants'], careGuide: 'direct-vs-indirect-light', popularity: 88, createdAt: '2026-02-20',
  }),
  make({
    id: 'gn-006', slug: 'anthurium', name: 'Anthurium', botanical: 'Anthurium andraeanum', plantType: 'Flowering',
    art: { species: 'anthurium', pot: 'white' },
    description: 'Long-lasting, glossy red blooms framed by deep green leaves. Flowers on and off all year with bright, indirect light.',
    growth: 'Clumping; blooms last for weeks.', matureSize: '30–50 cm tall',
    sizes: sizes(28, 44), onSale: true, rating: 4.6, reviewCount: 121,
    light: ['Bright indirect'], watering: 'Weekly', humidity: 'High', temperature: '18–29°C (65–85°F)', difficulty: 'Moderate', pet: 'toxic',
    flowering: true, stock: 'in-stock', bestSeller: false, isNew: false, collections: ['flowering-plants', 'desk-plants'], careGuide: 'fertilizer-basics', popularity: 81, createdAt: '2026-04-03',
  }),
  make({
    id: 'gn-007', slug: 'pothos', name: 'Pothos', botanical: 'Epipremnum aureum', plantType: 'Trailing',
    art: { species: 'pothos', pot: 'concrete' },
    description: 'Marbled, heart-shaped leaves on fast-growing vines. Let it trail from a shelf or train it up a pole — it’s happy almost anywhere.',
    growth: 'Fast-growing trailing vines.', matureSize: 'Vines 1–3 m long',
    sizes: sizes(24, 32), onSale: true, rating: 4.9, reviewCount: 341,
    light: ['Low', 'Medium', 'Bright indirect'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '16–29°C (60–85°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['low-maintenance-greens', 'low-light-plants', 'air-purifying-favorites'], careGuide: 'propagation', popularity: 98, createdAt: '2026-01-05',
  }),
  make({
    id: 'gn-008', slug: 'rubber-plant', name: 'Rubber Plant', botanical: 'Ficus elastica', plantType: 'Palms & Trees',
    art: { species: 'rubber', pot: 'cream' },
    description: 'Thick, glossy leaves in deep burgundy-green with rosy new growth. Grows into a striking indoor tree with very little fuss.',
    growth: 'Upright; prune the tip to encourage branching.', matureSize: '1–2 m indoors',
    sizes: sizes(28, 44, 88), onSale: true, rating: 4.7, reviewCount: 167,
    light: ['Medium', 'Bright indirect'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '16–27°C (60–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['statement-floor-plants', 'low-maintenance-greens'], careGuide: 'pruning', popularity: 84, createdAt: '2026-03-18',
  }),
  make({
    id: 'gn-009', slug: 'monstera-deliciosa', name: 'Monstera Deliciosa', botanical: 'Monstera deliciosa', plantType: 'Foliage',
    art: { species: 'monstera', pot: 'terracotta' },
    description: 'The iconic Swiss cheese plant. Mature leaves develop dramatic splits and holes; give it room to spread and something to climb.',
    growth: 'Climbing; benefits from a moss pole.', matureSize: '1–2 m indoors',
    sizes: sizes(34, 54, 89), rating: 4.8, reviewCount: 276,
    light: ['Medium', 'Bright indirect'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '18–29°C (65–85°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['statement-floor-plants', 'garden-ready-plants'], careGuide: 'drainage-and-repotting', popularity: 97, createdAt: '2026-02-01',
  }),
  make({
    id: 'gn-010', slug: 'snake-plant', name: 'Snake Plant', botanical: 'Dracaena trifasciata', plantType: 'Succulents',
    art: { species: 'snake', pot: 'basket' },
    description: 'Architectural, sword-like leaves edged in gold. Thrives on neglect and handles low light — just don’t overwater it.',
    growth: 'Slow, upright clumps.', matureSize: '60–100 cm tall',
    sizes: sizes(26, 39, 68), rating: 4.9, reviewCount: 289,
    light: ['Low', 'Medium', 'Bright indirect'], watering: 'Every 3–4 weeks', humidity: 'Low', temperature: '15–29°C (60–85°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: true, isNew: false, collections: ['low-maintenance-greens', 'low-light-plants', 'air-purifying-favorites'], careGuide: 'root-rot-basics', popularity: 95, createdAt: '2026-01-22',
  }),
  make({
    id: 'gn-011', slug: 'spider-plant', name: 'Spider Plant', botanical: 'Chlorophytum comosum', plantType: 'Foliage',
    art: { species: 'spider', pot: 'white' },
    description: 'Arching striped leaves and baby “spiderettes” you can pot up and share. Cheerful, fast-growing and pet-friendly.',
    growth: 'Arching rosettes with trailing runners.', matureSize: '30–60 cm wide',
    sizes: sizes(18, 26), rating: 4.8, reviewCount: 198,
    light: ['Medium', 'Bright indirect'], watering: 'Weekly', humidity: 'Average', temperature: '13–27°C (55–80°F)', difficulty: 'Easy', pet: 'safe',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['air-purifying-favorites', 'desk-plants', 'low-maintenance-greens'], careGuide: 'propagation', popularity: 86, createdAt: '2026-03-28',
  }),
  make({
    id: 'gn-012', slug: 'areca-palm', name: 'Areca Palm', botanical: 'Dypsis lutescens', plantType: 'Palms & Trees',
    art: { species: 'areca', pot: 'cream' },
    description: 'Feathery, golden-green fronds that soften any corner. A pet-friendly palm that loves bright, filtered light.',
    growth: 'Multi-stemmed clumps of arching fronds.', matureSize: '1.2–2 m indoors',
    sizes: sizes(null, 48, 95), rating: 4.6, reviewCount: 112,
    light: ['Bright indirect'], watering: 'Weekly', humidity: 'High', temperature: '18–27°C (65–80°F)', difficulty: 'Moderate', pet: 'safe',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['statement-floor-plants', 'air-purifying-favorites', 'garden-ready-plants'], careGuide: 'direct-vs-indirect-light', popularity: 79, createdAt: '2026-04-12',
  }),
  make({
    id: 'gn-013', slug: 'bird-of-paradise', name: 'Bird of Paradise', botanical: 'Strelitzia nicolai', plantType: 'Palms & Trees',
    art: { species: 'bird-of-paradise', pot: 'forest' },
    description: 'Huge paddle-shaped leaves on tall stems for an instant tropical statement. Natural leaf splits are normal and part of its charm.',
    growth: 'Upright clumps; leaves split naturally.', matureSize: '1.5–2 m indoors',
    sizes: sizes(null, 62, 130), rating: 4.7, reviewCount: 93,
    light: ['Bright indirect', 'Direct'], watering: 'Weekly', humidity: 'Average', temperature: '18–29°C (65–85°F)', difficulty: 'Moderate', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: true, collections: ['statement-floor-plants', 'garden-ready-plants'], careGuide: 'direct-vs-indirect-light', popularity: 77, createdAt: '2026-09-05',
  }),
  make({
    id: 'gn-014', slug: 'chinese-evergreen', name: 'Chinese Evergreen', botanical: 'Aglaonema spp.', plantType: 'Foliage',
    art: { species: 'chinese-evergreen', pot: 'black' },
    description: 'Silvery, blush-veined leaves that brighten dim rooms. One of the most tolerant low-light plants you can grow.',
    growth: 'Compact, slow-growing clumps.', matureSize: '30–60 cm tall',
    sizes: sizes(24, 38), rating: 4.7, reviewCount: 102,
    light: ['Low', 'Medium'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['low-light-plants', 'desk-plants', 'low-maintenance-greens'], careGuide: 'yellow-leaves', popularity: 74, createdAt: '2026-05-09',
  }),
  make({
    id: 'gn-015', slug: 'boston-fern', name: 'Boston Fern', botanical: 'Nephrolepis exaltata', plantType: 'Ferns',
    art: { species: 'boston-fern', pot: 'terracotta' },
    description: 'Lush, cascading fronds that love humidity — perfect for bathrooms and bright kitchens. Pet-friendly and endlessly soft.',
    growth: 'Arching fronds; great in hanging baskets.', matureSize: '40–90 cm wide',
    sizes: sizes(22, 34), rating: 4.4, reviewCount: 87,
    light: ['Medium', 'Bright indirect'], watering: 'Weekly', humidity: 'High', temperature: '16–24°C (60–75°F)', difficulty: 'Moderate', pet: 'safe',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['air-purifying-favorites', 'garden-ready-plants'], careGuide: 'watering-frequency', popularity: 68, createdAt: '2026-04-21',
  }),
  make({
    id: 'gn-016', slug: 'aloe-vera', name: 'Aloe Vera', botanical: 'Aloe barbadensis miller', plantType: 'Succulents',
    art: { species: 'aloe', pot: 'terracotta' },
    description: 'A sculptural succulent with plump, speckled leaves. Give it your sunniest windowsill and let the soil dry out between drinks.',
    growth: 'Rosette; produces pups at the base.', matureSize: '30–60 cm tall',
    sizes: sizes(16, 26), rating: 4.6, reviewCount: 134,
    light: ['Bright indirect', 'Direct'], watering: 'Every 2–3 weeks', humidity: 'Low', temperature: '13–27°C (55–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['low-maintenance-greens', 'desk-plants', 'garden-ready-plants'], careGuide: 'drainage-and-repotting', popularity: 80, createdAt: '2026-03-07',
  }),
  make({
    id: 'gn-017', slug: 'jade-plant', name: 'Jade Plant', botanical: 'Crassula ovata', plantType: 'Succulents',
    art: { species: 'jade', pot: 'concrete' },
    description: 'Woody stems and coin-shaped, fleshy leaves that can live for decades. Loves sun and dislikes wet feet.',
    growth: 'Slow-growing, tree-like succulent.', matureSize: '30–90 cm tall',
    sizes: sizes(19, 32), rating: 4.7, reviewCount: 76,
    light: ['Bright indirect', 'Direct'], watering: 'Every 2–3 weeks', humidity: 'Low', temperature: '13–24°C (55–75°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: true, collections: ['desk-plants', 'low-maintenance-greens'], careGuide: 'pruning', popularity: 66, createdAt: '2026-09-28',
  }),
  make({
    id: 'gn-018', slug: 'string-of-pearls', name: 'String of Pearls', botanical: 'Curio rowleyanus', plantType: 'Trailing',
    art: { species: 'string-of-pearls', pot: 'terracotta' },
    description: 'Cascading strands of bead-like leaves — beautiful spilling from a shelf or hanging planter. Water sparingly.',
    growth: 'Trailing strands.', matureSize: 'Strands up to 60–90 cm',
    sizes: sizes(22, 30), rating: 4.3, reviewCount: 64,
    light: ['Bright indirect'], watering: 'Every 2–3 weeks', humidity: 'Low', temperature: '16–27°C (60–80°F)', difficulty: 'Advanced', pet: 'toxic',
    stock: 'out-of-stock', bestSeller: false, isNew: true, collections: ['desk-plants'], careGuide: 'root-rot-basics', popularity: 72, createdAt: '2026-10-02',
  }),
  make({
    id: 'gn-019', slug: 'syngonium', name: 'Syngonium', botanical: 'Syngonium podophyllum', plantType: 'Foliage',
    art: { species: 'syngonium', pot: 'white' },
    description: 'Arrowhead leaves blushed in pink and mint. A quick grower that stays bushy with a little pruning.',
    growth: 'Bushy when young, climbing with age.', matureSize: '30–60 cm tall',
    sizes: sizes(20, 30), rating: 4.6, reviewCount: 58,
    light: ['Medium', 'Bright indirect'], watering: 'Weekly', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: true, collections: ['desk-plants'], careGuide: 'pruning', popularity: 63, createdAt: '2026-10-10',
  }),
  make({
    id: 'gn-020', slug: 'dracaena', name: 'Dracaena Marginata', botanical: 'Dracaena marginata', plantType: 'Palms & Trees',
    art: { species: 'dracaena', pot: 'cream' },
    description: 'Slender canes topped with fountains of fine, red-edged leaves. A tall, airy accent for bright rooms.',
    growth: 'Upright canes with leaf crowns.', matureSize: '1–1.8 m indoors',
    sizes: sizes(null, 45, 85), rating: 4.5, reviewCount: 81,
    light: ['Medium', 'Bright indirect'], watering: 'Every 2–3 weeks', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'toxic',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['statement-floor-plants', 'air-purifying-favorites'], careGuide: 'yellow-leaves', popularity: 71, createdAt: '2026-05-30',
  }),
  make({
    id: 'gn-021', slug: 'calathea', name: 'Calathea Lancifolia', botanical: 'Goeppertia insignis (Rattlesnake plant)', plantType: 'Foliage',
    art: { species: 'calathea', pot: 'sage' },
    description: 'Wavy, patterned leaves with purple undersides that fold up at night. Pet-friendly, but likes steady moisture and humidity.',
    growth: 'Clumping; leaves move with the light.', matureSize: '40–75 cm tall',
    sizes: sizes(24, 38), rating: 4.3, reviewCount: 69,
    light: ['Low', 'Medium'], watering: 'Weekly', humidity: 'High', temperature: '18–27°C (65–80°F)', difficulty: 'Advanced', pet: 'safe',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['low-light-plants', 'desk-plants'], careGuide: 'pest-prevention', popularity: 65, createdAt: '2026-06-14',
  }),
  make({
    id: 'gn-022', slug: 'peperomia', name: 'Peperomia Obtusifolia', botanical: 'Peperomia obtusifolia (Baby rubber plant)', plantType: 'Foliage',
    art: { species: 'peperomia', pot: 'black' },
    description: 'Compact and glossy with round, succulent-like leaves. A tidy, pet-friendly desk companion.',
    growth: 'Compact, mounding.', matureSize: '20–30 cm tall',
    sizes: sizes(16, 24), rating: 4.8, reviewCount: 95,
    light: ['Medium', 'Bright indirect'], watering: 'Every 1–2 weeks', humidity: 'Average', temperature: '18–27°C (65–80°F)', difficulty: 'Easy', pet: 'safe',
    stock: 'in-stock', bestSeller: false, isNew: true, collections: ['desk-plants', 'low-maintenance-greens'], careGuide: 'beginners-indoor-plant-care', popularity: 76, createdAt: '2026-09-12',
  }),
  make({
    id: 'gn-023', slug: 'ceramic-planter', name: 'Matte Ceramic Planter', botanical: 'Glazed stoneware with drainage hole', plantType: 'Pots & Planters', type: 'planter',
    art: { species: 'none', pot: 'white' },
    description: 'A minimal matte planter with a drainage hole and matching saucer. Fits our Small, Medium and Large grow pots.',
    growth: '—', matureSize: '—',
    sizes: [
      { label: 'Small', detail: 'Fits 12 cm grow pot', price: 18 },
      { label: 'Medium', detail: 'Fits 17 cm grow pot', price: 26 },
      { label: 'Large', detail: 'Fits 24 cm grow pot', price: 42 },
    ],
    rating: 4.8, reviewCount: 143,
    light: [], watering: '—', humidity: '—', temperature: '—', difficulty: 'Easy', pet: 'na',
    stock: 'in-stock', bestSeller: false, isNew: false, collections: ['pots-and-planters'], careGuide: 'drainage-and-repotting', popularity: 73, createdAt: '2026-02-26',
    shipping: 'Ships double-boxed with recycled paper padding.',
  }),
  make({
    id: 'gn-024', slug: 'terracotta-pot-set', name: 'Terracotta Pot Set', botanical: 'Unglazed clay, set of 3 with saucers', plantType: 'Pots & Planters', type: 'planter',
    art: { species: 'none', pot: 'terracotta' },
    description: 'Breathable classic terracotta that helps soil dry evenly — ideal for succulents, snake plants and anyone prone to overwatering.',
    growth: '—', matureSize: '—',
    sizes: [{ label: 'Set of 3', detail: '10, 12 and 15 cm', price: 24 }],
    rating: 4.7, reviewCount: 88,
    light: [], watering: '—', humidity: '—', temperature: '—', difficulty: 'Easy', pet: 'na',
    stock: 'in-stock', bestSeller: false, isNew: true, collections: ['pots-and-planters'], careGuide: 'drainage-and-repotting', popularity: 60, createdAt: '2026-08-30',
    shipping: 'Ships double-boxed with recycled paper padding.',
  }),
];

/* ---------------- shop categories (URL /shop/:category) ---------------- */
export const CATEGORIES = [
  { slug: 'new-arrivals', name: 'New Arrivals', blurb: 'Fresh from the greenhouse — the newest additions to the Verdelle family.', test: (p) => p.isNew },
  { slug: 'easy-care', name: 'Easy-Care', blurb: 'Forgiving, resilient plants for busy schedules and first-time plant parents.', test: (p) => p.type === 'plant' && p.difficulty === 'Easy' },
  { slug: 'low-light', name: 'Low-Light', blurb: 'Plants that tolerate dimmer rooms and north-facing windows.', test: (p) => p.light.includes('Low') },
  { slug: 'pet-friendly', name: 'Pet-Friendly', blurb: 'Plants listed as non-toxic to cats and dogs by the ASPCA.', test: (p) => p.pet === 'safe' },
  { slug: 'flowering', name: 'Flowering', blurb: 'Blooming houseplants that add colour between the greens.', test: (p) => !!p.flowering },
  { slug: 'large-plants', name: 'Large Plants', blurb: 'Statement floor plants available in our Large size.', test: (p) => p.type === 'plant' && p.sizes.some((s) => s.label === 'Large') },
  { slug: 'pots-and-planters', name: 'Pots & Planters', blurb: 'Planters, pots and saucers to give your plants a beautiful home.', test: (p) => p.type === 'planter' },
  { slug: 'sale', name: 'Spring Sale', blurb: `${Math.round(SITE.saleDiscount * 100)}% off selected indoor plants while stocks last.`, test: (p) => p.discount > 0 },
];

/* ---------------- helpers ---------------- */
export const getProduct = (slug) => products.find((p) => p.slug === slug);
export const getProductById = (id) => products.find((p) => p.id === id);
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const inCategory = (slug) => {
  const c = getCategory(slug);
  return c ? products.filter(c.test) : [];
};

export const HOME_FAVORITES = ['philodendron', 'peace-lily', 'caladium', 'zz-plant', 'ficus-lyrata', 'anthurium', 'pothos', 'rubber-plant'];

export function relatedProducts(product, n = 4) {
  return products
    .filter((p) => p.id !== product.id && p.type === product.type)
    .map((p) => ({
      p,
      score: p.collections.filter((c) => product.collections.includes(c)).length * 2 + (p.plantType === product.plantType ? 1 : 0) + (p.difficulty === product.difficulty ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.p.popularity - a.p.popularity)
    .slice(0, n)
    .map((x) => x.p);
}

export function searchProducts(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return products.filter((p) =>
    [p.name, p.botanical, p.plantType, p.difficulty, ...p.light, p.watering, PET[p.pet].label].join(' ').toLowerCase().includes(s),
  );
}

export const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export function sortProducts(list, sort) {
  const a = [...list];
  if (sort === 'newest') return a.sort((x, y) => y.createdAt.localeCompare(x.createdAt));
  if (sort === 'price-asc') return a.sort((x, y) => x.price - y.price);
  if (sort === 'price-desc') return a.sort((x, y) => y.price - x.price);
  if (sort === 'rating') return a.sort((x, y) => y.rating - x.rating || y.reviewCount - x.reviewCount);
  return a.sort((x, y) => y.popularity - x.popularity);
}
