// 3D models for "View in your room" (AR). Replace the sample with real scans of each plant before launch.
// Models must be real-world scale in metres. GLB/glTF for Android + desktop; an optional USDZ for iPhone
// (if omitted, <model-viewer> generates one on the fly for AR Quick Look).

export const AR_MODELS = {
  'potted-plant-01': {
    src: '/models/potted-plant-01/potted_plant_01_1k.gltf',
    // usdz: '/models/potted-plant-01/potted_plant_01.usdz',
    name: 'Potted Plant 01',
    author: 'Rico Cilliers',
    source: 'Poly Haven',
    sourceUrl: 'https://polyhaven.com/a/potted_plant_01',
    license: 'CC0',
  },
  'potted-plant-02': {
    src: '/models/potted-plant-02/potted_plant_02_1k.gltf',
    name: 'Potted Plant 02',
    author: 'Rico Cilliers',
    source: 'Poly Haven',
    sourceUrl: 'https://polyhaven.com/a/potted_plant_02',
    license: 'CC0',
  },
  'potted-plant-04': {
    src: '/models/potted-plant-04/potted_plant_04_1k.gltf',
    name: 'Potted Plant 04',
    author: 'James Ray Cock',
    source: 'Poly Haven',
    sourceUrl: 'https://polyhaven.com/a/potted_plant_04',
    license: 'CC0',
  },
};

/**
 * Products that offer AR. `sample: true` means the product uses a representative model,
 * not a scan of that exact plant — the viewer says so.
 */
export const AR_PRODUCTS = {
  // Tall, leafy floor plants
  'monstera-deliciosa': { model: 'potted-plant-01', sample: true },
  'ficus-lyrata': { model: 'potted-plant-01', sample: true },
  'bird-of-paradise': { model: 'potted-plant-01', sample: true },
  'areca-palm': { model: 'potted-plant-01', sample: true },
  'rubber-plant': { model: 'potted-plant-01', sample: true },
  dracaena: { model: 'potted-plant-01', sample: true },
  'zz-plant': { model: 'potted-plant-01', sample: true },
  'snake-plant': { model: 'potted-plant-01', sample: true },
  // Broad / heart-shaped leaves in terracotta
  philodendron: { model: 'potted-plant-02', sample: true },
  pothos: { model: 'potted-plant-02', sample: true },
  syngonium: { model: 'potted-plant-02', sample: true },
  caladium: { model: 'potted-plant-02', sample: true },
  'chinese-evergreen': { model: 'potted-plant-02', sample: true },
  'peace-lily': { model: 'potted-plant-02', sample: true },
  anthurium: { model: 'potted-plant-02', sample: true },
  calathea: { model: 'potted-plant-02', sample: true },
  'spider-plant': { model: 'potted-plant-02', sample: true },
  'boston-fern': { model: 'potted-plant-02', sample: true },
  peperomia: { model: 'potted-plant-02', sample: true },
  'letterbox-peperomia': { model: 'potted-plant-02', sample: true, height: 0.2 },
  'letterbox-pothos': { model: 'potted-plant-02', sample: true, height: 0.2 },
  // Small succulents
  'aloe-vera': { model: 'potted-plant-04', sample: true },
  'jade-plant': { model: 'potted-plant-04', sample: true },
  'string-of-pearls': { model: 'potted-plant-04', sample: true },
  'letterbox-succulent-trio': { model: 'potted-plant-04', sample: true, height: 0.15 },
};

/** Any other plant (e.g. one added later) still gets AR with the general-purpose model. */
const FALLBACK = { model: 'potted-plant-02', sample: true };

export function arFor(product) {
  if (!product) return null;
  const cfg = AR_PRODUCTS[product.slug] || (product.type === 'plant' && product.art?.species !== 'none' ? FALLBACK : null);
  return cfg ? { ...cfg, ...AR_MODELS[cfg.model] } : null;
}

/** Target height in metres for a size, from details like "40–60 cm tall" (uses the midpoint). */
export function targetHeight(size) {
  const m = size?.detail?.match(/(\d+)\s*[–-]\s*(\d+)\s*cm tall/);
  return m ? (Number(m[1]) + Number(m[2])) / 200 : null;
}
