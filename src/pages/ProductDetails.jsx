import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Check, Droplets, Gauge, Heart, PawPrint, Package, RotateCcw, Share2, Sun, Thermometer, Truck, Wind } from 'lucide-react';
import { getProduct, relatedProducts, getProductById, PET } from '../data/products';
import { getGuide } from '../data/careGuides';
import { reviewsFor } from '../data/testimonials';
import { SITE } from '../data/site';
import ProductGallery from '../components/products/ProductGallery';
import OptionSelector from '../components/products/OptionSelector';
import ProductCarousel from '../components/products/ProductCarousel';
import { useProductActions } from '../components/products/ProductCard';
import { Breadcrumb, PetBadge, QuantitySelector, RatingStars, SectionHeading, money } from '../components/ui';
import { useCart, unitPriceFor } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { fmtDate } from '../utils/format';
import NotFound from './NotFound';

const STOCK = {
  'in-stock': { label: 'In stock — ships in 1–2 business days', cls: 'text-botanical', dot: 'bg-botanical' },
  'low-stock': { label: 'Only a few left', cls: 'text-clay', dot: 'bg-clay' },
  'out-of-stock': { label: 'Out of stock — check back soon', cls: 'text-muted', dot: 'bg-muted' },
};

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
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(([Icon, k, v]) => (
        <li key={k} className="rounded-lg bg-card p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Icon size={13} className="text-botanical" /> {k}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{v}</p>
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
  usePageMeta(product?.name, product?.description);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0].label);
    setPot(product.potOptions[0]?.label);
    setQty(1);
    setTab(0);
    trackView(product.id);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const actions = useProductActions(product || { id: '', stock: 'out-of-stock', name: '' });
  if (!product) return <NotFound />;

  const isPlant = product.type === 'plant';
  const price = unitPriceFor(product, size, pot);
  const stock = STOCK[product.stock];
  const guide = getGuide(product.careGuide);
  const related = relatedProducts(product);
  const recentlyViewed = recent.filter((id) => id !== product.id).map(getProductById).filter(Boolean).slice(0, 8);
  const reviews = reviewsFor(product);

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

  const TABS = isPlant ? ['Care instructions', 'Plant information', 'Shipping & returns', `Reviews (${product.reviewCount})`] : ['Details', 'Shipping & returns', `Reviews (${product.reviewCount})`];
  const panels = {
    'Care instructions': (
      <div className="space-y-4">
        <CareGrid p={product} />
        <p className="text-sm text-muted">
          Care needs vary with your climate, soil, pot and the season — treat these as starting points and adjust to what your plant tells you.
        </p>
        {guide && (
          <Link to={`/plant-care/${guide.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-forest underline underline-offset-4">
            <BookOpen size={15} /> Read our guide: {guide.title}
          </Link>
        )}
      </div>
    ),
    'Plant information': (
      <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        {[
          ['Botanical name', product.botanical],
          ['Plant type', product.plantType],
          ['Growth habit', product.growth],
          ['Approximate mature size', product.matureSize],
          ['Care difficulty', product.difficulty],
          ['Pet safety', PET[product.pet].detail],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
            <dd className="mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
    ),
    Details: (
      <ul className="space-y-2 text-sm">
        <li>Material: {product.botanical}</li>
        <li>Sizes: {product.sizes.map((s) => `${s.label} (${s.detail})`).join(', ')}</li>
      </ul>
    ),
    'Shipping & returns': (
      <div className="space-y-3 text-sm">
        <p>{product.shipping}</p>
        <p>
          Free standard delivery on orders over {money(SITE.freeShippingThreshold)}. {isPlant ? 'Live plants are eligible for a free replacement if they arrive damaged — contact us within 7 days with a photo.' : 'Unused planters can be returned within 30 days.'}{' '}
          <Link to="/shipping-returns" className="text-forest underline">Full policy</Link>.
        </p>
      </div>
    ),
  };
  panels[TABS[TABS.length - 1]] = (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="font-serif text-4xl text-forest">{product.rating.toFixed(1)}</span>
        <div>
          <RatingStars rating={product.rating} size={15} />
          <p className="text-xs text-muted">{product.reviewCount} demo reviews</p>
        </div>
      </div>
      <ul className="divide-y divide-line">
        {reviews.map((r) => (
          <li key={r.id} className="py-4">
            <div className="flex items-center justify-between">
              <RatingStars rating={r.rating} size={12} />
              <span className="text-xs text-muted">{fmtDate(r.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <p className="mt-2 text-sm text-ink/85">{r.body}</p>
            <p className="mt-1 text-xs text-muted">{r.name}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">Illustrative reviews for this demo store.</p>
    </div>
  );

  return (
    <>
      <div className="container py-6 md:py-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: product.name }]} />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ProductGallery key={product.id} product={product} />
          </div>
          <div className="min-w-0">
            <p className="eyebrow">{product.plantType}</p>
            <h1 className="mt-2 text-[36px] font-semibold leading-tight md:text-[44px]">{product.name}</h1>
            <p className="text-sm italic text-muted">{product.botanical}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button onClick={() => setTab(TABS.length - 1)} className="inline-flex">
                <RatingStars rating={product.rating} count={`${product.reviewCount} reviews`} showValue size={15} />
              </button>
              {isPlant && <PetBadge status={product.pet} />}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-forest">{money(price.price)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-muted line-through">{money(price.regular)}</span>
                  <span className="rounded-full bg-forest px-2.5 py-0.5 text-xs font-semibold text-white">{SITE.saleName} −{Math.round(product.discount * 100)}%</span>
                  {pot && pot !== product.potOptions[0]?.label && <span className="text-xs text-muted">(planter at full price)</span>}
                </>
              )}
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{product.description}</p>
            {isPlant && (
              <ul className="mt-4 grid gap-1 text-sm text-muted sm:grid-cols-2">
                <li><span className="text-ink">Growth:</span> {product.growth}</li>
                <li><span className="text-ink">Mature size:</span> {product.matureSize}</li>
              </ul>
            )}

            <div className="mt-6 space-y-5">
              <OptionSelector legend="Size" options={product.sizes} value={size} onChange={setSize} />
              {product.potOptions.length > 0 && <OptionSelector legend="Pot" options={product.potOptions} value={pot} onChange={setPot} priceMode="addon" />}
              <p className={`flex items-center gap-2 text-sm ${stock.cls}`}>
                <span className={`h-2 w-2 rounded-full ${stock.dot}`} /> {stock.label}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <QuantitySelector value={qty} onChange={setQty} />
                <button className="btn-primary h-11 min-w-[160px] flex-1" disabled={actions.outOfStock} onClick={() => actions.addToCart({ size, pot, qty })}>
                  {actions.outOfStock ? 'Out of stock' : `Add to Cart · ${money(price.price * qty)}`}
                </button>
                <button onClick={actions.toggleWish} aria-pressed={actions.wished} aria-label={actions.wished ? 'Remove from wishlist' : 'Add to wishlist'} className="grid h-11 w-11 place-items-center rounded-md border border-line text-forest hover:bg-mist/60">
                  <Heart size={18} fill={actions.wished ? 'currentColor' : 'none'} />
                </button>
                <button onClick={share} aria-label="Share" className="grid h-11 w-11 place-items-center rounded-md border border-line text-forest hover:bg-mist/60">
                  <Share2 size={17} />
                </button>
              </div>
              <button
                className="btn-outline h-11 w-full"
                disabled={actions.outOfStock}
                onClick={() => {
                  add(product, { size, pot, qty });
                  navigate('/checkout');
                }}
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6 rounded-card border border-line p-5">
              <h2 className="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
                <Package size={16} className="text-botanical" /> What you’ll receive
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/85">
                {(isPlant
                  ? [`One ${product.name} (${size}) in a nursery grow pot`, pot && pot !== product.potOptions[0].label ? `${pot}, packed separately` : 'Drop it into any planter with drainage', 'A printed care card', 'Recyclable, plastic-light packaging']
                  : [`${product.name} — ${size}`, 'Drainage hole and saucer', 'Recycled paper padding']
                )
                  .filter(Boolean)
                  .map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-botanical" /> {t}
                    </li>
                  ))}
              </ul>
              <div className="mt-4 grid gap-2 border-t border-line pt-4 text-sm text-muted sm:grid-cols-2">
                <p className="flex items-center gap-2"><Truck size={16} className="text-forest" /> Free delivery over {money(SITE.freeShippingThreshold)}</p>
                <p className="flex items-center gap-2"><RotateCcw size={16} className="text-forest" /> {isPlant ? 'Arrival guarantee' : '30-day returns'}</p>
              </div>
            </div>

            <div className="mt-8">
              <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line">
                {TABS.map((t, i) => (
                  <button key={t} role="tab" id={`tab-${i}`} aria-selected={tab === i} aria-controls={`panel-${i}`} onClick={() => setTab(i)} className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium ${tab === i ? 'border-forest text-forest' : 'border-transparent text-muted hover:text-ink'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="py-5 text-[15px] leading-relaxed">
                {panels[TABS[tab]]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section bg-card/60" aria-labelledby="rel">
        <div className="container">
          <SectionHeading title={<span id="rel">You may also love</span>} />
          <ProductCarousel products={related} label="Related plants" />
        </div>
      </section>
      {recentlyViewed.length > 0 && (
        <section className="section" aria-labelledby="recent">
          <div className="container">
            <SectionHeading title={<span id="recent">Recently viewed</span>} />
            <ProductCarousel products={recentlyViewed} label="Recently viewed" />
          </div>
        </section>
      )}
    </>
  );
}
