import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { REWARDS } from '../data/services';
import { ArrowRight, Leaf, BookOpen, Box, Check, ClipboardCheck, Copy, CreditCard, Gift, Home, Mail, MapPin, Package, Sprout, Truck } from 'lucide-react';
import { money } from '../components/ui';
import { getProduct, getProductById } from '../data/products';
import { ProductImage } from '../components/art/scenes';
import { addBusinessDays, dispatchDate, fmtDay } from '../utils/delivery';
import { usePageMeta } from '../hooks/usePageMeta';
import OrderCareCards from '../components/care/CareCardQR';

function readLast() {
  try {
    return JSON.parse(sessionStorage.getItem('gn_last_order'));
  } catch {
    return null;
  }
}

const NEXT = [
  { icon: ClipboardCheck, title: 'Order confirmed', body: 'We’ve received your order.' },
  { icon: Box, title: 'Packed with care', body: 'Soil secured, leaves supported.' },
  { icon: Truck, title: 'On its way', body: 'We’ll email your tracking link.' },
  { icon: Home, title: 'Delivered', body: 'Unbox and let it settle in.' },
];

export default function OrderSuccess() {
  usePageMeta('Order Confirmed');
  const { state } = useLocation();
  const order = state?.order || readLast();
  const [copied, setCopied] = useState(false);

  if (!order)
    return (
      <section className="container py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[32px] bg-white px-6 py-14 text-center shadow-lift ring-1 ring-line/70">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-mist text-forest">
            <Package size={30} strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 text-[30px] font-medium tracking-tight">
            No recent <em className="font-normal italic text-botanical">order</em>
          </h1>
          <p className="mt-2 text-sm text-muted">We couldn’t find a recent order. Looking for an earlier one?</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/track-order" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
              <Truck size={15} /> Track an order
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-medium text-forest transition hover:border-forest">
              Start shopping
            </Link>
          </div>
        </div>
      </section>
    );

  const a = order.address;
  const express = /express/i.test(order.delivery || '');
  const dispatch = dispatchDate(new Date(order.date));
  const chosen = order.deliveryDate ? new Date(order.deliveryDate + 'T12:00:00') : null;
  const from = chosen || addBusinessDays(dispatch, express ? 1 : 3);
  const to = chosen || addBusinessDays(dispatch, express ? 2 : 5);
  const count = order.items.reduce((n, i) => n + i.qty, 0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-botanical/45 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="container flex flex-col items-center pb-32 pt-14 text-center md:pb-40 md:pt-20">
          {/* Animated check */}
          <span className="relative grid h-24 w-24 place-items-center motion-safe:animate-fade-up">
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-sage-soft/20 motion-safe:animate-ping" style={{ animationDuration: '2.4s' }} />
            <span aria-hidden="true" className="absolute -inset-3 rounded-full border border-sage-soft/25" />
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900 shadow-float">
              <Check size={44} strokeWidth={2.5} />
            </span>
          </span>

          <p className="mt-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-soft motion-safe:animate-fade-up" style={{ animationDelay: '80ms' }}>
            <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
            Thank you, {a.firstName}
            <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
          </p>
          <h1 className="mt-4 text-[38px] font-medium leading-[1.08] tracking-tight text-white motion-safe:animate-fade-up md:text-[60px]" style={{ animationDelay: '140ms' }}>
            Your order is <em className="font-normal italic text-sage-soft">confirmed</em>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 motion-safe:animate-fade-up" style={{ animationDelay: '200ms' }}>
            Your new green {count === 1 ? 'friend is' : 'friends are'} being prepared in our greenhouse. A confirmation email is on its way to{' '}
            <strong className="font-semibold text-white">{order.email}</strong>.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 motion-safe:animate-fade-up" style={{ animationDelay: '260ms' }}>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
              aria-label={`Copy order number ${order.number}`}
            >
              <span className="text-white/60">Order</span> <strong className="font-semibold tracking-wide">{order.number}</strong>
              {copied ? <Check size={14} className="text-sage-soft" /> : <Copy size={14} className="text-white/60" />}
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/20 backdrop-blur-md">
              {new Date(order.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </span>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-10 w-full text-warm md:h-16">
          <path fill="currentColor" d="M0 80V40C240 8 480 0 720 0s480 8 720 40v40H0Z" />
        </svg>
      </section>

      {/* ---------- Delivery estimate + next steps ---------- */}
      <section className="container relative z-10 -mt-20 max-w-5xl md:-mt-28">
        <div className="rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-line/70 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">{chosen ? 'Your delivery date' : 'Estimated delivery'}</p>
              <p className="mt-1 font-serif text-[28px] font-semibold leading-tight text-forest md:text-[34px]">
                {fmtDay(from)}
                {!chosen && (
                  <>
                    {' '}
                    <span className="text-muted">–</span> {fmtDay(to)}
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-muted">{order.delivery}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to={`/track-order?order=${order.number}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical"
              >
                <Truck size={15} /> Track your order <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/shop" className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-semibold text-forest transition hover:border-forest">
                Continue shopping
              </Link>
            </div>
          </div>

          <ol className="relative mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-4 sm:gap-3">
            <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[56px] hidden h-px bg-gradient-to-r from-botanical via-line to-line sm:block" />
            {NEXT.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
                <span
                  className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ring-4 ring-white ${
                    i === 0 ? 'bg-forest text-white shadow-float' : 'bg-card text-muted'
                  }`}
                >
                  {i === 0 ? <Check size={20} strokeWidth={2.5} /> : <Icon size={19} strokeWidth={1.7} />}
                </span>
                <span>
                  <span className={`block text-sm font-semibold ${i === 0 ? 'text-forest' : 'text-ink'}`}>{title}</span>
                  <span className="block text-xs text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Details ---------- */}
      <section className="container max-w-5xl py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Items + totals */}
          <div className="rounded-[28px] bg-white shadow-soft ring-1 ring-line/70">
            <div className="flex items-center justify-between px-6 pt-6 md:px-8">
              <p className="font-serif text-2xl text-ink">
                Order <em className="italic text-botanical">summary</em>
              </p>
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
            <ul className="mt-4 space-y-3 px-6 md:px-8">
              {order.items.map((i) => {
                const p = getProduct(i.slug) || getProductById(i.id);
                return (
                  <li key={`${i.id}${i.size}${i.pot}`} className="flex items-center gap-4 rounded-2xl bg-card/50 p-2.5 pr-4">
                    <span className="relative shrink-0">
                      <span className="block h-16 w-16 overflow-hidden rounded-xl bg-card">{p && <ProductImage product={p} className="h-full w-full" />}</span>
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[10px] text-white ring-2 ring-white">{i.qty}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      {p ? (
                        <Link to={`/product/${p.slug}`} className="block truncate font-serif text-[15px] font-semibold text-ink hover:text-botanical">
                          {i.name}
                        </Link>
                      ) : (
                        <p className="truncate font-serif text-[15px] font-semibold text-ink">{i.name}</p>
                      )}
                      <p className="truncate text-xs text-muted">{[i.size, i.pot].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="font-serif text-base font-semibold text-forest">{money(i.unitPrice * i.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-dashed border-line px-6 py-6 text-sm md:px-8">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium">{money(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-forest">
                  <dt>Discount ({order.coupon})</dt>
                  <dd>−{money(order.discount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className={order.shipping ? 'font-medium' : 'rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-forest'}>{order.shipping ? money(order.shipping) : 'Free'}</dd>
              </div>
              {order.gift?.wrapPrice > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Gift wrap</dt>
                  <dd className="font-medium">{money(order.gift.wrapPrice)}</dd>
                </div>
              )}
              <div className="flex items-end justify-between border-t border-line pt-4">
                <dt className="font-semibold">Total</dt>
                <dd className="font-serif text-[28px] font-semibold leading-none text-forest">{money(order.total)}</dd>
              </div>
            </dl>
          </div>

          {/* Side cards */}
          <div className="space-y-4">
            {order.gift && (
              <div className="relative overflow-hidden rounded-[24px] bg-mist/70 p-5 ring-1 ring-sage-soft/60">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-forest">
                  <Gift size={14} /> Sent as a gift
                </p>
                <p className="mt-2 font-serif text-lg text-ink">
                  {order.gift.to ? `For ${order.gift.to}` : 'A gift for someone special'}
                  {order.gift.wrap && <span className="ml-2 rounded-full bg-white px-2 py-0.5 align-middle text-[10px] font-semibold text-forest">Gift wrapped</span>}
                </p>
                {order.gift.message && <p className="mt-2 border-l-2 border-sage pl-3 text-sm italic text-ink/75">“{order.gift.message}”</p>}
              </div>
            )}

            <div className="flex items-center gap-4 rounded-[24px] bg-forest-900 p-5 text-white">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sage-soft">
                <Leaf size={17} />
              </span>
              <p className="text-sm">
                You earned <strong className="font-serif text-lg text-sage-soft">{Math.floor(order.total * REWARDS.perDollar)} leaves</strong> with this order.{' '}
                <Link to="/rewards" className="text-white/70 underline-offset-2 hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
            {[
              [
                MapPin,
                'Shipping to',
                <>
                  <span className="font-medium text-ink">
                    {a.firstName} {a.lastName}
                  </span>
                  <br />
                  {a.address1}
                  {a.address2 && `, ${a.address2}`}
                  <br />
                  {a.city}, {a.state} {a.postcode}
                  <br />
                  {a.country}
                </>,
              ],
              [Truck, 'Delivery', order.delivery],
              [CreditCard, 'Payment', order.payment],
              [Mail, 'Confirmation sent to', order.email],
            ].map(([Icon, label, body]) => (
              <div key={label} className="flex gap-4 rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-line/70">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-forest">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
                  <p className="mt-1 break-words text-sm leading-relaxed text-ink/80">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <OrderCareCards items={order.items} />
        </div>

        {/* While you wait */}
        <div className="relative isolate mt-10 overflow-hidden rounded-[32px] bg-forest-900 p-7 text-white shadow-float md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-botanical/50 blur-3xl" />
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-sage-soft ring-1 ring-white/15">
                <Sprout size={22} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-serif text-2xl leading-tight text-white md:text-[28px]">
                  While you <em className="italic text-sage-soft">wait…</em>
                </p>
                <p className="mt-1.5 max-w-md text-sm text-white/70">Get ready for arrival day — our beginner’s guide covers unboxing, the right spot and first watering.</p>
              </div>
            </div>
            <Link
              to="/plant-care/beginners-indoor-plant-care"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-mist"
            >
              <BookOpen size={15} /> Read the care guide <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
