import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock, Flower2, Gift, Headphones, Leaf, Lock, PlayCircle, Quote, Sparkles, RotateCcw, ShieldCheck, Sprout, Star, Truck, Users } from 'lucide-react';
import { HeroScene, FeaturePlant, GreenBandScene, FramedPlant, SaleScene, PortraitScene, LeafyInteriorScene, EditorialScene } from '../art/scenes';
import ProductGrid from '../products/ProductGrid';
import NewsletterForm from '../forms/NewsletterForm';
import { Modal, money } from '../ui';
import { products, getProduct, HOME_FAVORITES } from '../../data/products';
import { collections } from '../../data/collections';
import { testimonials } from '../../data/testimonials';
import { blogPosts } from '../../data/blogPosts';
import { SITE } from '../../data/site';

/* 2 + 3. Hero with overlapping stat cards */
const STATS = [
  { k: 'Trusted by', v: '1,900+', s: 'Happy plant lovers', icon: Users },
  { k: 'Explore', v: '8,000+', s: 'Happy green families', icon: Sprout },
  { k: 'Backed by', v: '520+', s: 'Plant collections', icon: Flower2 },
  { k: 'Rated', v: '4.9', s: 'By our customers', icon: Star, star: true },
];

export function Hero() {
  const [video, setVideo] = useState(false);
  return (
    <section className="relative" aria-labelledby="hero-title">
      <div className="relative min-h-[600px] overflow-hidden bg-forest md:min-h-[640px] lg:min-h-[700px]">
        <HeroScene className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-forest-900/50 md:hidden" />
        <div className="container relative flex min-h-[600px] flex-col justify-center pb-40 pt-14 md:min-h-[640px] lg:min-h-[700px] lg:pb-36">
          <p className="flex animate-fade-up items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
            <span className="h-px w-8 bg-sage" aria-hidden="true" />
            Breathe life into your space
          </p>
          <h1 id="hero-title" className="mt-4 max-w-xl animate-fade-up text-[40px] font-semibold leading-[1.12] text-white [animation-delay:80ms] [text-shadow:0_2px_24px_rgba(0,0,0,.25)] sm:text-[52px] lg:text-[60px]">
            Discover beautiful indoor plants for every corner of your home
          </h1>
          <p className="mt-5 max-w-md animate-fade-up text-[15px] leading-relaxed text-white/85 [animation-delay:160ms]">
            From indoor greens to outdoor blooms — shop plants, pots, and care tools delivered with love.
          </p>
          <div className="mt-7 flex animate-fade-up flex-wrap items-center gap-5 [animation-delay:240ms]">
            <Link to="/shop" className="btn-primary h-11 px-6 ring-1 ring-white/25">
              Shop Now
            </Link>
            <Link
              to="/plant-finder"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white/10 px-5 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/20"
            >
              <Sparkles size={15} /> Find my plant
            </Link>
            <button onClick={() => setVideo(true)} className="group inline-flex items-center gap-2 text-left text-xs font-medium leading-tight text-white">
              <PlayCircle size={34} strokeWidth={1.3} className="transition group-hover:scale-105" />
              <span>
                Watch how
                <br />
                Verdelle works
              </span>
            </button>
          </div>
          <p className="mt-6 animate-fade-up text-xs text-white/70 [animation-delay:300ms]">Join 1,900+ plant lovers growing their dream spaces.</p>
        </div>
      </div>
      <div className="container relative -mt-28 lg:-mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-forest text-white shadow-float ring-1 ring-white/10">
          {/* soft light + leaf watermark */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(143,168,143,0.28),transparent_55%),radial-gradient(90%_120%_at_100%_100%,rgba(47,98,69,0.55),transparent_60%)]" />
          <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 text-white/[0.05]">
            <path fill="currentColor" d="M100 190C92 130 110 60 180 20c10 80-20 150-80 170Z" />
            <path fill="currentColor" d="M100 190c4-50-26-90-80-106 0 66 32 100 80 106Z" />
          </svg>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <ul className="relative grid grid-cols-2 md:grid-cols-4" aria-label="Verdelle in numbers">
            {STATS.map(({ k, v, s, icon: Icon, star }, i) => (
              <li
                key={s}
                className={`group flex flex-col items-center px-4 py-6 text-center md:py-8 ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${i > 1 ? 'border-t border-white/10 md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-sage/50 bg-white/5 text-mist transition-all duration-300 group-hover:scale-110 group-hover:border-mist group-hover:bg-white group-hover:text-forest">
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <p className="mt-4 font-serif text-[34px] font-semibold leading-none tracking-tight md:text-[40px]">{v}</p>
                <span className="mt-2 flex h-[13px] items-center gap-0.5" {...(star ? { 'aria-label': 'out of 5 stars' } : { 'aria-hidden': true })}>
                  {star ? (
                    [0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} className="fill-[#E9C46A] text-[#E9C46A]" aria-hidden="true" />)
                  ) : (
                    <span className="h-px w-8 bg-sage/60 transition-all duration-300 group-hover:w-12" />
                  )}
                </span>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-soft">{k}</p>
                <p className="mt-0.5 text-sm text-white/80">{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal open={video} onClose={() => setVideo(false)} title="How Verdelle works" size="max-w-2xl">
        <div className="p-7 md:p-9">
          <h2 className="text-3xl">How Verdelle works</h2>
          <ol className="mt-5 space-y-4">
            {[
              ['Choose your plant', 'Filter by light, care level and pet safety to find the right match for your space.'],
              ['We pack it with care', 'Plants are watered, wrapped and boxed with the soil secured for the journey.'],
              ['Unbox and settle in', 'Every order includes a care card — and our plant-care guides are always free.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-sm font-semibold text-white">{i + 1}</span>
                <span>
                  <span className="block font-medium">{t}</span>
                  <span className="text-sm text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted">A brand video can be embedded here once available.</p>
          <Link to="/shop" onClick={() => setVideo(false)} className="btn-primary mt-5">Start shopping</Link>
        </div>
      </Modal>
    </section>
  );
}

/* 4. Benefits around a central plant */
const BENEFITS = [
  { icon: Truck, title: 'Free and Fast Delivery', body: `Plants delivered fresh to your door — free on orders over $${SITE.freeShippingThreshold}.` },
  { icon: RotateCcw, title: 'Hassle-Free Returns', body: 'Changed your mind? Return eligible items within 30 days, no stress.' },
  { icon: Headphones, title: '24/7 Customer Support', body: 'We’re here whenever you need us — day or night.' },
  { icon: ShieldCheck, title: 'Secure Payments', body: 'Pay safely with encrypted checkout.' },
];

function Benefit({ icon: Icon, title, body, n, side }) {
  const right = side === 'right';
  return (
    <li className="group relative">
      {/* connector toward the plant (desktop) */}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 hidden h-px w-8 bg-gradient-to-r lg:block ${right ? '-left-8 from-sage/0 to-sage/60' : '-right-8 from-sage/60 to-sage/0'}`}
      />
      <span aria-hidden="true" className={`absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sage lg:block ${right ? '-left-9' : '-right-9'}`} />
      <div
        className={`relative overflow-hidden rounded-2xl border border-line/80 bg-white/80 p-5 shadow-soft backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sage/60 group-hover:shadow-lift md:p-6 ${right ? 'lg:text-right' : ''}`}
      >
        <span aria-hidden="true" className={`pointer-events-none absolute -top-3 font-serif text-[64px] font-semibold leading-none text-mist/80 transition-colors group-hover:text-mist ${right ? 'left-4' : 'right-4'}`}>
          {String(n).padStart(2, '0')}
        </span>
        <div className={`relative flex items-start gap-4 ${right ? 'lg:flex-row-reverse' : ''}`}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mist/70 text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-white">
            <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-[19px] font-semibold leading-snug text-ink">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function BenefitsAroundPlant() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-warm via-white to-mist/40 py-16 md:py-24" aria-labelledby="why-title">
      {/* soft ambient shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-mist/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sage-soft/30 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
            The Verdelle promise
            <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
          </p>
          <h2 id="why-title" className="mt-4 text-[34px] font-semibold leading-tight md:text-[44px]">
            Why shop with <em className="font-serif italic text-botanical">Verdelle</em>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">From our screen to your space — we make plant shopping smooth, considered and stress-free.</p>
        </div>

        <div className="mt-12 grid items-center gap-8 md:mt-16 lg:grid-cols-[1fr_minmax(280px,380px)_1fr] lg:gap-16">
          <ul className="order-2 grid gap-5 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-10">
            <Benefit {...BENEFITS[0]} n={1} />
            <Benefit {...BENEFITS[1]} n={2} />
          </ul>

          {/* arched plant portrait */}
          <div className="relative order-1 mx-auto mb-6 w-full max-w-[260px] sm:max-w-[300px] lg:order-2 lg:mb-0 lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-4 rounded-b-[2.5rem] rounded-t-full border border-sage/30" />
            <div aria-hidden="true" className="absolute -inset-8 hidden rounded-b-[3rem] rounded-t-full border border-dashed border-sage/25 sm:block" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-full bg-gradient-to-b from-mist via-mist/70 to-white shadow-lift ring-1 ring-white">
              <FeaturePlant className="absolute inset-0 h-full w-full mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-forest shadow-soft">
              <Sprout size={14} className="text-botanical" aria-hidden="true" />
              Hand-picked &amp; healthy
            </div>
          </div>

          <ul className="order-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-10">
            <Benefit {...BENEFITS[2]} n={3} side="right" />
            <Benefit {...BENEFITS[3]} n={4} side="right" />
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 5. Two-collection photographic band */
export function CollectionFeatureBanner() {
  const items = collections.slice(0, 2);
  return (
    <section className="relative overflow-hidden bg-forest-900" aria-labelledby="featured-collections-title">
      <GreenBandScene className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/40 to-forest-900/80" />

      <div className="container relative py-10 md:py-14">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-soft">
              <span className="h-px w-10 bg-sage" aria-hidden="true" />
              Curated collections
            </p>
            <h2 id="featured-collections-title" className="mt-2 max-w-lg text-[26px] font-semibold leading-tight text-white md:text-[32px]">
              Find the right green for <em className="font-serif italic text-mist">every space</em>
            </h2>
          </div>
          <Link to="/collections" className="group inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white">
            View all collections
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:gap-6">
          {items.map((c, i) => (
            <article key={c.slug} className="group relative isolate flex min-h-[300px] overflow-hidden rounded-2xl bg-forest shadow-float ring-1 ring-white/10 md:min-h-[340px]">
              <FramedPlant
                species={c.feature.species}
                pot={c.feature.pot}
                seed={`band-${c.slug}`}
                className="absolute inset-0 -z-10 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/55 to-forest-900/0" />

              <span aria-hidden="true" className="absolute right-5 top-4 font-serif text-[44px] font-semibold leading-none text-white/15">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {c.tag}
              </span>

              <div className="mt-auto w-full p-5 text-white md:p-6">
                <h3 className="font-serif text-[24px] font-semibold leading-tight text-white md:text-[26px]">{c.name}</h3>
                <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/80">{c.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
                  <Link to={`/collections/${c.slug}`} className="text-sm font-medium text-white after:absolute after:inset-0 after:content-['']">
                    Explore collection
                  </Link>
                  <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-forest">
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. Favorite plants 4×2 with tabs */
const TABS = [
  { key: 'all', label: 'All Plants' },
  { key: 'new', label: 'New Arrivals' },
  { key: 'sale', label: 'Sale' },
  { key: 'easy', label: 'Easy Care' },
];

export function FavoritePlants() {
  const [tab, setTab] = useState('all');
  const list = useMemo(() => {
    const plants = products.filter((p) => p.type === 'plant');
    if (tab === 'new') return plants.filter((p) => p.isNew).slice(0, 8);
    if (tab === 'sale') return plants.filter((p) => p.discount).slice(0, 8);
    if (tab === 'easy') return plants.filter((p) => p.difficulty === 'Easy').sort((a, b) => b.popularity - a.popularity).slice(0, 8);
    return HOME_FAVORITES.map(getProduct);
  }, [tab]);
  const more = { all: '/shop', new: '/shop/new-arrivals', sale: '/shop/sale', easy: '/shop/easy-care' }[tab];

  return (
    <section className="relative overflow-hidden bg-warm py-16 md:py-24" aria-labelledby="fav-title">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-mist/50 blur-3xl" />
      <div className="container relative">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
            Shop the edit
            <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
          </p>
          <h2 id="fav-title" className="mt-4 text-[34px] font-semibold leading-tight md:text-[44px]">
            Our <em className="font-serif italic text-botanical">favourite</em> plants
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">Take home one of our favourites — easy to care for, hard not to love.</p>
        </div>

        <div role="tablist" aria-label="Filter favourite plants" className="no-scrollbar mx-auto mt-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1.5 shadow-soft">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 sm:px-5 ${tab === t.key ? 'bg-forest text-white shadow-soft' : 'text-muted hover:bg-mist/60 hover:text-forest'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div key={tab} className="mt-10 animate-fade-in" role="tabpanel" aria-label={TABS.find((t) => t.key === tab).label}>
          <ProductGrid products={list} cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
        </div>

        <div className="mt-12 flex justify-center">
          <Link to={more} className="group inline-flex items-center gap-3 rounded-full border border-forest/20 bg-white py-2 pl-6 pr-2 text-sm font-medium text-forest shadow-soft transition hover:border-forest hover:shadow-lift">
            Explore more plants
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 7. Sale banner */
export function SaleBanner() {
  const pct = Math.round(SITE.saleDiscount * 100);
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="sale-title">
      <div className="container">
        <div className="relative grid overflow-hidden rounded-[28px] bg-forest shadow-float ring-1 ring-forest/10 md:grid-cols-[1.05fr_0.95fr]">
          {/* copy */}
          <div className="relative z-10 flex flex-col justify-center p-7 text-white sm:p-10 lg:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_0%_0%,rgba(143,168,143,0.30),transparent_60%),radial-gradient(70%_90%_at_100%_100%,rgba(47,98,69,0.6),transparent_65%)]" />
            <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 -left-14 h-72 w-72 text-white/[0.04]">
              <path fill="currentColor" d="M100 190C92 130 110 60 180 20c10 80-20 150-80 170Z" />
              <path fill="currentColor" d="M100 190c4-50-26-90-80-106 0 66 32 100 80 106Z" />
            </svg>

            <div className="relative">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-soft">
                <span className="h-px w-10 bg-sage" aria-hidden="true" />
                Limited season · {SITE.saleName}
              </p>

              <div className="mt-5 flex items-end gap-4">
                <span className="font-serif text-[84px] font-semibold leading-[0.8] tracking-tight text-white md:text-[112px]">{pct}%</span>
                <span className="mb-1 text-[11px] font-semibold uppercase leading-tight tracking-[0.2em] text-mist md:mb-2">
                  Off
                  <br />
                  selected
                  <br />
                  plants
                </span>
              </div>

              <h2 id="sale-title" className="mt-6 max-w-md text-[26px] font-semibold leading-snug text-white md:text-[32px]">
                Spring into green with <em className="font-serif italic text-mist">easy-care</em> indoor favourites
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">Bring life to your home with vibrant, forgiving greens — now at a special seasonal price.</p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/85">
                <li className="flex items-center gap-2">
                  <Truck size={15} className="text-sage-soft" aria-hidden="true" /> Free delivery over {money(SITE.freeShippingThreshold)}
                </li>
                <li className="flex items-center gap-2">
                  <Sprout size={15} className="text-sage-soft" aria-hidden="true" /> Care card with every plant
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link to="/shop/sale" className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-forest shadow-soft transition hover:bg-mist">
                  Shop the sale
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-white transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
                <Link to="/shop" className="text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline">
                  Browse all plants
                </Link>
              </div>

              <p className="mt-6 text-[11px] text-white/50">Offer applies to selected plants while stocks last. Discount shown at checkout; pots and planters excluded.</p>
            </div>
          </div>

          {/* photo */}
          <div className="relative min-h-[260px] md:min-h-full">
            <SaleScene className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-forest to-transparent md:block" />
            <div className="absolute right-5 top-5 grid h-24 w-24 place-items-center rounded-full border border-white/40 bg-white/15 text-center text-white shadow-soft backdrop-blur-md md:right-8 md:top-8 md:h-28 md:w-28">
              <span className="leading-tight">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/85">Spring sale</span>
                <span className="block font-serif text-[30px] font-semibold md:text-[34px]">-{pct}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 8. Testimonials */
export function Testimonials() {
  const pages = Math.ceil(testimonials.length / 2);
  const [page, setPage] = useState(0);
  const shown = testimonials.slice(page * 2, page * 2 + 2);
  const avg = (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1);
  const plantName = (sp) => products.find((p) => p.art.species === sp)?.name || sp.replace(/-/g, ' ');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-mist/30 to-white py-16 md:py-24" aria-labelledby="t-title" aria-roledescription="carousel">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-sage-soft/25 blur-3xl" />
      <div className="container relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
              Kind words
            </p>
            <h2 id="t-title" className="mt-4 max-w-lg text-[34px] font-semibold leading-tight md:text-[44px]">
              Loved by <em className="font-serif italic text-botanical">plant people</em> everywhere
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
              <span className="font-serif text-[30px] font-semibold leading-none text-forest">{avg}</span>
              <span>
                <span className="flex gap-0.5" role="img" aria-label={`Average ${avg} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className="text-[#E9C46A]" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">Average customer rating</span>
              </span>
            </div>
          </div>
        </div>

        <div key={page} className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2" aria-live="polite">
          {shown.map((t, i) => (
            <figure
              key={t.name}
              className="group relative flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-line/80 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:shadow-lift md:p-9"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <Quote aria-hidden="true" size={84} strokeWidth={1} className="pointer-events-none absolute -right-2 -top-3 rotate-180 text-mist transition-colors group-hover:text-mist/80" fill="currentColor" />
              <div className="relative flex" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} className={s <= t.rating ? 'text-[#E9C46A]' : 'text-line'} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="relative mt-5 flex-1 font-serif text-[19px] italic leading-relaxed text-ink md:text-[21px]">“{t.quote}”</blockquote>
              <figcaption className="relative mt-7 flex items-center gap-4 border-t border-line pt-6">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-mist ring-2 ring-white ring-offset-2 ring-offset-mist">
                  <PortraitScene variant={page * 2 + i} plant={t.plant} className="h-full w-full" label={`${t.name}'s ${plantName(t.plant)}`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[17px] font-semibold text-forest">{t.name}</span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-mist/60 px-3 py-1.5 text-[11px] font-medium text-forest sm:inline-flex">
                  <Leaf size={12} aria-hidden="true" /> {plantName(t.plant)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => (p - 1 + pages) % pages)} className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest hover:bg-mist/60" aria-label="Previous testimonials">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} aria-label={`Show testimonials page ${i + 1}`} aria-current={page === i} className={`h-2 rounded-full transition-all ${page === i ? 'w-6 bg-forest' : 'w-2 bg-line hover:bg-sage'}`} />
          ))}
          <button onClick={() => setPage((p) => (p + 1) % pages)} className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest hover:bg-mist/60" aria-label="Next testimonials">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* 9. Newsletter photo banner */
export function Newsletter() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="nl-title">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-900 shadow-float ring-1 ring-forest/10">
          <LeafyInteriorScene className="absolute inset-0 -z-20 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/95 via-forest-900/80 to-forest/60" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-14">
            <div className="text-white">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-soft">
                <span className="h-px w-10 bg-sage" aria-hidden="true" />
                The Verdelle letter
              </p>
              <h2 id="nl-title" className="mt-4 max-w-md text-[32px] font-semibold leading-tight text-white md:text-[42px]">
                Get the <em className="font-serif italic text-mist">green</em> in your inbox
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">Seasonal care tips, first look at new arrivals and members-only offers — a calm, monthly note from our greenhouse.</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {[
                  [Sprout, 'Care tips'],
                  [Sparkles, 'New arrivals'],
                  [Gift, 'Member offers'],
                ].map(([Icon, label]) => (
                  <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <Icon size={13} className="text-sage-soft" aria-hidden="true" /> {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md sm:p-7">
              <p className="font-serif text-xl text-white">Join 1,900+ plant lovers</p>
              <p className="mt-1 text-sm text-white/70">One email a month. Unsubscribe anytime.</p>
              <div className="mt-5">
                <NewsletterForm variant="pill" />
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/55">
                <Lock size={11} aria-hidden="true" /> We respect your inbox — no spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 10. Blog */
const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function PostMeta({ post, light = false }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] ${light ? 'text-white/75' : 'text-muted'}`}>
      <time dateTime={post.date}>{fmtDate(post.date)}</time>
      <span aria-hidden="true" className={`h-1 w-1 rounded-full ${light ? 'bg-white/50' : 'bg-sage'}`} />
      <span className="inline-flex items-center gap-1">
        <Clock size={12} aria-hidden="true" /> {post.readingTime} min read
      </span>
    </p>
  );
}

/** Blog card (shared with the Blog and article pages). */
export function BlogCard({ post, compact = false }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white p-2 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:shadow-lift">
      <div className="relative overflow-hidden rounded-xl">
        <EditorialScene kind={post.image} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" label={post.title} />
        <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest backdrop-blur-md">{post.tag}</span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <PostMeta post={post} />
        <h3 className={`mt-2 font-serif font-semibold leading-snug text-ink ${compact ? 'text-[17px]' : 'text-[21px]'}`}>
          <Link to={`/blog/${post.slug}`} className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-botanical">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[13px] font-medium text-forest" aria-hidden="true">
          Read article
          <span className="grid h-8 w-8 place-items-center rounded-full border border-forest/20 transition-all duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-white">
            <ArrowUpRight size={15} />
          </span>
        </span>
      </div>
    </article>
  );
}

export function BlogPreview() {
  const [lead, ...rest] = blogPosts.slice(0, 4);
  return (
    <section className="relative overflow-hidden bg-warm py-16 md:py-24" aria-labelledby="blog-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-mist/50 blur-3xl" />
      <div className="container relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-sage/70" aria-hidden="true" />
              The journal
            </p>
            <h2 id="blog-title" className="mt-4 text-[34px] font-semibold leading-tight md:text-[44px]">
              From the <em className="font-serif italic text-botanical">Verdelle</em> journal
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">Grow your plant knowledge with expert tips, care guides and a little daily inspiration.</p>
          </div>
          <Link to="/blog" className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-forest/20 bg-white py-2 pl-6 pr-2 text-sm font-medium text-forest shadow-soft transition hover:border-forest hover:shadow-lift">
            View all articles
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          {/* featured post */}
          <article className="group relative isolate flex min-h-[420px] overflow-hidden rounded-3xl bg-forest shadow-float md:min-h-[520px]">
            <EditorialScene kind={lead.image} label={lead.title} className="absolute inset-0 -z-10 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/50 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">Featured · {lead.tag}</span>
            <div className="mt-auto p-6 text-white md:p-9">
              <PostMeta post={lead} light />
              <h3 className="mt-3 max-w-lg font-serif text-[28px] font-semibold leading-tight text-white md:text-[36px]">
                <Link to={`/blog/${lead.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-3 text-sm font-medium" aria-hidden="true">
                Read article
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-forest">
                  <ArrowUpRight size={17} />
                </span>
              </span>
            </div>
          </article>

          {/* list */}
          <ul className="flex flex-col gap-4">
            {rest.map((p) => (
              <li key={p.slug} className="flex-1">
                <article className="group relative flex h-full items-center gap-4 rounded-2xl border border-line/80 bg-white p-2.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/50 hover:shadow-lift sm:gap-5">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36">
                    <EditorialScene kind={p.image} label={p.title} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.08]" />
                  </div>
                  <div className="min-w-0 flex-1 py-1 pr-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sage">{p.tag}</p>
                    <h3 className="mt-1.5 line-clamp-2 font-serif text-[17px] font-semibold leading-snug text-ink sm:text-[19px]">
                      <Link to={`/blog/${p.slug}`} className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-botanical">
                        {p.title}
                      </Link>
                    </h3>
                    <div className="mt-2">
                      <PostMeta post={p} />
                    </div>
                  </div>
                  <span aria-hidden="true" className="mr-2 hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-forest/20 text-forest transition-all duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-white sm:grid">
                    <ArrowUpRight size={15} />
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
