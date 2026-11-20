import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, Minus, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import { useCart, totals } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { products } from '../../data/products';
import { SITE } from '../../data/site';
import { ProductImage } from '../art/scenes';
import { money } from '../ui';

/** Slide-out mini cart, opened from the header and after "Add to cart". */
export default function CartDrawer() {
  const { cartOpen, setCartOpen, lastAdded } = useUI();
  const cart = useCart();
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const close = () => setCartOpen(false);

  useEffect(() => setCartOpen(false), [pathname, setCartOpen]);
  useEffect(() => {
    if (!cartOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => panelRef.current?.focus(), 30);
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const { after } = totals(cart, 'standard');
  const remaining = SITE.freeShippingThreshold - after;
  const pct = Math.min(100, (after / SITE.freeShippingThreshold) * 100);
  const suggestions = products.filter((p) => p.bestSeller && p.stock !== 'out-of-stock' && !cart.items.some((i) => i.id === p.id)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 animate-fade-in bg-forest-900/40 backdrop-blur-sm" onClick={close} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] animate-slide-in-right flex-col bg-warm shadow-[0_0_80px_-20px_rgba(11,36,24,0.6)] outline-none sm:inset-y-3 sm:right-3 sm:overflow-hidden sm:rounded-[28px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/70 bg-white px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Your basket</p>
            <p className="font-serif text-2xl font-semibold text-forest">
              Cart <em className="font-normal italic text-botanical">({cart.count})</em>
            </p>
          </div>
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full bg-card text-forest transition hover:rotate-90 hover:bg-forest hover:text-white" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Just added */}
        {lastAdded && cart.items.some((i) => i.id === lastAdded.product.id) && (
          <p className="flex items-center gap-2 bg-mist/70 px-6 py-3 text-sm text-forest">
            <CheckCircle2 size={16} className="shrink-0 text-botanical" />
            <span className="truncate">
              <strong>{lastAdded.product.name}</strong> added to your cart
            </span>
          </p>
        )}

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-mist text-forest">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-serif text-2xl text-ink">
              Your cart is <em className="italic text-botanical">empty</em>
            </p>
            <p className="mt-2 text-sm text-muted">Find a leafy friend for every corner of your home.</p>
            <Link to="/shop" onClick={close} className="group mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
              Start shopping <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/plant-finder" onClick={close} className="mt-3 text-sm font-medium text-forest underline-offset-4 hover:underline">
              Not sure? Try the Plant Finder
            </Link>
          </div>
        ) : (
          <>
            {/* Free delivery */}
            <div className="px-6 pt-5">
              <div className={`rounded-2xl p-4 ${remaining > 0 ? 'bg-white ring-1 ring-line/70' : 'bg-mist/70'}`}>
                <p className="flex items-center gap-2 text-xs text-forest">
                  <Truck size={15} className="shrink-0 text-botanical" />
                  {remaining > 0 ? (
                    <span>
                      Add <strong>{money(remaining)}</strong> more for free delivery
                    </span>
                  ) : (
                    <strong>You’ve unlocked free delivery</strong>
                  )}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card">
                  <div className="h-full rounded-full bg-gradient-to-r from-botanical to-sage transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            {/* Items */}
            <ul className="thin-scrollbar flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {cart.items.map((i) => {
                const justAdded = lastAdded && lastAdded.product.id === i.id && lastAdded.size === i.size && (lastAdded.pot || null) === (i.pot || null);
                return (
                  <li key={i.key} className={`flex gap-3 rounded-2xl bg-white p-2.5 ring-1 transition ${justAdded ? 'ring-sage shadow-soft' : 'ring-line/70'}`}>
                    <Link to={`/product/${i.product.slug}`} onClick={close} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-card">
                      <ProductImage product={i.product} className="h-full w-full" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/product/${i.product.slug}`} onClick={close} className="block truncate font-serif text-[15px] font-semibold text-ink hover:text-botanical">
                            {i.product.name}
                          </Link>
                          <p className="truncate text-[11px] text-muted">{[i.size, i.pot].filter(Boolean).join(' · ')}</p>
                        </div>
                        <button onClick={() => cart.remove(i.key)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]" aria-label={`Remove ${i.product.name}`}>
                          <X size={14} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex h-8 items-center rounded-full bg-card p-0.5" role="group" aria-label={`Quantity for ${i.product.name}`}>
                          <button onClick={() => cart.update(i.key, Math.max(1, i.qty - 1))} disabled={i.qty <= 1} className="grid h-7 w-7 place-items-center rounded-full text-forest hover:bg-white disabled:opacity-35" aria-label="Decrease quantity">
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums">{i.qty}</span>
                          <button onClick={() => cart.update(i.key, Math.min(10, i.qty + 1))} disabled={i.qty >= 10} className="grid h-7 w-7 place-items-center rounded-full text-forest hover:bg-white disabled:opacity-35" aria-label="Increase quantity">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-serif text-base font-semibold text-forest">{money(i.lineTotal)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}

              {suggestions.length > 0 && (
                <li className="pt-3">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">You may also like</p>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestions.map((p) => (
                      <Link key={p.id} to={`/product/${p.slug}`} onClick={close} className="group overflow-hidden rounded-xl bg-white ring-1 ring-line/70">
                        <ProductImage product={p} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
                        <span className="block truncate px-2 pt-1.5 text-[11px] font-medium text-ink">{p.name}</span>
                        <span className="block px-2 pb-2 text-[11px] text-forest">{money(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                </li>
              )}
            </ul>

            {/* Footer */}
            <div className="border-t border-line/70 bg-white px-6 py-5">
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-serif text-2xl font-semibold leading-none text-forest">{money(cart.subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted">Delivery and discounts calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={close} className="inline-flex h-12 items-center justify-center rounded-full border border-line text-sm font-semibold text-forest transition hover:border-forest">
                  View cart
                </Link>
                <Link to="/checkout" onClick={close} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical">
                  <Lock size={14} /> Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
