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
};

/**
 * Products that offer AR. `sample: true` means the product uses a representative model,
 * not a scan of that exact plant — the viewer says so.
 */
export const AR_PRODUCTS = {
  'monstera-deliciosa': { model: 'potted-plant-01', sample: true },
  'ficus-lyrata': { model: 'potted-plant-01', sample: true },
  'bird-of-paradise': { model: 'potted-plant-01', sample: true },
  'areca-palm': { model: 'potted-plant-01', sample: true },
  'rubber-plant': { model: 'potted-plant-01', sample: true },
};

export function arFor(product) {
  const cfg = product && AR_PRODUCTS[product.slug];
  return cfg ? { ...cfg, ...AR_MODELS[cfg.model] } : null;
}

/** Target height in metres for a size, from details like "40–60 cm tall" (uses the midpoint). */
export function targetHeight(size) {
  const m = size?.detail?.match(/(\d+)\s*[–-]\s*(\d+)\s*cm tall/);
  return m ? (Number(m[1]) + Number(m[2])) / 200 : null;
}
