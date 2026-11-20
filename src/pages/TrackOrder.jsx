import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Box, CheckCircle2, ClipboardCheck, Home, MapPin, PackageSearch, Search, Sprout, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProduct } from '../data/products';
import { SITE } from '../data/site';
import { ProductImage } from '../components/art/scenes';
import { PageHero, money } from '../components/ui';
import { addBusinessDays, dispatchDate, fmtDay } from '../utils/delivery';
import { usePageMeta } from '../hooks/usePageMeta';

const SAMPLE_NUMBER = 'VD-SAMPLE';

/** A sample order so the tracking page can be shown before any order is placed. */
function sampleOrder() {
  const placed = new Date();
  placed.setDate(placed.getDate() - 2);
  return {
    number: SAMPLE_NUMBER,
    date: placed.toISOString(),
    sample: true,
    delivery: SITE.shipping.standard.label,
    items: [
      { slug: 'monstera-deliciosa', name: 'Monstera Deliciosa', size: 'Medium', pot: 'Matte ceramic planter', qty: 1, unitPrice: 48 },
      { slug: 'pothos', name: 'Pothos', size: 'Small', pot: null, qty: 2, unitPrice: 18 },
    ],
    total: 84,
    address: { firstName: 'Alex', city: 'Portland', state: 'OR', postcode: '97205', country: 'United States' },
  };
}

const STEPS = [
  { key: 'placed', label: 'Order placed', body: 'We’ve received your order.', icon: ClipboardCheck },
  { key: 'packed', label: 'Packed with care', body: 'Soil secured, leaves supported, box sealed.', icon: Box },
  { key: 'shipped', label: 'On its way', body: 'Handed to our courier.', icon: Truck },
  { key: 'delivered', label: 'Delivered', body: 'Unbox and give it a few days to settle.', icon: Home },
];

/** Works out where an order is from when it was placed (no live courier feed yet). */
function progress(order) {
  const placed = new Date(order.date);
  const express = /express/i.test(order.delivery || '');
  const dispatch = dispatchDate(placed);
  const shipped = new Date(dispatch);
  shipped.setHours(17, 0, 0, 0);
  const deliverFrom = addBusinessDays(dispatch, express ? 1 : 3);
  const deliverTo = addBusinessDays(dispatch, express ? 2 : 5);
  const now = new Date();
  const times = [placed, new Date(Math.max(placed.getTime() + 2 * 3600000, dispatch.getTime())), shipped, deliverFrom];
  let current = 0;
  times.forEach((t, i) => {
    if (now >= t) current = i;
  });
  return { current, times, deliverFrom, deliverTo };
}

