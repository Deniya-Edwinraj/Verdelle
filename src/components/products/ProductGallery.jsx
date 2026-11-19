import { useState } from 'react';
import { ProductImage } from '../art/scenes';

const LABEL = { front: 'Studio view', room: 'In a room', detail: 'Leaf detail', pot: 'Pot and base' };

export default function ProductGallery({ product }) {
  const [active, setActive] = useState(0);
  const views = product.type === 'planter' ? product.images.filter((v) => v.view === 'front' || v.view === 'room') : product.images;
  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row md:items-start">
      <div className="no-scrollbar flex gap-3 overflow-x-auto md:w-20 md:flex-col" role="tablist" aria-label="Product images">
        {views.map((v, i) => (
          <button
            key={v.view}
            role="tab"
            aria-selected={active === i}
            aria-label={LABEL[v.view]}
            onClick={() => setActive(i)}
            className={`w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-card transition ${active === i ? 'border-forest' : 'border-transparent opacity-75 hover:opacity-100'}`}
          >
            <ProductImage product={product} view={v.view} className="aspect-square w-full" />
          </button>
        ))}
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-card" role="tabpanel" aria-label={LABEL[views[active].view]}>
        <ProductImage key={active} product={product} view={views[active].view} className="aspect-square w-full animate-fade-in" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted">
          {LABEL[views[active].view]}
        </span>
      </div>
    </div>
  );
}
