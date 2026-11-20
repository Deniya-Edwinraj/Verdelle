import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Box, Info, Loader2, Move3d, Ruler, ScanLine, Smartphone, X } from 'lucide-react';
import { arFor, targetHeight } from '../../data/ar';
import { PHOTOS } from '../../data/assets';

/** Lazy-loads Google's <model-viewer> web component (and three.js) only when it's first needed. */
let mvPromise;
const loadModelViewer = () => (mvPromise ||= import('@google/model-viewer'));

function QR({ url }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 280, color: { dark: '#0B2418', light: '#FFFFFF' } })
      .then(setSrc)
      .catch(() => {});
  }, [url]);
  return src ? <img src={src} alt="QR code to open this plant in AR on your phone" className="h-36 w-36 rounded-xl bg-white p-1.5" /> : <span className="block h-36 w-36 rounded-xl bg-white/10" />;
}

/** "View in your room" button + full-screen 3D/AR viewer for products that have a 3D model. */
export default function ARViewer({ product, size, onSizeChange, autoOpen = false }) {
  const ar = arFor(product);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canAR, setCanAR] = useState(false);
  const [baseHeight, setBaseHeight] = useState(null);
  const mvRef = useRef(null);

  useEffect(() => {
    if (autoOpen && ar) setOpen(true);
  }, [autoOpen, ar]);

  useEffect(() => {
    if (!open) return undefined;
    loadModelViewer().then(() => setReady(true));
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Measure the model once it loads so it can be scaled to the selected size's real height.
  useEffect(() => {
    const mv = mvRef.current;
    if (!mv || !ready) return undefined;
    const onLoad = () => {
      setLoaded(true);
      setCanAR(!!mv.canActivateAR);
      try {
        const d = mv.getDimensions();
        if (d?.y) setBaseHeight(d.y);
      } catch {
        /* dimensions unavailable */
      }
    };
    mv.addEventListener('load', onLoad);
    return () => mv.removeEventListener('load', onLoad);
  }, [ready]);

  if (!ar) return null;

  const current = product.sizes.find((s) => s.label === size) || product.sizes[0];
  const target = targetHeight(current);
  const k = baseHeight && target ? target / baseHeight : 1;
  const scale = `${k.toFixed(3)} ${k.toFixed(3)} ${k.toFixed(3)}`;
  const pageUrl = `${window.location.origin}/product/${product.slug}?ar=1`;
  const poster = PHOTOS.products?.[product.slug];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-3 flex w-full items-center gap-3 rounded-2xl bg-forest-900 p-3 pr-4 text-left text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-sage-soft">
          <Box size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">View in your room</span>
          <span className="block truncate text-xs text-white/65">See it life-size in AR, or spin it in 3D</span>
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sage-soft">AR</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[96] flex flex-col bg-forest-900 text-white animate-fade-in" role="dialog" aria-modal="true" aria-label={`${product.name} in 3D and AR`}>
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-soft">3D & AR view</p>
              <p className="truncate font-serif text-xl">{product.name}</p>
            </div>
            <button onClick={() => setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20" aria-label="Close 3D view">
              <X size={20} />
            </button>
          </div>

          <div className="relative grid min-h-0 flex-1 gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-[1fr_320px]">
            {/* Viewer */}
            <div className="relative min-h-[50vh] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#E9EFE7] to-[#C9D6C6]">
              {!loaded && (
                <div className="absolute inset-0 z-10 grid place-items-center text-forest">
                  <span className="flex flex-col items-center gap-3">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-sm font-medium">Loading 3D model…</span>
                  </span>
                </div>
              )}
              {ready && (
                <model-viewer
                  ref={mvRef}
                  src={ar.src}
                  {...(ar.usdz ? { 'ios-src': ar.usdz } : {})}
                  {...(poster ? { poster } : {})}
                  alt={`3D model of a ${product.name} for viewing in your room`}
                  ar=""
                  ar-modes="webxr quick-look scene-viewer"
                  ar-placement="floor"
                  ar-scale="fixed"
                  camera-controls=""
                  touch-action="pan-y"
                  auto-rotate=""
                  auto-rotate-delay="1500"
                  shadow-intensity="1"
                  exposure="1.05"
                  scale={scale}
                  style={{ width: '100%', height: '100%', minHeight: '50vh', background: 'transparent' }}
                >
                  <button
                    slot="ar-button"
                    className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-float ring-4 ring-white/60"
                  >
                    <ScanLine size={17} /> View in your room
                  </button>
                </model-viewer>
              )}
              {loaded && !canAR && (
                <span className="pointer-events-none absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-forest shadow-soft backdrop-blur">
                  <Move3d size={14} /> Drag to rotate · scroll or pinch to zoom
                </span>
              )}
              {ar.sample && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-medium text-forest shadow-sm backdrop-blur">
                  <Info size={12} /> Representative model — your plant will differ
                </span>
              )}
            </div>

            {/* Side panel */}
            <aside className="flex flex-col gap-4 overflow-y-auto">
              <div className="rounded-[24px] bg-white/[0.07] p-5 ring-1 ring-white/10">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                  <Ruler size={13} /> Life-size by pot size
                </p>
                <div className="mt-3 grid gap-2">
                  {product.sizes.map((s) => {
                    const h = targetHeight(s);
                    const on = s.label === current.label;
                    return (
                      <button
                        key={s.label}
                        onClick={() => onSizeChange?.(s.label)}
                        aria-pressed={on}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm ring-1 transition ${on ? 'bg-sage-soft font-semibold text-forest-900 ring-sage-soft' : 'bg-white/[0.04] text-white/85 ring-white/10 hover:bg-white/10'}`}
                      >
                        {s.label}
                        <span className={on ? 'text-forest-900/70' : 'text-white/50'}>{h ? `≈ ${Math.round(h * 100)} cm tall` : s.detail}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden rounded-[24px] bg-white/[0.07] p-5 ring-1 ring-white/10 lg:block">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                  <Smartphone size={13} /> See it in your room
                </p>
                <p className="mt-2 text-sm text-white/75">Scan with your phone camera to place this plant on your floor in augmented reality.</p>
                <div className="mt-4 flex justify-center">
                  <QR url={pageUrl} />
                </div>
                <p className="mt-3 text-center text-[11px] text-white/50">Works on iPhone (Safari) and most Android phones (Chrome).</p>
              </div>

              <p className="px-1 text-[11px] leading-relaxed text-white/45">
                3D model: “{ar.name}” by {ar.author}, {ar.source} ({ar.license}). Sizes are approximate and include the pot.
              </p>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
