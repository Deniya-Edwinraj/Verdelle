import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { ProductImage } from '../art/scenes';

const LABEL = { front: 'Studio view', room: 'In a room', detail: 'Leaf detail', pot: 'Pot and base' };

/** Product gallery: hover-to-zoom main image, thumbnails, arrows and a full-screen lightbox. */
export default function ProductGallery({ product, badge }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null); // { x, y } in % while hovering
  const [lightbox, setLightbox] = useState(false);
  const views = product.type === 'planter' ? product.images.filter((v) => v.view === 'front' || v.view === 'room') : product.images;
  const go = (d) => setActive((i) => (i + d + views.length) % views.length);

  useEffect(() => {
    if (!lightbox) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="min-w-0">
      {/* Main image */}
      <div className="group relative overflow-hidden rounded-[28px] bg-card shadow-soft ring-1 ring-line/60" role="tabpanel" aria-label={LABEL[views[active].view]}>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          className="block w-full cursor-zoom-in"
          aria-label="Open full-screen gallery"
        >
          <div
            className="transition-transform duration-300 ease-out"
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          >
            <ProductImage key={active} product={product} view={views[active].view} className="aspect-[4/5] w-full animate-fade-in" />
          </div>
        </button>

        {badge}
        <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest shadow-sm backdrop-blur-md">
          {LABEL[views[active].view]}
        </span>
        <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-forest-900/50 px-3 py-1.5 text-[11px] font-medium text-white ring-1 ring-white/20 backdrop-blur-md transition-opacity group-hover:opacity-0">
          <Expand size={12} /> Hover to zoom · click to expand
        </span>

        {views.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest opacity-0 shadow-soft backdrop-blur-md transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest opacity-0 shadow-soft backdrop-blur-md transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto" role="tablist" aria-label="Product images">
        {views.map((v, i) => (
          <button
            key={v.view}
            role="tab"
            aria-selected={active === i}
            aria-label={LABEL[v.view]}
            onClick={() => setActive(i)}
            className={`relative w-[22%] min-w-[72px] shrink-0 overflow-hidden rounded-2xl bg-card ring-2 transition ${
              active === i ? 'ring-forest' : 'ring-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <ProductImage product={product} view={v.view} className="aspect-square w-full" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[95] flex flex-col bg-forest-900/95 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-label={`${product.name} gallery`}>
          <div className="flex items-center justify-between p-4 text-white sm:p-6">
            <p className="font-serif text-lg">
              {product.name} <span className="ml-2 text-sm text-white/60">{active + 1} / {views.length}</span>
            </p>
            <button onClick={() => setLightbox(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20" aria-label="Close gallery">
              <X size={20} />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={() => setLightbox(false)}>
            <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-card" onClick={(e) => e.stopPropagation()}>
              <ProductImage key={`lb-${active}`} product={product} view={views[active].view} className="aspect-[4/5] max-h-[78vh] w-full animate-fade-in sm:aspect-square" />
            </div>
            {views.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-2 pb-6">
            {views.map((v, i) => (
              <button
                key={v.view}
                onClick={() => setActive(i)}
                aria-label={LABEL[v.view]}
                className={`h-14 w-14 overflow-hidden rounded-xl ring-2 transition ${active === i ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'}`}
              >
                <ProductImage product={product} view={v.view} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
