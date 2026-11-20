import { useState } from 'react';
import { Tag, Truck, X } from 'lucide-react';
import { useCart, totals } from '../../context/CartContext';
import { SITE } from '../../data/site';
import { money } from '../ui';
import { ProductImage } from '../art/scenes';

export { totals };

export function CouponForm() {
  const { applyCoupon, coupon, couponInfo, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  if (coupon)
    return (
      <div className="flex items-center justify-between rounded-full bg-mist px-4 py-2.5 text-sm text-forest">
        <span className="flex items-center gap-2">
          <Tag size={14} /> <strong>{coupon}</strong> — {couponInfo.label}
        </span>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="rounded-full p-1 hover:bg-white/60">
          <X size={14} />
        </button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return setErr('Enter a code');
        if (!applyCoupon(code)) setErr('That code isn’t valid or has expired.');
        else {
          setErr('');
          setCode('');
        }
      }}
    >
      <label htmlFor="coupon" className="label">Discount code</label>
      <div className={`flex items-center gap-1 rounded-full bg-card p-1 ring-1 transition focus-within:bg-white focus-within:ring-forest ${err ? 'ring-red-700' : 'ring-line/70'}`}>
        <Tag size={15} className="ml-3 shrink-0 text-muted" aria-hidden="true" />
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm uppercase outline-none placeholder:normal-case placeholder:text-muted"
          placeholder="Enter code"
          aria-invalid={!!err}
          aria-describedby="coupon-msg"
        />
        <button className="h-9 rounded-full bg-forest px-5 text-xs font-semibold text-white transition hover:bg-botanical">Apply</button>
      </div>
      <p id="coupon-msg" className="mt-1 min-h-[16px] text-xs text-red-800" aria-live="polite">{err}</p>
    </form>
  );
}

export default function OrderSummary({ method = 'standard', showItems = false, giftWrap = false, children }) {
  const cart = useCart();
  const { after, shipping, gift, total } = totals(cart, method, { giftWrap });
  const remaining = SITE.freeShippingThreshold - after;
  const pct = Math.min(100, (after / SITE.freeShippingThreshold) * 100);
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-line/70 md:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mist blur-3xl" />
      <div className="relative">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
          <span aria-hidden="true" className="h-px w-8 bg-botanical/60" />
          Checkout
        </p>
        <h2 className="mt-2 text-[28px] font-medium tracking-tight">
          Order <em className="font-normal italic text-botanical">summary</em>
        </h2>

        {method === 'standard' && after > 0 && (
          <div className={`mt-5 rounded-2xl p-4 ${remaining > 0 ? 'bg-card/70' : 'bg-mist/70'}`}>
            <p className="flex items-center gap-2 text-xs text-forest">
              <Truck size={15} className="shrink-0 text-botanical" />
              {remaining > 0 ? (
                <span>
                  You’re <strong>{money(remaining)}</strong> away from free delivery
                </span>
              ) : (
                <strong>You’ve unlocked free delivery</strong>
              )}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-botanical to-sage transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {showItems && (
          <ul className="thin-scrollbar mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
            {cart.items.map((i) => (
              <li key={i.key} className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <span className="block h-14 w-14 overflow-hidden rounded-xl bg-card">
                    <ProductImage product={i.product} className="h-full w-full" />
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[10px] text-white ring-2 ring-white">{i.qty}</span>
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-medium">{i.product.name}</span>
                  <span className="block truncate text-xs text-muted">{[i.size, i.pot].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="text-sm font-medium">{money(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <CouponForm />
        </div>

        <dl className="mt-3 space-y-3 border-t border-dashed border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium">{money(cart.subtotal)}</dd>
          </div>
          {cart.saleSavings > 0 && (
            <div className="flex justify-between text-xs text-botanical">
              <dt>{SITE.saleName} savings (included)</dt>
              <dd>{money(cart.saleSavings)}</dd>
            </div>
          )}
          {cart.discount > 0 && (
            <div className="flex justify-between text-forest">
              <dt>Discount ({cart.coupon})</dt>
              <dd>−{money(cart.discount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className={shipping === 0 ? 'rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-forest' : 'font-medium'}>{shipping === 0 ? 'Free' : money(shipping)}</dd>
          </div>
          {gift > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">{SITE.giftWrap.label}</dt>
              <dd className="font-medium">{money(gift)}</dd>
            </div>
          )}
          <div className="flex items-end justify-between border-t border-line pt-4">
            <dt className="text-sm font-semibold">Total</dt>
            <dd className="font-serif text-[28px] font-semibold leading-none text-forest">{money(total)}</dd>
          </div>
        </dl>
        {children}
      </div>
    </div>
  );
}
