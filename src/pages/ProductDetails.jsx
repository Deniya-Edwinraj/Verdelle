import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Check, Droplets, Gauge, Heart, Lock, Minus, Package, PawPrint, Plus, RotateCcw, Scale, Share2, ShoppingBag, Sparkles, Sun, Thermometer, Truck, Wind, Zap,
} from 'lucide-react';
import { BoughtTogether, CareReminder, DeliveryEstimate, ReviewsPanel, StockAlert } from '../components/products/ProductExtras';
import { getProduct, relatedProducts, getProductById, PET } from '../data/products';
import { getGuide } from '../data/careGuides';
import { PHOTOS } from '../data/assets';
import { reviewsFor } from '../data/testimonials';
import { SITE } from '../data/site';
import ProductGallery from '../components/products/ProductGallery';
import OptionSelector from '../components/products/OptionSelector';
import ProductCarousel from '../components/products/ProductCarousel';
import { useProductActions } from '../components/products/ProductCard';
import { Breadcrumb, RatingStars, money } from '../components/ui';
import { useCart, unitPriceFor } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

const STOCK = {
  'in-stock': { label: 'In stock — ready to ship', cls: 'text-botanical', dot: 'bg-botanical' },
  'low-stock': { label: 'Only a few left — order soon', cls: 'text-clay', dot: 'bg-clay' },
  'out-of-stock': { label: 'Sold out — new stock is growing', cls: 'text-muted', dot: 'bg-muted' },
};

function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
      <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
      {children}
    </p>
  );
}

