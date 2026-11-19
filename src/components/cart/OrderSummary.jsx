import { useState } from 'react';
import { Tag, X } from 'lucide-react';
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
      <div className="flex items-center justify-between rounded-md bg-mist px-3 py-2 text-sm text-forest">
        <span className="flex items-center gap-2">
          <Tag size={14} /> <strong>{coupon}</strong> — {couponInfo.label}
        </span>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="rounded p-1 hover:bg-white/60">
          <X size={14} />
        </button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return setErr('Enter a code');
        if (!applyCoupon(code)) setErr('That code isn’t valid. Try GREEN10 (demo).');
        else {
          setErr('');
          setCode('');
        }
      }}
    >
      <label htmlFor="coupon" className="label">Discount code</label>
      <div className="flex gap-2">
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} className={`field h-10 flex-1 uppercase ${err ? 'field-error' : ''}`} placeholder="Enter code" aria-invalid={!!err} aria-describedby="coupon-msg" />
        <button className="btn-outline h-10 px-4">Apply</button>
      </div>
      <p id="coupon-msg" className="mt-1 min-h-[16px] text-xs text-red-800" aria-live="polite">{err}</p>
    </form>
  );
}

export default function OrderSummary({ method = 'standard', showItems = false, children }) {
  const cart = useCart();
  const { after, shipping, total } = totals(cart, method);
  const remaining = SITE.freeShippingThreshold - after;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-line/70">
      <h2 className="text-2xl font-semibold">Order Summary</h2>
      {showItems && (
        <ul className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
          {cart.items.map((i) => (
            <li key={i.key} className="flex items-center gap-3">
              <span className="relative shrink-0">
                <span className="block h-14 w-14 overflow-hidden rounded-md bg-card">
                  <ProductImage product={i.product} className="h-full w-full" />
                </span>
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[10px] text-white">{i.qty}</span>
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-medium">{i.product.name}</span>
                <span className="block truncate text-xs text-muted">{[i.size, i.pot].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="text-sm">{money(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5">
        <CouponForm />
      </div>
      <dl className="mt-3 space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{money(cart.subtotal)}</dd>
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
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : money(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>
      {method === 'standard' && remaining > 0 && after > 0 && (
        <div className="mt-4">
          <p className="text-xs text-muted">
            You’re <strong className="text-forest">{money(remaining)}</strong> away from free delivery.
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full bg-botanical" style={{ width: `${Math.min(100, (after / SITE.freeShippingThreshold) * 100)}%` }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