export default function TrackOrder() {
  usePageMeta('Track Your Order', 'Follow your Verdelle plants from our greenhouse to your door.');
  const [params, setParams] = useSearchParams();
  const { orders } = useAuth();
  const [input, setInput] = useState(params.get('order') || '');
  const query = (params.get('order') || '').trim().toUpperCase();

  const order = query ? (query === SAMPLE_NUMBER ? sampleOrder() : orders.find((o) => o.number.toUpperCase() === query)) : null;
  const notFound = query && !order;

  const submit = (e) => {
    e.preventDefault();
    const v = input.trim();
    if (v) setParams({ order: v.toUpperCase() });
  };

  const p = order ? progress(order) : null;

  return (
    <>
      <PageHero
        eyebrow="Order tracking"
        title="Track your order"
        subtitle="Follow your plants from our greenhouse to your front door."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Track order' }]}
        plants={['areca', 'pothos']}
      />

      <section className="container relative z-10 -mt-16 max-w-5xl pb-16 md:-mt-24 md:pb-24">
        {/* Lookup */}
        <form onSubmit={submit} className="rounded-[28px] bg-white/90 p-4 shadow-lift ring-1 ring-white/60 backdrop-blur-xl sm:p-5" role="search">
          <label htmlFor="order-number" className="mb-2 block px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
            Order number
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-card/70 px-5 ring-1 ring-line/70 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-botanical/40">
              <PackageSearch size={18} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                id="order-number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. VD-12345678"
                className="h-full min-w-0 flex-1 bg-transparent text-sm uppercase outline-none placeholder:normal-case placeholder:text-muted/70"
                autoComplete="off"
              />
            </div>
            <button className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition hover:bg-botanical">
              <Search size={15} /> Track
            </button>
          </div>
          <p className="mt-3 px-2 text-xs text-muted">
            Your order number is in your confirmation email.
          </p>
        </form>

        {notFound && (
          <div className="mt-8 flex flex-col items-center rounded-[28px] bg-white px-6 py-12 text-center ring-1 ring-line/70">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mist text-forest">
              <PackageSearch size={26} strokeWidth={1.6} />
            </span>
            <p className="mt-5 font-serif text-2xl text-ink">
              We couldn’t find <em className="italic text-botanical">{query}</em>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Check the number in your confirmation email, or{' '}
              <Link to="/contact" className="font-medium text-forest underline">
                contact us
              </Link>{' '}
              and we’ll look it up for you.
            </p>
          </div>
        )}

        {order && p && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Timeline */}
            <div className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Order {order.number}</p>
                  <h2 className="mt-1 text-[28px] font-medium tracking-tight">
                    {p.current === 3 ? (
                      <>
                        <em className="font-normal italic text-botanical">Delivered</em>
                      </>
                    ) : (
                      <>
                        Arriving <em className="font-normal italic text-botanical">{fmtDay(p.deliverFrom)}</em>
                        {p.deliverTo.toDateString() !== p.deliverFrom.toDateString() && <span className="text-muted"> – {fmtDay(p.deliverTo)}</span>}
                      </>
                    )}
                  </h2>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest">{STEPS[p.current].label}</span>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-card" aria-hidden="true">
                <div className="h-full rounded-full bg-gradient-to-r from-botanical to-sage transition-all duration-700" style={{ width: `${12 + (p.current / 3) * 88}%` }} />
              </div>

              <ol className="relative mt-8 space-y-6">
                <span aria-hidden="true" className="absolute bottom-6 left-[23px] top-6 w-px bg-line" />
                {STEPS.map(({ key, label, body, icon: Icon }, i) => {
                  const state = i < p.current ? 'done' : i === p.current ? 'current' : 'todo';
                  return (
                    <li key={key} className="relative flex gap-4">
                      <span
                        className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ring-4 ring-white transition ${
                          state === 'done' ? 'bg-botanical text-white' : state === 'current' ? 'bg-forest text-white shadow-float' : 'bg-card text-muted'
                        }`}
                      >
                        {state === 'done' ? <CheckCircle2 size={20} /> : <Icon size={19} strokeWidth={1.7} />}
                        {state === 'current' && <span aria-hidden="true" className="absolute inset-0 rounded-full ring-2 ring-sage motion-safe:animate-ping" style={{ animationDuration: '2.2s' }} />}
                      </span>
                      <div className="pt-1.5">
                        <p className={`font-semibold ${state === 'todo' ? 'text-muted' : 'text-ink'}`}>{label}</p>
                        <p className="text-sm text-muted">{body}</p>
                        {state !== 'todo' && (
                          <p className="mt-1 text-xs text-botanical">
                            {fmtDay(p.times[i])}
                            {i < 3 && ` · ${p.times[i].toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Details */}
            <aside className="space-y-4">
              <div className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">In this order</p>
                <ul className="mt-4 space-y-3">
                  {order.items.map((it) => {
                    const prod = getProduct(it.slug);
                    return (
                      <li key={`${it.slug}-${it.size}-${it.pot}`} className="flex items-center gap-3">
                        <span className="relative shrink-0">
                          <span className="block h-14 w-14 overflow-hidden rounded-xl bg-card">{prod && <ProductImage product={prod} className="h-full w-full" />}</span>
                          <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[10px] text-white ring-2 ring-white">{it.qty}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{it.name}</span>
                          <span className="block truncate text-xs text-muted">{[it.size, it.pot].filter(Boolean).join(' · ')}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
                  <span className="text-muted">Total</span>
                  <span className="font-serif text-lg font-semibold text-forest">{money(order.total)}</span>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                  <MapPin size={13} /> Delivering to
                </p>
                <p className="mt-2 text-sm text-ink">
                  {order.address.firstName}, {order.address.city}
                  {order.address.state ? `, ${order.address.state}` : ''} {order.address.postcode}
                </p>
                <p className="mt-1 text-xs text-muted">{order.delivery}</p>
              </div>

              <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-900 p-6 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 -z-10 h-40 w-40 rounded-full bg-botanical/60 blur-2xl" />
                <Sprout size={20} className="text-sage-soft" />
                <p className="mt-3 font-serif text-lg leading-snug text-white">
                  Getting ready for <em className="italic text-sage-soft">arrival?</em>
                </p>
                <p className="mt-1 text-xs text-white/65">Unbox straight away and give your plant a bright spot to settle in.</p>
                <Link to="/plant-care/beginners-indoor-plant-care" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Unboxing & care tips <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </aside>
          </div>
        )}

      </section>
    </>
  );
}