function CareGrid({ p }) {
  const items = [
    [Sun, 'Light', p.light.join(', ')],
    [Droplets, 'Watering', p.watering],
    [Wind, 'Humidity', p.humidity],
    [Thermometer, 'Temperature', p.temperature],
    [Gauge, 'Care level', p.difficulty],
    [PawPrint, 'Pet safety', PET[p.pet].label],
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map(([Icon, k, v]) => (
        <li key={k} className="rounded-2xl bg-card/70 p-4 ring-1 ring-line/60">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-botanical shadow-sm">
            <Icon size={16} />
          </span>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{k}</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">{v}</p>
        </li>
      ))}
    </ul>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const navigate = useNavigate();
  const { add } = useCart();
  const { trackView, recent } = useWishlist();
  const notify = useToast();
  const [size, setSize] = useState(product?.sizes[0].label);
  const [pot, setPot] = useState(product?.potOptions[0]?.label);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef(null);
  const tabsRef = useRef(null);
  usePageMeta(product?.name, product?.description, { image: product ? PHOTOS.products?.[product.slug] : undefined, type: 'product' });

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0].label);
    setPot(product.potOptions[0]?.label);
    setQty(1);
    setTab(0);
    trackView(product.id);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show the sticky mobile bar once the main buy buttons scroll out of view.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  const actions = useProductActions(product || { id: '', stock: 'out-of-stock', name: '', sizes: [{ label: '' }], potOptions: [] });
  if (slug === 'gift-card') return <Navigate to="/gift-cards" replace />;
  if (!product) return <NotFound />;

  const isPlant = product.type === 'plant';
  const price = unitPriceFor(product, size, pot);
  const stock = STOCK[product.stock];
  const guide = getGuide(product.careGuide);
  const related = relatedProducts(product);
  const recentlyViewed = recent.filter((id) => id !== product.id).map(getProductById).filter(Boolean).slice(0, 8);
  const reviews = reviewsFor(product);
  const addToCart = () => actions.addToCart({ size, pot, qty });

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        notify('Link copied to clipboard');
      }
    } catch {
      /* cancelled */
    }
  };

  const openReviews = () => {
    setTab(TABS.length - 1);
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const badge = actions.outOfStock
    ? ['Sold out', 'bg-ink/80 text-white']
    : product.discount
      ? [`${SITE.saleName} −${Math.round(product.discount * 100)}%`, 'bg-clay text-white']
      : product.isNew
        ? ['New arrival', 'bg-forest text-white']
        : product.bestSeller
          ? ['Bestseller', 'bg-white/90 text-forest']
          : null;

  const TABS = isPlant ? ['Care guide', 'Plant details', 'Delivery & returns', `Reviews (${product.reviewCount})`] : ['Details', 'Delivery & returns', `Reviews (${product.reviewCount})`];
  const panels = {
    'Care guide': (
      <div className="space-y-5">
        <CareGrid p={product} />
        <p className="text-sm leading-relaxed text-muted">Care needs vary with your climate, soil, pot and the season — treat these as starting points and adjust to what your plant tells you.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <CareReminder product={product} />
          {guide && (
            <Link
              to={`/plant-care/${guide.slug}`}
              className="group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-forest-900 p-5 text-white"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-10 -z-10 h-36 w-36 rounded-full bg-botanical/60 blur-2xl" />
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sage-soft">
                <BookOpen size={18} />
              </span>
              <span className="mt-4">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Read the guide</span>
                <span className="mt-1 block font-serif text-lg leading-snug">{guide.title}</span>
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-soft">
                {guide.minutes} min read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </div>
    ),
    'Plant details': (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ['Botanical name', <em key="b">{product.botanical}</em>],
          ['Plant type', product.plantType],
          ['Growth habit', product.growth],
          ['Approximate mature size', product.matureSize],
          ['Care difficulty', product.difficulty],
          ['Pet safety', PET[product.pet].detail],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-card/60 p-4 ring-1 ring-line/60">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{k}</dt>
            <dd className="mt-1 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    ),
    Details: (
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ['Material', product.botanical],
          ['Sizes', product.sizes.map((s) => `${s.label} (${s.detail})`).join(', ')],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-card/60 p-4 ring-1 ring-line/60">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{k}</dt>
            <dd className="mt-1 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    ),
    'Delivery & returns': (
      <div className="grid gap-3 md:grid-cols-3">
        {[
          [Package, 'Packed with care', product.shipping],
          [Truck, 'Delivery', `Standard ${money(SITE.shipping.standard.price)} — free on orders over ${money(SITE.freeShippingThreshold)}. Express ${money(SITE.shipping.express.price)}.`],
          [
            RotateCcw,
            isPlant ? `${SITE.guaranteeDays}-day plant guarantee` : '30-day returns',
            isPlant ? `Damaged on arrival or not settling in? Send us a photo within ${SITE.guaranteeDays} days of delivery for a free replacement or refund.` : 'Unused planters can be returned within 30 days in their original condition.',
          ],
        ].map(([Icon, t, b]) => (
          <div key={t} className="rounded-2xl bg-card/60 p-5 ring-1 ring-line/60">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-botanical shadow-sm">
              <Icon size={18} />
            </span>
            <p className="mt-3 font-semibold text-ink">{t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{b}</p>
          </div>
        ))}
        <Link to="/shipping-returns" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest md:col-span-3">
          Read the full Shipping & Returns policy <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    ),
  };
  panels[TABS[TABS.length - 1]] = <ReviewsPanel product={product} seeded={reviews} />;

  const highlights = isPlant
    ? [
        [Sun, p => p.light[0], 'Light'],
        [Droplets, p => p.watering.replace('Every ', ''), 'Water'],
        [Gauge, p => p.difficulty, 'Care'],
        [PawPrint, p => (p.pet === 'safe' ? 'Pet-friendly' : p.pet === 'toxic' ? 'Not pet-safe' : 'Check first'), 'Pets'],
      ]
    : [];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-mist/70 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-card blur-3xl" />

        <div className="container relative py-6 md:py-10">
          <div className="inline-flex rounded-full bg-white/80 px-4 py-1.5 shadow-soft ring-1 ring-line/60 backdrop-blur">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: product.name }]} />
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {/* Gallery */}
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <ProductGallery
                key={product.id}
                product={product}
                badge={badge && <span className={`pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm ${badge[1]}`}>{badge[0]}</span>}
              />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <Eyebrow>{product.plantType}</Eyebrow>
              <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-tight md:text-[54px]">{product.name}</h1>
              <p className="mt-1 font-serif text-lg italic text-muted">{product.botanical}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={openReviews} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-line/70 transition hover:ring-sage">
                  <RatingStars rating={product.rating} size={13} />
                  <span className="text-xs font-semibold text-ink">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({product.reviewCount} reviews)</span>
                </button>
                {isPlant && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                      product.pet === 'safe' ? 'bg-mist text-forest' : product.pet === 'toxic' ? 'bg-[#F6E7DF] text-[#8A3B1E]' : 'bg-card text-muted'
                    }`}
                  >
                    <PawPrint size={13} /> {PET[product.pet].label}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="font-serif text-[40px] font-semibold leading-none text-forest">{money(price.price)}</span>
                {product.discount > 0 && (
                  <>
                    <span className="pb-1 text-lg text-muted line-through">{money(price.regular)}</span>
                    <span className="mb-1 rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold text-clay">Save {money(price.regular - price.price)}</span>
                  </>
                )}
              </div>
              {product.discount > 0 && pot && pot !== product.potOptions[0]?.label && <p className="mt-1 text-xs text-muted">Planter add-on is charged at full price.</p>}

              <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{product.description}</p>

              {/* Highlights */}
              {highlights.length > 0 && (
                <ul className="mt-6 grid grid-cols-4 divide-x divide-line/80 rounded-2xl bg-white py-3 shadow-soft ring-1 ring-line/60">
                  {highlights.map(([Icon, get, label]) => (
                    <li key={label} className="flex flex-col items-center px-1 text-center">
                      <Icon size={17} className="text-botanical" />
                      <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
                      <span className="mt-0.5 line-clamp-1 text-xs font-semibold text-ink">{get(product)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Options */}
              <div className="mt-7 space-y-5">
                <OptionSelector legend="Size" options={product.sizes} value={size} onChange={setSize} />
                {product.potOptions.length > 0 && <OptionSelector legend="Pot" options={product.potOptions} value={pot} onChange={setPot} priceMode="addon" />}
              </div>

              <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${stock.cls}`}>
                <span className="relative flex h-2.5 w-2.5">
                  {product.stock !== 'out-of-stock' && <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping ${stock.dot}`} />}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${stock.dot}`} />
                </span>
                {stock.label}
              </p>

              {/* Buy */}
              <div ref={buyRef} className="mt-4 rounded-[24px] bg-white p-4 shadow-lift ring-1 ring-line/60 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-12 items-center rounded-full bg-card p-1 ring-1 ring-line/70" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-white disabled:opacity-35" aria-label="Decrease quantity">
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10} className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-white disabled:opacity-35" aria-label="Increase quantity">
                      <Plus size={15} />
                    </button>
                  </div>
                  <button
                    className="group inline-flex h-12 min-w-[180px] flex-1 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical hover:shadow-lift disabled:translate-y-0 disabled:bg-line disabled:text-muted disabled:shadow-none"
                    disabled={actions.outOfStock}
                    onClick={addToCart}
                  >
                    <ShoppingBag size={16} />
                    {actions.outOfStock ? 'Sold out' : `Add to cart · ${money(price.price * qty)}`}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/70 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
                    disabled={actions.outOfStock}
                    onClick={() => {
                      add(product, { size, pot, qty });
                      navigate('/checkout');
                    }}
                  >
                    <Zap size={15} /> Buy now
                  </button>
                  {[
                    [Heart, actions.toggleWish, actions.wished, actions.wished ? 'Remove from wishlist' : 'Add to wishlist', 'text-clay'],
                    ...(isPlant ? [[Scale, actions.toggleCompare, actions.compared, actions.compared ? 'Remove from compare' : 'Add to compare', 'text-white']] : []),
                    [Share2, share, false, 'Share', ''],
                  ].map(([Icon, fn, on, label, onCls]) => (
                    <button
                      key={label}
                      onClick={fn}
                      aria-pressed={label === 'Share' ? undefined : on}
                      aria-label={label}
                      title={label}
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 transition ${
                        on ? (Icon === Heart ? 'bg-[#F6E7DF] ring-[#F6E7DF] ' + onCls : 'bg-forest ring-forest ' + onCls) : 'bg-white text-forest ring-line hover:ring-forest'
                      }`}
                    >
                      <Icon size={17} fill={Icon === Heart && on ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <div className="mt-4">{actions.outOfStock ? <StockAlert product={product} /> : <DeliveryEstimate />}</div>
              </div>

              {/* What you'll receive */}
              <div className="mt-5 rounded-[24px] bg-card/60 p-5 ring-1 ring-line/60">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70">
                  <Sparkles size={14} className="text-botanical" /> What you’ll receive
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-ink/80 sm:grid-cols-2">
                  {(isPlant
                    ? [`One ${product.name} (${size})`, pot && pot !== product.potOptions[0].label ? `${pot}, packed separately` : 'Nursery grow pot', 'A printed care card', 'Recyclable, plastic-light packaging']
                    : [`${product.name} — ${size}`, 'Drainage hole and saucer', 'Recycled paper padding']
                  )
                    .filter(Boolean)
                    .map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-botanical">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        {t}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Trust */}
              <ul className="mt-5 grid grid-cols-3 gap-2">
                {[
                  [Truck, `Free delivery over ${money(SITE.freeShippingThreshold)}`],
                  [RotateCcw, isPlant ? `${SITE.guaranteeDays}-day guarantee` : '30-day returns'],
                  [Lock, 'Secure checkout'],
                ].map(([Icon, t]) => (
                  <li key={t} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 text-center text-[11px] font-medium leading-tight text-ink/75 ring-1 ring-line/60">
                    <Icon size={17} className="text-botanical" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Tabs ---------- */}
      <section ref={tabsRef} className="container scroll-mt-24 py-12 md:py-16">
        <div className="rounded-[32px] bg-white p-4 shadow-soft ring-1 ring-line/70 sm:p-6 md:p-8">
          <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-card/70 p-1">
            {TABS.map((t, i) => (
              <button
                key={t}
                role="tab"
                id={`tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`panel-${i}`}
                onClick={() => setTab(i)}
                className={`flex-1 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${tab === i ? 'bg-forest text-white shadow-soft' : 'text-ink/70 hover:bg-white hover:text-forest'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={tab} className="pt-6 text-[15px] leading-relaxed motion-safe:animate-fade-in md:pt-8">
            {panels[TABS[tab]]}
          </div>
        </div>
      </section>

      <BoughtTogether product={product} />

      {/* ---------- Related ---------- */}
      <section className="section relative overflow-hidden bg-mist/40" aria-labelledby="rel">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-white/70 blur-3xl" />
        <div className="container relative">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>You may also love</Eyebrow>
              <h2 id="rel" className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                Plants that pair <em className="font-normal italic text-botanical">beautifully</em>
              </h2>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
              Shop all plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ProductCarousel products={related} label="Related plants" />
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="section" aria-labelledby="recent">
          <div className="container">
            <div className="mb-10">
              <Eyebrow>Picking up where you left off</Eyebrow>
              <h2 id="recent" className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                Recently <em className="font-normal italic text-botanical">viewed</em>
              </h2>
            </div>
            <ProductCarousel products={recentlyViewed} label="Recently viewed" />
          </div>
        </section>
      )}

      {/* ---------- Sticky mobile buy bar ---------- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-line/70 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_-12px_rgba(11,36,24,0.25)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[15px] font-semibold text-ink">{product.name}</p>
            <p className="truncate text-xs text-muted">
              {[size, pot && pot !== product.potOptions[0]?.label ? pot : null].filter(Boolean).join(' · ')} · <span className="font-semibold text-forest">{money(price.price)}</span>
            </p>
          </div>
          <button
            onClick={addToCart}
            disabled={actions.outOfStock}
            tabIndex={showSticky ? 0 : -1}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-botanical disabled:bg-line disabled:text-muted"
          >
            <ShoppingBag size={15} /> {actions.outOfStock ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </>
  );
}
