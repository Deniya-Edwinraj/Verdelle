import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Gift, Lock, Wallet, Truck } from 'lucide-react';
import { deliveryWindow, fmtDay } from '../utils/delivery';
import { markRewardUsed } from '../hooks/useRewards';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderSummary, { totals } from '../components/cart/OrderSummary';
import { Breadcrumb, Field, money } from '../components/ui';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  address1: z.string().trim().min(3, 'Please enter your street address'),
  address2: z.string().optional(),
  city: z.string().trim().min(2, 'Required'),
  state: z.string().trim().min(2, 'Required'),
  postcode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postcode'),
  country: z.string().min(2, 'Required'),
});

const schema = addressSchema.extend({
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[+\d][\d\s()-]{6,}$/.test(v), 'Enter a valid phone number'),
  delivery: z.enum(['standard', 'express']),
  payment: z.enum(['card', 'paypal', 'cod']),
  saveAddress: z.boolean().optional(),
  isGift: z.boolean().optional(),
  giftWrap: z.boolean().optional(),
  giftTo: z.string().max(60).optional(),
  giftMessage: z.string().max(250, 'Keep your message under 250 characters').optional(),
});

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'New Zealand', 'Sri Lanka', 'Singapore'];

function Section({ n, title, children }) {
  return (
    <section className="rounded-2xl border border-line/70 bg-white p-6 md:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-xl">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-forest font-sans text-xs font-semibold text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RadioCard({ value, register, name, title, sub, right, icon: Icon, checked }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${checked ? 'border-forest bg-mist/40' : 'border-line hover:border-botanical'}`}>
      <input type="radio" value={value} {...register(name)} className="" />
      {Icon && <Icon size={18} className="text-forest" />}
      <span className="flex-1">
        <span className="block text-sm font-medium">{title}</span>
        {sub && <span className="block text-xs text-muted">{sub}</span>}
      </span>
      {right && <span className="text-sm font-medium">{right}</span>}
    </label>
  );
}

export default function Checkout() {
  usePageMeta('Checkout');
  const cart = useCart();
  const { user, addresses, saveAddress, addOrder } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const def = addresses.find((a) => a.isDefault) || addresses[0] || {};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || '',
      firstName: def.firstName || user?.firstName || '',
      lastName: def.lastName || user?.lastName || '',
      address1: def.address1 || '',
      address2: def.address2 || '',
      city: def.city || '',
      state: def.state || '',
      postcode: def.postcode || '',
      country: def.country || 'United States',
      phone: '',
      delivery: 'standard',
      payment: 'card',
      saveAddress: !!user && !addresses.length,
      isGift: false,
      giftWrap: true,
      giftTo: '',
      giftMessage: '',
    },
  });
  const delivery = watch('delivery');
  const payment = watch('payment');
  const isGift = watch('isGift');
  const giftWrap = !!isGift && !!watch('giftWrap');
  const giftMessage = watch('giftMessage') || '';
  const win = (m) => {
    const w = deliveryWindow(m);
    return `Arrives ${fmtDay(w.from)} – ${fmtDay(w.to)}`;
  };

  if (!cart.items.length && !placing) return <Navigate to="/cart" replace />;

  const onSubmit = async (d) => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const wrap = !!d.isGift && !!d.giftWrap;
    const t = totals(cart, d.delivery, { giftWrap: wrap });
    const order = {
      number: `VD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
      date: new Date().toISOString(),
      email: d.email,
      status: 'Processing',
      items: cart.items.map((i) => ({ id: i.id, slug: i.product.slug, name: i.product.name, size: i.size, pot: i.pot, qty: i.qty, unitPrice: i.unitPrice })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      coupon: cart.coupon,
      shipping: t.shipping,
      gift: d.isGift ? { to: d.giftTo || '', message: d.giftMessage || '', wrap, wrapPrice: t.gift } : null,
      total: t.total,
      delivery: SITE.shipping[d.delivery].label,
      payment: { card: 'Credit / debit card', paypal: 'PayPal', cod: 'Pay on delivery' }[d.payment],
      address: { firstName: d.firstName, lastName: d.lastName, address1: d.address1, address2: d.address2, city: d.city, state: d.state, postcode: d.postcode, country: d.country },
    };
    if (user && d.saveAddress) saveAddress({ ...order.address, isDefault: !addresses.length });
    addOrder(order);
    try {
      sessionStorage.setItem('gn_last_order', JSON.stringify(order));
    } catch {
      /* ignore */
    }
    if (cart.coupon) markRewardUsed(cart.coupon);
    cart.clear();
    navigate('/order-success', { state: { order } });
  };

  return (
    <div className="bg-card/60">
      <div className="container py-8 md:py-12">
        <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="mt-4 text-4xl">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Section n={1} title="Contact information">
              {!user && (
                <p className="mb-4 text-sm text-muted">
                  Have an account?{' '}
                  <Link to="/login" state={{ from: '/checkout' }} className="text-forest underline">
                    Sign in
                  </Link>
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
                <Field label="Phone (optional)" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
              </div>
            </Section>

            <Section n={2} title="Shipping address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
                <Field label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
                <Field className="sm:col-span-2" label="Street address" autoComplete="address-line1" error={errors.address1?.message} {...register('address1')} />
                <Field className="sm:col-span-2" label="Apartment, suite (optional)" autoComplete="address-line2" {...register('address2')} />
                <Field label="City" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
                <Field label="State / Province" autoComplete="address-level1" error={errors.state?.message} {...register('state')} />
                <Field label="Postcode" autoComplete="postal-code" error={errors.postcode?.message} {...register('postcode')} />
                <Field as="select" label="Country" autoComplete="country-name" error={errors.country?.message} {...register('country')}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Field>
              </div>
              {user && (
                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register('saveAddress')} className="" /> Save this address to my account
                </label>
              )}
            </Section>

            <Section n={3} title="Delivery">
              <div className="space-y-3">
                <RadioCard
                  name="delivery"
                  value="standard"
                  register={register}
                  checked={delivery === 'standard'}
                  icon={Truck}
                  title={SITE.shipping.standard.label}
                  sub={`${win('standard')} · Free on orders over ${money(SITE.freeShippingThreshold)}`}
                  right={totals(cart, 'standard').shipping === 0 ? 'Free' : money(SITE.shipping.standard.price)}
                />
                <RadioCard name="delivery" value="express" register={register} checked={delivery === 'express'} icon={Truck} title={SITE.shipping.express.label} sub={win('express')} right={money(SITE.shipping.express.price)} />
              </div>

              {/* Gift options */}
              <div className={`mt-5 rounded-2xl border p-4 transition ${isGift ? 'border-forest bg-mist/30' : 'border-line'}`}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" {...register('isGift')} />
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-forest">
                    <Gift size={17} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">This order is a gift</span>
                    <span className="block text-xs text-muted">We’ll leave prices off the packing slip.</span>
                  </span>
                </label>
                {isGift && (
                  <div className="mt-4 space-y-4 border-t border-line/70 pt-4">
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white p-3 ring-1 ring-line/70">
                      <span className="flex items-center gap-3">
                        <input type="checkbox" {...register('giftWrap')} />
                        <span>
                          <span className="block text-sm font-medium">{SITE.giftWrap.label}</span>
                          <span className="block text-xs text-muted">Kraft paper, twine and a card written by our team.</span>
                        </span>
                      </span>
                      <span className="text-sm font-medium">{money(SITE.giftWrap.price)}</span>
                    </label>
                    <Field label="Recipient’s name (optional)" error={errors.giftTo?.message} {...register('giftTo')} />
                    <div>
                      <Field as="textarea" label="Gift message (optional)" maxLength={250} placeholder="Happy housewarming! May it grow as fast as your new home fills with memories." error={errors.giftMessage?.message} {...register('giftMessage')} />
                      <p className="mt-1 text-right text-xs text-muted">{giftMessage.length}/250</p>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <Section n={4} title="Payment">
              <div className="space-y-3">
                <RadioCard name="payment" value="card" register={register} checked={payment === 'card'} icon={CreditCard} title="Credit / debit card" sub="Processed securely by your payment provider" />
                <RadioCard name="payment" value="paypal" register={register} checked={payment === 'paypal'} icon={Wallet} title="PayPal" />
                <RadioCard name="payment" value="cod" register={register} checked={payment === 'cod'} icon={Truck} title="Pay on delivery" />
              </div>
              {payment === 'card' && (
                <div className="mt-4 rounded-lg border border-dashed border-sage bg-card/60 p-4 text-sm text-muted">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    <Lock size={14} /> Secure payment field
                  </p>
                  <p className="mt-1">Your card details are entered on our payment provider’s secure, encrypted form — they never touch our servers.</p>
                </div>
              )}
            </Section>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary method={delivery} showItems giftWrap={giftWrap}>
              <button className="btn-primary mt-6 h-12 w-full" disabled={placing}>
                <Lock size={15} /> {placing ? 'Placing order…' : `Place Order · ${money(totals(cart, delivery, { giftWrap }).total)}`}
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                By placing your order you agree to our{' '}
                <Link to="/terms" className="underline">
                  Terms
                </Link>
                .
              </p>
            </OrderSummary>
          </div>
        </form>
      </div>
    </div>
  );
}
