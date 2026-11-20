import { useState } from 'react';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowRight, Bell, BellOff, BookOpen, CalendarHeart, CalendarPlus, Cake, Check, Compass, Copy, Heart, Home, LayoutDashboard, Leaf, LogOut, Mail, MapPin, Package, PackageSearch, PauseCircle, Pencil, PlayCircle, Plus, Repeat, ShoppingBag, Trash2, Truck, User, UserRound, XCircle,
} from 'lucide-react';
import { REWARDS, SUBSCRIPTION_FREQUENCIES } from '../data/services';
import { useRewards } from '../hooks/useRewards';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getProduct, getProductById } from '../data/products';
import { ProductImage } from '../components/art/scenes';
import { Breadcrumb, money } from '../components/ui';
import { IconField } from './Login';
import { addressSchema } from './Checkout';
import { usePageMeta } from '../hooks/usePageMeta';

const TABS = [
  { key: 'overview', label: 'Dashboard', to: '/account', icon: LayoutDashboard, blurb: 'Your plant life at a glance' },
  { key: 'orders', label: 'Orders', to: '/account/orders', icon: Package, blurb: 'Track and review your orders' },
  { key: 'subscriptions', label: 'Subscriptions', to: '/account/subscriptions', icon: Repeat, blurb: 'Your plant deliveries on repeat' },
  { key: 'rewards', label: 'Rewards', to: '/account/rewards', icon: Leaf, blurb: `Your ${REWARDS.name}` },
  { key: 'occasions', label: 'Occasions', to: '/account/occasions', icon: CalendarHeart, blurb: 'Never miss a birthday or anniversary' },
  { key: 'addresses', label: 'Addresses', to: '/account/addresses', icon: MapPin, blurb: 'Where your plants are delivered' },
  { key: 'profile', label: 'Profile', to: '/account/profile', icon: UserRound, blurb: 'Your personal details' },
];

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'medium' });

function Eyebrow({ children, light = false }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-sage-soft' : 'text-botanical'}`}>
      <span aria-hidden="true" className={`h-px w-10 ${light ? 'bg-sage-soft/60' : 'bg-botanical/60'}`} />
      {children}
    </p>
  );
}

function Empty({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border-2 border-dashed border-line bg-white/60 px-6 py-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-mist text-forest">
        <Icon size={26} strokeWidth={1.6} />
      </span>
      <p className="mt-5 font-serif text-2xl text-ink">{title}</p>
      <p className="mt-1.5 max-w-xs text-sm text-muted">{body}</p>
      {action}
    </div>
  );
}

