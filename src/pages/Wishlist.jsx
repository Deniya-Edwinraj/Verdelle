import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Info, PackageCheck, ShoppingBag, Wallet } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';
import { PageHero, money } from '../components/ui';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useUI } from '../context/UIContext';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Wishlist() {
  usePageMeta('Wishlist');
  const { ids } = useWishlist();
  const { add } = useCart();
  const notify = useToast();
  const { openCart } = useUI();
  const items = ids.map(getProductById).filter(Boolean);
  const available = items.filter((p) => p.stock !== 'out-of-stock');
  const total = available.reduce((sum, p) => sum + p.price, 0);

  const addAll = () => {
    available.forEach((p) => add(p));
    notify(`${available.length} item${available.length > 1 ? 's' : ''} added to your cart`);
    openCart();
  };

  return (
    <>
      <PageHero
        eyebrow="Saved for later"
        title="Your Wishlist"
        subtitle={items.length ? `${items.length} plant${items.length > 1 ? 's' : ''} you’ve fallen for — ready whenever you are.` : 'A little corner for the plants you love.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        plants={['peace-lily', 'monstera']}
      />

      {items.length ? (
        <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
          {/* Summary bar */}
          <div className="grid gap-4 rounded-[28px] bg-white/90 p-4 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center md:p-5">
            <ul className="grid grid-cols-3 divide-x divide-line/80">
              {[
                [Heart, 'Saved', items.length],
                [PackageCheck, 'Available', available.length],
                [Wallet, 'Total value', money(total)],
              ].map(([Icon, label, value]) => (
                <li key={label} className="flex items-center gap-3 px-2 first:pl-1 sm:px-5">
                  <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest sm:grid">
                    <Icon size={19} strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
                    <span className="mt-0.5 block font-serif text-xl font-semibold text-forest md:text-2xl">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-medium text-forest transition hover:border-forest"
              >
                Keep browsing
              </Link>
              {available.length > 0 && (
                <button
                  type="button"
                  onClick={addAll}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical"
                >
                  <ShoppingBag size={16} /> Add all to cart
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 mt-14 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                Your collection
              </p>
              <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                Plants you <em className="font-normal italic text-botanical">love</em>
              </h2>
            </div>
            {available.length < items.length && (
              <p className="text-sm text-muted">
                {items.length - available.length} sold out — we’ll keep {items.length - available.length > 1 ? 'them' : 'it'} here for you.
              </p>
            )}
          </div>

          <ProductGrid products={items} />

          <p className="mx-auto mt-12 flex w-fit items-center gap-2 rounded-full bg-mist/60 px-4 py-2 text-xs text-forest">
            <Info size={14} /> Your wishlist is saved for your next visit.
          </p>
        </section>
      ) : (
        <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
          <div className="relative isolate mx-auto flex max-w-2xl flex-col items-center overflow-hidden rounded-[32px] bg-white px-6 py-14 text-center shadow-lift ring-1 ring-line/70 md:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-mist blur-3xl" />
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-mist text-clay">
              <span aria-hidden="true" className="absolute inset-0 rounded-full ring-1 ring-sage-soft motion-safe:animate-ping" style={{ animationDuration: '2.4s' }} />
              <Heart size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-7 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
              Your wishlist is <em className="font-normal italic text-botanical">empty</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
              Tap the <Heart size={13} className="mx-0.5 inline -translate-y-px text-clay" fill="currentColor" /> on any plant to save it here for later.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical"
              >
                Explore plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop/easy-care"
                className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-medium text-forest transition hover:border-forest"
              >
                Easy-care picks
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
