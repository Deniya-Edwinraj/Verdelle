import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { ArrowRight, Box, Footprints, Hand, Ruler, ScanLine, Smartphone } from 'lucide-react';
import { ProductImage } from '../art/scenes';
import { money } from '../ui';
import { getProduct } from '../../data/products';
import { AR_PRODUCTS } from '../../data/ar';

const STEPS = [
  [Hand, 'Pick a plant', 'Open any plant with the AR badge.'],
  [ScanLine, 'Tap “View in your room”', 'Point your phone at the floor.'],
  [Footprints, 'Walk around it', 'True to size — move it, turn it, compare spots.'],
];

const HERO_SLUG = 'monstera-deliciosa';

function QR({ url }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: '#0B2418', light: '#FFFFFF' } })
      .then(setSrc)
      .catch(() => {});
  }, [url]);
  return src ? <img src={src} alt="QR code — open the Monstera in AR on your phone" className="h-24 w-24 rounded-xl bg-white p-1" /> : <span className="block h-24 w-24 rounded-xl bg-white/10" />;
}

/* "View in your room" — augmented-reality showcase on the home page. */
export default function ARShowcase() {
  const plants = Object.keys(AR_PRODUCTS).map(getProduct).filter(Boolean);
  const hero = getProduct(HERO_SLUG) || plants[0];
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);

  if (!hero) return null;
  const heroUrl = `/product/${hero.slug}?ar=1`;

  return (
    <section id="view-in-your-room" className="scroll-mt-24 bg-warm pb-16 md:pb-24" aria-labelledby="ar-title">
      <div className="container">
        <div className="relative overflow-hidden rounded-[36px] bg-forest-900 px-6 py-12 text-white sm:px-10 md:px-14 md:py-16">
          {/* Glow + dot texture */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-botanical/50 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-sage/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Copy */}
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft">
                <span aria-hidden="true" className="h-px w-10 bg-sage-soft/60" />
                New · Augmented reality
              </p>
              <h2 id="ar-title" className="mt-4 text-[34px] font-semibold leading-[1.1] md:text-[48px]">
                See it in your room <em className="font-serif font-normal italic text-sage-soft">before</em> it arrives
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
                Not sure a floor plant will fit that corner? Place it life-size in your space with your phone’s camera — no app to download.
              </p>

              <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                {STEPS.map(([Icon, title, body], i) => (
                  <li key={title} className="rounded-[22px] bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <span className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sage-soft">
                        <Icon size={18} />
                      </span>
                      <span className="font-serif text-2xl text-white/25">0{i + 1}</span>
                    </span>
                    <span className="mt-3 block text-sm font-semibold">{title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/60">{body}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={heroUrl} className="group inline-flex items-center gap-3 rounded-full bg-sage-soft py-2 pl-6 pr-2 text-sm font-semibold text-forest-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-white">
                  Try it with the {hero.name.split(' ')[0]}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
                <span className="inline-flex items-center gap-2 text-xs text-white/55">
                  <Smartphone size={14} /> iPhone (Safari) & Android (Chrome)
                </span>
              </div>
            </div>

            {/* Phone mock-up */}
            <div className="relative mx-auto w-full max-w-[340px]">
              <div className="relative aspect-[9/17] overflow-hidden rounded-[46px] border-[10px] border-black/80 bg-gradient-to-b from-[#EDE7DD] via-[#E4DCCF] to-[#CDBFAA] shadow-float ring-1 ring-white/10">
                {/* Notch */}
                <span aria-hidden="true" className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />
                {/* Room: wall, skirting, floor */}
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-[#B79C7E] to-[#9C8166]" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-[34%] h-1.5 bg-white/70" />
                <span aria-hidden="true" className="absolute left-6 top-[18%] h-24 w-16 rounded-md border-4 border-white/80 bg-[#d9cfbf] shadow-sm" />

                {/* Placement reticle */}
                <span aria-hidden="true" className="absolute bottom-[12%] left-1/2 h-10 w-44 -translate-x-1/2 rounded-[50%] border-2 border-dashed border-white/80 animate-pulse" />
                <span aria-hidden="true" className="absolute bottom-[13%] left-1/2 h-6 w-32 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md" />

                {/* Plant */}
                <div className="absolute bottom-[14%] left-1/2 w-[72%] -translate-x-1/2 motion-safe:animate-bob">
                  <div className="aspect-[4/5] overflow-hidden rounded-[28px] [mask-image:radial-gradient(75%_80%_at_50%_45%,#000_60%,transparent_100%)]">
                    <ProductImage product={hero} className="h-full w-full object-cover" bg="transparent" />
                  </div>
                </div>

                {/* Height ruler */}
                <span className="absolute bottom-[16%] right-4 top-[28%] flex flex-col items-center justify-between text-forest-900">
                  <span className="h-px w-3 bg-forest-900/60" />
                  <span className="w-px flex-1 bg-forest-900/40" />
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm">≈ 1 m</span>
                  <span className="w-px flex-1 bg-forest-900/40" />
                  <span className="h-px w-3 bg-forest-900/60" />
                </span>

                {/* AR UI chips */}
                <span className="absolute left-4 top-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-forest shadow-sm backdrop-blur">
                  <Box size={12} /> AR · placed on floor
                </span>
                <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-forest px-4 py-2 text-[11px] font-semibold text-white shadow-soft">
                  <ScanLine size={13} /> View in your room
                </span>
              </div>

              {/* Floating QR card (desktop) */}
              <div className="absolute -left-28 bottom-10 hidden items-center gap-3 rounded-[22px] bg-white p-3 pr-4 text-forest-900 shadow-float xl:flex">
                {origin && <QR url={`${origin}${heroUrl}`} />}
                <span className="w-24 text-xs font-semibold leading-snug">
                  Scan to see it in your room
                  <span className="mt-1 block font-normal text-muted">Opens on your phone</span>
                </span>
              </div>
              <span className="absolute -right-3 top-16 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-forest-900 shadow-float sm:inline-flex">
                <Ruler size={13} /> True to size
              </span>
            </div>
          </div>

          {/* AR-ready plants */}
          <div className="relative mt-14 border-t border-white/10 pt-8">
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">AR-ready plants</p>
              <Link to="/shop" className="text-xs font-medium text-sage-soft underline-offset-4 hover:underline">Shop all plants</Link>
            </div>
            <ul className="no-scrollbar -mx-2 mt-4 flex snap-x gap-3 overflow-x-auto px-2 pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
              {plants.map((p) => (
                <li key={p.id} className="w-[200px] shrink-0 snap-start lg:w-auto">
                  <Link to={`/product/${p.slug}?ar=1`} className="group flex items-center gap-3 rounded-[20px] bg-white/[0.06] p-2 pr-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/[0.12]">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-card">
                      <ProductImage product={p} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-white/55">
                        from {money(p.price)}
                        <span className="rounded-full bg-sage-soft/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-sage-soft">AR</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