/* ---------------- Orders ---------------- */
function Orders({ orders, limit }) {
  if (!orders.length)
    return (
      <Empty
        icon={Package}
        title="No orders yet"
        body="When you place an order, it will appear here so you can track it."
        action={
          <Link to="/shop" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            Start shopping <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    );
  return (
    <ul className="space-y-4">
      {orders.slice(0, limit).map((o) => {
        const thumbs = o.items.map((i) => getProduct(i.slug) || getProductById(i.id)).filter(Boolean);
        const count = o.items.reduce((n, i) => n + i.qty, 0);
        return (
          <li key={o.number} className="group rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-line/70 transition hover:shadow-lift hover:ring-sage-soft md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Order</p>
                <p className="font-serif text-xl font-semibold text-ink">{o.number}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Placed {fmt(o.date)} · {count} {count === 1 ? 'item' : 'items'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-forest">
                <span className="h-1.5 w-1.5 rounded-full bg-botanical" /> {o.status}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {thumbs.slice(0, 4).map((p, i) => (
                <span key={`${p.id}-${i}`} className="h-16 w-16 overflow-hidden rounded-2xl bg-card ring-1 ring-line/60">
                  <ProductImage product={p} className="h-full w-full" />
                </span>
              ))}
              {thumbs.length > 4 && <span className="grid h-16 w-16 place-items-center rounded-2xl bg-card text-sm font-semibold text-muted">+{thumbs.length - 4}</span>}
              <p className="ml-2 hidden min-w-0 flex-1 truncate text-sm text-muted sm:block">{o.items.map((i) => i.name).join(', ')}</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-sm text-muted">
                Total <span className="ml-1 font-serif text-xl font-semibold text-forest">{money(o.total)}</span>
              </p>
              <Link
                to={`/track-order?order=${o.number}`}
                className="group/t inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-botanical"
              >
                <Truck size={14} /> Track order <ArrowRight size={13} className="transition-transform group-hover/t:translate-x-0.5" />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Addresses ---------------- */
function AddressForm({ initial, onDone }) {
  const { saveAddress } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema.extend({ isDefault: z.boolean().optional() })), defaultValues: initial || { country: 'United States' } });
  return (
    <form
      noValidate
      onSubmit={handleSubmit((d) => {
        saveAddress({ ...d, id: initial?.id });
        onDone();
      })}
      className="rounded-[24px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8"
    >
      <p className="font-serif text-2xl text-ink">
        {initial ? 'Edit' : 'New'} <em className="italic text-botanical">address</em>
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <IconField label="First name" icon={User} error={errors.firstName?.message} {...register('firstName')} />
        <IconField label="Last name" icon={User} error={errors.lastName?.message} {...register('lastName')} />
        <div className="sm:col-span-2">
          <IconField label="Street address" icon={Home} error={errors.address1?.message} {...register('address1')} />
        </div>
        <div className="sm:col-span-2">
          <IconField label="Apartment, suite (optional)" {...register('address2')} />
        </div>
        <IconField label="City" error={errors.city?.message} {...register('city')} />
        <IconField label="State / Province" error={errors.state?.message} {...register('state')} />
        <IconField label="Postcode" error={errors.postcode?.message} {...register('postcode')} />
        <IconField label="Country" icon={MapPin} error={errors.country?.message} {...register('country')} />
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl bg-card/60 p-3.5 text-sm ring-1 ring-line/70">
        <input type="checkbox" {...register('isDefault')} /> Set as my default delivery address
      </label>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="inline-flex h-11 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition hover:bg-botanical">Save address</button>
        <button type="button" onClick={onDone} className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-forest transition hover:border-forest">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Addresses() {
  const { addresses, removeAddress } = useAuth();
  const [editing, setEditing] = useState(null); // null | 'new' | address
  if (editing) return <AddressForm initial={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {addresses.map((a) => (
        <li key={a.id} className={`relative flex flex-col rounded-[24px] bg-white p-6 shadow-soft ring-1 transition hover:shadow-lift ${a.isDefault ? 'ring-sage' : 'ring-line/70'}`}>
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-forest">
              <MapPin size={19} />
            </span>
            {a.isDefault && <span className="rounded-full bg-forest px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">Default</span>}
          </div>
          <p className="mt-4 font-serif text-lg font-semibold text-ink">
            {a.firstName} {a.lastName}
          </p>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">
            {a.address1}
            {a.address2 && `, ${a.address2}`}
            <br />
            {a.city}, {a.state} {a.postcode}
            <br />
            {a.country}
          </p>
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            <button onClick={() => setEditing(a)} className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-semibold text-forest transition hover:bg-mist">
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => removeAddress(a.id)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]">
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </li>
      ))}
      <li>
        <button
          onClick={() => setEditing('new')}
          className="group flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-line bg-white/50 text-center transition hover:border-sage hover:bg-white"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-mist text-forest transition group-hover:rotate-90 group-hover:bg-forest group-hover:text-white">
            <Plus size={20} />
          </span>
          <span className="mt-3 font-semibold text-ink">Add a new address</span>
          <span className="mt-0.5 text-xs text-muted">Home, office or a friend’s place</span>
        </button>
      </li>
    </ul>
  );
}

/* ---------------- Profile ---------------- */
function Profile({ user }) {
  const { updateProfile } = useAuth();
  const notify = useToast();
  const schema = z.object({ firstName: z.string().trim().min(1, 'Required'), lastName: z.string().trim().optional(), email: z.string().trim().email('Enter a valid email') });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(schema), defaultValues: user });
  return (
    <form
      noValidate
      onSubmit={handleSubmit((d) => {
        updateProfile(d);
        notify('Profile updated');
      })}
      className="rounded-[24px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <IconField label="First name" icon={User} error={errors.firstName?.message} {...register('firstName')} />
        <IconField label="Last name" icon={User} {...register('lastName')} />
        <div className="sm:col-span-2">
          <IconField label="Email" icon={Mail} type="email" error={errors.email?.message} {...register('email')} />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-xs text-muted">Member since {fmt(user.joined || Date.now())}</p>
        <button
          disabled={!isDirty}
          className="inline-flex h-11 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition hover:bg-botanical disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

/* ---------------- Subscriptions ---------------- */
function Subscriptions() {
  const [subs, setSubs] = useLocalStorage('gn_subscriptions', []);
  const notify = useToast();
  const update = (id, patch, msg) => {
    setSubs((cur) => cur.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    notify(msg, { type: 'info' });
  };
  if (!subs.length)
    return (
      <Empty
        icon={Repeat}
        title="No subscriptions yet"
        body="Get a healthy new plant delivered every month or season."
        action={
          <Link to="/subscription" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            Explore plant clubs <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    );
  return (
    <ul className="space-y-4">
      {subs.map((s) => {
        const status = { active: ['Active', 'bg-mist text-forest'], paused: ['Paused', 'bg-[#F3EBDD] text-[#7A5B2E]'], cancelled: ['Cancelled', 'bg-card text-muted'] }[s.status];
        return (
          <li key={s.id} className="rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-line/70 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-white">
                  <Repeat size={20} />
                </span>
                <div>
                  <p className="font-serif text-xl font-semibold text-ink">{s.planName}</p>
                  <p className="text-xs text-muted">
                    {SUBSCRIPTION_FREQUENCIES.find((f) => f.key === s.freq)?.label} · {s.planter} planter{s.gift ? ` · Gift for ${s.name}` : ''}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status[1]}`}>{status[0]}</span>
            </div>
            <div className="mt-5 grid gap-3 rounded-2xl bg-card/60 p-4 text-sm sm:grid-cols-3">
              <p>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Per delivery</span>
                <span className="font-serif text-lg font-semibold text-forest">{money(s.price)}</span>
              </p>
              <p>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Next box</span>
                <span className="font-medium text-ink">{s.status === 'active' ? fmt(s.nextDelivery) : '—'}</span>
              </p>
              <p>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Since</span>
                <span className="font-medium text-ink">{fmt(s.started)}</span>
              </p>
            </div>
            {s.status !== 'cancelled' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {s.status === 'active' ? (
                  <>
                    <button
                      onClick={() => {
                        const next = new Date(s.nextDelivery);
                        next.setMonth(next.getMonth() + (s.freq === 'quarterly' ? 3 : s.freq === 'bimonthly' ? 2 : 1));
                        update(s.id, { nextDelivery: next.toISOString() }, 'Next box skipped');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-semibold text-forest transition hover:bg-mist"
                    >
                      Skip next box
                    </button>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-semibold text-forest transition hover:bg-mist">
                      <CalendarPlus size={13} /> Move date
                      <input
                        type="date"
                        min={new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)}
                        onChange={(e) => e.target.value && update(s.id, { nextDelivery: new Date(e.target.value + 'T12:00:00').toISOString() }, 'Next box date updated')}
                        className="sr-only"
                        aria-label="Choose a new date for your next box"
                      />
                    </label>
                    <button onClick={() => update(s.id, { status: 'paused' }, 'Subscription paused')} className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-semibold text-forest transition hover:bg-mist">
                      <PauseCircle size={13} /> Pause
                    </button>
                  </>
                ) : (
                  <button onClick={() => update(s.id, { status: 'active' }, 'Subscription resumed')} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white transition hover:bg-botanical">
                    <PlayCircle size={13} /> Resume
                  </button>
                )}
                <button onClick={() => update(s.id, { status: 'cancelled' }, 'Subscription cancelled')} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]">
                  <XCircle size={13} /> Cancel
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Occasions ---------------- */
const RELATIONS = ['Partner', 'Mum', 'Dad', 'Friend', 'Family', 'Colleague', 'Me'];
const OCCASION_TYPES = [
  ['Birthday', 'birthday'],
  ['Anniversary', 'birthday'],
  ['Housewarming', 'housewarming'],
  ['Mother’s Day', 'birthday'],
  ['Thank you', 'thank-you'],
  ['Other', 'birthday'],
];

function nextOccurrence(mmdd) {
  const [m, d] = mmdd.split('-').map(Number);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let next = new Date(now.getFullYear(), m - 1, d);
  if (next < now) next = new Date(now.getFullYear() + 1, m - 1, d);
  return { date: next, days: Math.round((next - now) / 86400000) };
}

function icsFor(o) {
  const { date } = nextOccurrence(o.date);
  const p = (n) => String(n).padStart(2, '0');
  const day = `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Verdelle//Occasions//EN',
    'BEGIN:VEVENT',
    `UID:${o.id}@verdelle`,
    `DTSTART;VALUE=DATE:${day}`,
    'RRULE:FREQ=YEARLY',
    `SUMMARY:${o.name}’s ${o.type}`,
    'DESCRIPTION:Send something green — verdelle gift shop',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${o.name}’s ${o.type} is in a week`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${o.name}-${o.type}.ics`.replace(/\s+/g, '-').toLowerCase();
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Occasions() {
  const [list, setList] = useLocalStorage('gn_occasions', []);
  const notify = useToast();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Birthday', relation: 'Friend', date: '' });
  const [error, setError] = useState('');
  const sorted = [...list].sort((a, b) => nextOccurrence(a.date).days - nextOccurrence(b.date).days);

  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Add a name');
    if (!form.date) return setError('Choose a date');
    setError('');
    const mmdd = form.date.slice(5);
    const next = [...list, { id: `occ-${Date.now()}`, name: form.name.trim(), type: form.type, relation: form.relation, date: mmdd, remind: true, created: new Date().toISOString() }];
    setList(next);
    setAdding(false);
    setForm({ name: '', type: 'Birthday', relation: 'Friend', date: '' });
    notify(next.length === 3 ? `Occasion saved — you’ve earned ${REWARDS.occasionBonus} bonus leaves!` : 'Occasion saved — we’ll remind you a week before');
  };

  const input = 'h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40';

  return (
    <div className="space-y-6">
      {list.length < 3 && (
        <div className="flex items-center gap-4 rounded-[22px] bg-mist/60 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-forest">
            <Leaf size={19} />
          </span>
          <p className="text-sm text-ink/80">
            Save <strong>{3 - list.length} more</strong> {3 - list.length === 1 ? 'occasion' : 'occasions'} to earn <strong className="text-forest">{REWARDS.occasionBonus} bonus leaves</strong>. We’ll email you a week before each date.
          </p>
        </div>
      )}

      {adding ? (
        <form onSubmit={save} noValidate className="rounded-[24px] bg-white p-6 shadow-soft ring-1 ring-line/70">
          <p className="font-serif text-2xl text-ink">
            Add an <em className="italic text-botanical">occasion</em>
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Who’s it for?</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Sam" className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Date</span>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Occasion</span>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={input}>
                {OCCASION_TYPES.map(([t]) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Relationship</span>
              <select value={form.relation} onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))} className={input}>
                {RELATIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-red-800">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="inline-flex h-11 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition hover:bg-botanical">Save occasion</button>
            <button type="button" onClick={() => setAdding(false)} className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-forest transition hover:border-forest">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="group flex w-full items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-line bg-white/50 py-6 text-sm font-semibold text-forest transition hover:border-sage hover:bg-white">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-mist transition group-hover:rotate-90 group-hover:bg-forest group-hover:text-white">
            <Plus size={18} />
          </span>
          Add an occasion
        </button>
      )}

      {sorted.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sorted.map((o) => {
            const { date, days } = nextOccurrence(o.date);
            const gift = (OCCASION_TYPES.find(([t]) => t === o.type) || [])[1] || 'birthday';
            return (
              <li key={o.id} className={`rounded-[24px] bg-white p-5 shadow-soft ring-1 transition ${days <= 14 ? 'ring-sage' : 'ring-line/70'} ${o.remind ? '' : 'opacity-70'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-forest">
                      <Cake size={20} />
                    </span>
                    <div>
                      <p className="font-serif text-lg font-semibold text-ink">{o.name}</p>
                      <p className="text-xs text-muted">
                        {o.type} · {o.relation}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${days <= 14 ? 'bg-forest text-white' : 'bg-card text-forest'}`}>{days === 0 ? 'Today!' : `In ${days} days`}</span>
                </div>
                <p className="mt-4 text-sm text-ink/80">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  <Link to={`/gifts?for=${gift}`} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white transition hover:bg-botanical">
                    Find a gift <ArrowRight size={12} />
                  </Link>
                  <button onClick={() => icsFor(o)} className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-xs font-semibold text-forest transition hover:bg-mist" title="Add to calendar">
                    <CalendarPlus size={13} /> Calendar
                  </button>
                  <button
                    onClick={() => setList((cur) => cur.map((x) => (x.id === o.id ? { ...x, remind: !x.remind } : x)))}
                    aria-pressed={!o.remind}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-xs font-semibold text-forest transition hover:bg-mist"
                    title={o.remind ? 'Pause reminders for this date' : 'Turn reminders back on'}
                  >
                    {o.remind ? <Bell size={13} /> : <BellOff size={13} />} {o.remind ? 'Reminders on' : 'Paused'}
                  </button>
                  <button onClick={() => setList((cur) => cur.filter((x) => x.id !== o.id))} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]" aria-label={`Delete ${o.name}’s ${o.type}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Rewards ---------------- */
function Rewards() {
  const { balance, earned, tier, nextTier, history, codes, redeem } = useRewards();
  const notify = useToast();
  const [copied, setCopied] = useState(null);
  const progress = nextTier ? Math.min(100, ((earned - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="space-y-6">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-900 p-6 text-white md:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-botanical/50 blur-3xl" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
              {REWARDS.name} · {tier.name}
            </p>
            <p className="mt-2 font-serif text-[52px] font-semibold leading-none">
              {balance} <span className="text-lg font-normal text-white/60">leaves</span>
            </p>
          </div>
          <Link to="/rewards" className="text-sm font-semibold text-sage-soft hover:underline">
            How it works
          </Link>
        </div>
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-sage to-sage-soft" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/60">{nextTier ? `${nextTier.min - earned} more leaves to reach ${nextTier.name}` : 'You’ve reached our top tier — thank you!'}</p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">Redeem your leaves</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {REWARDS.redeem.map((r) => {
            const can = balance >= r.leaves;
            return (
              <li key={r.leaves} className="rounded-[22px] bg-white p-5 shadow-soft ring-1 ring-line/70">
                <p className="font-serif text-2xl font-semibold text-forest">{money(r.value)} off</p>
                <p className="text-xs text-muted">{r.leaves} leaves</p>
                <button
                  disabled={!can}
                  onClick={() => {
                    const c = redeem(r);
                    if (c) notify(`Code ${c.code} created — use it at checkout`);
                  }}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-forest text-xs font-semibold text-white transition hover:bg-botanical disabled:cursor-not-allowed disabled:bg-card disabled:text-muted"
                >
                  {can ? 'Redeem' : `${r.leaves - balance} more needed`}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {codes.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">Your reward codes</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {codes.map((c) => (
              <li key={c.code} className={`flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-4 ${c.used ? 'border-line opacity-60' : 'border-sage bg-white'}`}>
                <span>
                  <span className="block font-serif text-lg font-semibold tracking-[0.12em] text-forest">{c.code}</span>
                  <span className="text-xs text-muted">
                    {money(c.value)} off · {c.used ? 'Used' : 'Ready to use'}
                  </span>
                </span>
                {!c.used && (
                  <button onClick={() => copy(c.code)} className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white">
                    {copied === c.code ? <Check size={12} /> : <Copy size={12} />} {copied === c.code ? 'Copied' : 'Copy'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">Activity</p>
        <ul className="divide-y divide-line rounded-[22px] bg-white px-5 shadow-soft ring-1 ring-line/70">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 py-3.5 text-sm">
              <span>
                <span className="block font-medium text-ink">{h.label}</span>
                <span className="text-xs text-muted">{fmt(h.date)}</span>
              </span>
              <span className={`font-semibold ${h.leaves >= 0 ? 'text-botanical' : 'text-muted'}`}>
                {h.leaves >= 0 ? '+' : ''}
                {h.leaves}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Account({ tab }) {
  const { user, logout, orders, addresses } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  usePageMeta('My Account');
  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />;
  const current = TABS.find((t) => t.key === tab);
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'V';
  const spent = orders.reduce((s, o) => s + o.total, 0);
  const wished = ids.map(getProductById).filter(Boolean);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-20 -z-10 h-[420px] w-[420px] rounded-full bg-botanical/45 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[360px] w-[360px] rounded-full bg-sage/15 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="container pb-28 pt-8 md:pb-32 md:pt-10">
          <div className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 backdrop-blur-md">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My account' }]} light />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage font-serif text-3xl font-semibold text-forest-900 shadow-float ring-4 ring-white/15">
              {initials}
            </span>
            <div>
              <Eyebrow light>{greeting}</Eyebrow>
              <h1 className="mt-2 text-[36px] font-medium leading-tight tracking-tight text-white md:text-[48px]">
                Hello, <em className="font-normal italic text-sage-soft">{user.firstName}</em>
              </h1>
              <p className="mt-1 text-sm text-white/65">
                {user.email} · Member since {new Date(user.joined || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-10 w-full text-warm md:h-16">
          <path fill="currentColor" d="M0 80V40C240 8 480 0 720 0s480 8 720 40v40H0Z" />
        </svg>
      </section>

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-20 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <nav aria-label="Account" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl">
              <ul className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
                {TABS.map((t) => (
                  <li key={t.key}>
                    <NavLink
                      to={t.to}
                      end
                      className={({ isActive }) =>
                        `group flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-forest text-white shadow-soft' : 'text-ink/75 hover:bg-mist/60 hover:text-forest'}`
                      }
                    >
                      <t.icon size={17} /> {t.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link to="/wishlist" className="flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium text-ink/75 transition hover:bg-mist/60 hover:text-forest">
                    <Heart size={17} /> Wishlist
                    {ids.length > 0 && <span className="ml-auto rounded-full bg-mist px-2 text-[10px] font-semibold text-forest">{ids.length}</span>}
                  </Link>
                </li>
                <li className="lg:mt-2 lg:border-t lg:border-line lg:pt-2">
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-medium text-muted transition hover:bg-[#F6E7DF] hover:text-[#8A3B1E]"
                  >
                    <LogOut size={17} /> Sign out
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0 lg:pt-4">
            <div className="mb-6">
              <h2 className="text-[30px] font-medium leading-tight tracking-tight text-ink md:text-[36px]">{current.label}</h2>
              <p className="mt-1 text-sm text-muted">{current.blurb}</p>
            </div>

            {tab === 'overview' && (
              <div className="space-y-10">
                {/* Stats */}
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['Orders', orders.length, '/account/orders', Package],
                    ['Total spent', money(spent), '/account/orders', ShoppingBag],
                    ['Wishlist', ids.length, '/wishlist', Heart],
                    ['Addresses', addresses.length, '/account/addresses', MapPin],
                  ].map(([l, n, to, Icon]) => (
                    <li key={l}>
                      <Link to={to} className="group flex h-full flex-col rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-line/70 transition hover:-translate-y-1 hover:shadow-lift hover:ring-sage-soft">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-forest transition group-hover:bg-forest group-hover:text-white">
                          <Icon size={19} />
                        </span>
                        <span className="mt-4 font-serif text-[28px] font-semibold leading-none text-forest">{n}</span>
                        <span className="mt-1.5 flex items-center justify-between text-xs text-muted">
                          {l} <ArrowRight size={13} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Recent orders */}
                <div>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <Eyebrow>Recent orders</Eyebrow>
                    {orders.length > 2 && (
                      <Link to="/account/orders" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                        View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                  <Orders orders={orders} limit={2} />
                </div>

                {/* Wishlist preview */}
                {wished.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <Eyebrow>From your wishlist</Eyebrow>
                      <Link to="/wishlist" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                        View wishlist <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {wished.slice(0, 4).map((p) => (
                        <li key={p.id}>
                          <Link to={`/product/${p.slug}`} className="group block overflow-hidden rounded-[20px] bg-white ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:shadow-lift">
                            <ProductImage product={p} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
                            <span className="block truncate px-3 pt-2.5 text-sm font-semibold text-ink">{p.name}</span>
                            <span className="block px-3 pb-3 text-xs text-forest">{money(p.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Shortcuts */}
                <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-900 p-6 text-white md:p-8">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-botanical/50 blur-3xl" />
                  <p className="font-serif text-2xl text-white">
                    Keep your plants <em className="italic text-sage-soft">thriving</em>
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      [PackageSearch, 'Track an order', '/track-order'],
                      [Compass, 'Plant Finder', '/plant-finder'],
                      [BookOpen, 'Care guides', '/plant-care'],
                    ].map(([Icon, t, to]) => (
                      <li key={t}>
                        <Link to={to} className="group flex items-center gap-3 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.14]">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sage-soft">
                            <Icon size={18} />
                          </span>
                          <span className="flex-1 text-sm font-semibold">{t}</span>
                          <ArrowRight size={15} className="text-sage-soft transition-transform group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {tab === 'orders' && <Orders orders={orders} />}
            {tab === 'subscriptions' && <Subscriptions />}
            {tab === 'rewards' && <Rewards />}
            {tab === 'occasions' && <Occasions />}
            {tab === 'addresses' && <Addresses />}
            {tab === 'profile' && <Profile user={user} />}
          </div>
        </div>
      </section>
    </>
  );
}
