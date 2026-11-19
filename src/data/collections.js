import { products } from './products';

export const collections = [
  {
    slug: 'low-maintenance-greens',
    name: 'Low-Maintenance Greens',
    tag: 'Easiest',
    tagline: 'Elevate your space with easy-care indoor plants.',
    description: 'Thriving, beautiful plants that forgive a missed watering and adapt to most rooms — perfect for busy lives or first-time plant parents.',
    feature: { species: 'zz', pot: 'white' },
  },
  {
    slug: 'garden-ready-plants',
    name: 'Garden-Ready Plants',
    tag: 'Outdoors',
    tagline: 'Hardy greens that can enjoy a sheltered patio in warm months.',
    description: 'Sun-loving plants that appreciate a summer holiday on a sheltered balcony or patio — bring them back indoors before nights turn cool.',
    feature: { species: 'areca', pot: 'concrete' },
  },
  {
    slug: 'air-purifying-favorites',
    name: 'Air-Purifying Favorites',
    tag: 'Popular',
    tagline: 'Leafy classics loved for fresher-feeling rooms.',
    description: 'Plants popularly associated with cleaner indoor air. Their real gift is how good they make a room feel — ventilation still matters most.',
    feature: { species: 'peace-lily', pot: 'white' },
  },
  {
    slug: 'low-light-plants',
    name: 'Low-Light Plants',
    tag: 'Shade tolerant',
    tagline: 'Green companions for dimmer corners and north-facing rooms.',
    description: 'Plants that tolerate lower light. They’ll grow more slowly away from windows, so water less often too.',
    feature: { species: 'chinese-evergreen', pot: 'black' },
  },
  {
    slug: 'statement-floor-plants',
    name: 'Statement Floor Plants',
    tag: 'Big impact',
    tagline: 'Tall, sculptural plants that anchor a room.',
    description: 'Floor-standing plants with presence — from the fiddle-leaf fig to the bird of paradise.',
    feature: { species: 'bird-of-paradise', pot: 'forest' },
  },
  {
    slug: 'flowering-plants',
    name: 'Flowering Plants',
    tag: 'Colour',
    tagline: 'Blooms that add a soft burst of colour.',
    description: 'Houseplants that flower indoors with the right light, bringing long-lasting colour between the greens.',
    feature: { species: 'anthurium', pot: 'white' },
  },
  {
    slug: 'desk-plants',
    name: 'Desk Plants',
    tag: 'Compact',
    tagline: 'Small plants for shelves, desks and bedside tables.',
    description: 'Compact plants that fit a work-from-home desk or bookshelf without taking over.',
    feature: { species: 'peperomia', pot: 'terracotta' },
  },
  {
    slug: 'pots-and-planters',
    name: 'Pots & Planters',
    tag: 'Accessories',
    tagline: 'Beautiful homes for your plants.',
    description: 'Planters and pots with proper drainage, sized to fit our grow pots.',
    feature: { species: 'none', pot: 'white' },
  },
];

export const getCollection = (slug) => collections.find((c) => c.slug === slug);
export const collectionProducts = (slug) => products.filter((p) => p.collections.includes(slug));
