import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { DemoNotice, EmptyState, money } from '../components/ui';
import { getProductById } from '../data/products';
import { ProductImage } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';

function readLast() {
  try {
    return JSON.parse(sessionStorage.getItem('gn_last_order'));
  } catch {
    return null;
  }
}

export default function OrderSuccess() {
  usePageMeta('Order Confirmed');
  const { state } = useLocation();
  const order = state?.order || readLast();

  if (!order)
    return (
      <EmptyState
        icon={Package}
        title="No recent order"
        body="We couldn’t find a recent order in this browser."
        action={
          <Link to="/shop" className="btn-primary">
            Start shopping
          </Link>
        }
      />
    );

  const a = order.address;
  return (
    <section className="container max-w-3xl py-12 md:py-16">
      <div className="text-center">
        <CheckCircle2 size={56} strokeWidth={1.3} className="mx-auto text-botanical" />
        <p className="eyebrow mt-5">Thank you, {a.firstName}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Your order is confirmed</h1>
        <p className="mt-3 text-muted">
          Order <strong className="text-ink">{order.number}</strong> · {new Date(order.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </div>
      <DemoNotice className="mx-auto mt-6 max-w-xl">
        This is a demo order number. No payment was taken and no confirmation email was sent to {order.email}.
      </DemoNotice>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line/70 bg-white">
        <ul className="divide-y divide-line px-6">
          {order.items.map((i) => {
            const p = getProductById(i.id);
            return (
              <li key={`${i.id}${i.size}`} className="flex items-center gap-4 py-4">
                {p && <span className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-card"><ProductImage product={p} className="h-full w-full" /></span>}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-muted">
                    {[i.size, i.pot].filter(Boolean).join(' · ')} × {i.qty}
                  </p>
                </div>
                <p className="text-sm">{money(i.unitPrice * i.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="space-y-2 border-t border-line bg-card/60 px-6 py-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount ({order.coupon})</dt><dd>−{money(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{order.shipping ? money(order.shipping) : 'Free'}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{money(order.total)}</dd></div>
        </dl>
        <div className="grid gap-6 border-t border-line px-6 py-5 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-1 font-semibold">Shipping to</p>
            <p className="text-muted">
              {a.firstName} {a.lastName}
              <br />
              {a.address1}
              {a.address2 && `, ${a.address2}`}
              <br />
              {a.city}, {a.state} {a.postcode}
              <br />
              {a.country}
            </p>
          </div>
          <div>
            <p className="mb-1 font-semibold">Delivery & payment</p>
            <p className="text-muted">
              {order.delivery}
              <br />
              {order.payment}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary px-7">
          Continue Shopping
        </Link>
        <Link to="/track-order" className="btn-outline px-7">
          Track this order
        </Link>
      </div>
    </section>
  );
}
