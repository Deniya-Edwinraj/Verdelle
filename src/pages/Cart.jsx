import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, PackageCheck, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import ProductCarousel from '../components/products/ProductCarousel';
import { PageHero } from '../components/ui';
import { products } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';

function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
      <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
      {children}
    </p>
  );
}

export default function Cart() {
  usePageMeta('Your Cart');
  const { items, count, clear } = useCart();
  const suggestions = products.filter((p) => p.bestSeller).filter((p) => !items.some((i) => i.id === p.id));

  return (
    <>
      <PageHero
        eyebrow="Your basket"
        title="Your Cart"
        subtitle={count ? `${count} item${count > 1 ? 's' : ''} ready to find a new home.` : 'Nothing here yet — let’s find your next green companion.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]}
        plants={['snake', 'pothos']}
      />

      {items.length === 0 ? (
        <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
          <div className="relative isolate mx-auto flex max-w-2xl flex-col items-center overflow-hidden rounded-[32px] bg-white px-6 py-14 text-center shadow-lift ring-1 ring-line/70 md:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-mist blur-3xl" />
            <span className="grid h-20 w-20 place-items-center rounded-full bg-mist text-forest">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-7 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
              Your cart is <em className="font-normal italic text-botanical">empty</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">Find a leafy friend for every corner of your home.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical"
              >
                Continue shopping <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/wishlist" className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-medium text-forest transition hover:border-forest">
                View wishlist
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="container relative z-10 -mt-16 grid gap-8 pb-16 md:-mt-24 md:pb-24 lg:grid-cols-[1fr_400px] lg:gap-10">
          <div>
            {/* List header */}
            <div className="flex items-center justify-between gap-3 rounded-[24px] bg-white/90 px-5 py-4 shadow-lift ring-1 ring-white/60 backdrop-blur-xl sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">In your basket</p>
                <p className="mt-0.5 font-serif text-xl font-semibold text-forest">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={clear}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]"
              >
                <Trash2 size={14} /> Clear cart
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {items.map((i) => (
                <CartItem key={i.key} item={i} />
              ))}
            </ul>

            <Link
              to="/shop"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-forest shadow-soft transition hover:border-forest hover:bg-forest hover:text-white"
            >
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Continue shopping
            </Link>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary>
              <Link
                to="/checkout"
                className="group mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical hover:shadow-lift"
              >
                <Lock size={15} /> Proceed to checkout
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted">Taxes calculated at checkout where applicable.</p>
              <ul className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-5">
                {[
                  [ShieldCheck, 'Secure checkout'],
                  [PackageCheck, 'Packed with care'],
                ].map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-2 rounded-2xl bg-card/70 px-3 py-2.5 text-xs text-forest">
                    <Icon size={15} className="shrink-0 text-botanical" /> {label}
                  </li>
                ))}
              </ul>
            </OrderSummary>
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="section relative overflow-hidden bg-mist/40">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-white/70 blur-3xl" />
          <div className="container relative">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>You may also like</Eyebrow>
                <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                  Plant lovers also <em className="font-normal italic text-botanical">picked</em>
                </h2>
              </div>
              <Link to="/shop" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                Shop all plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ProductCarousel products={suggestions} label="Suggested products" />
          </div>
        </section>
      )}
    </>
  );
}
