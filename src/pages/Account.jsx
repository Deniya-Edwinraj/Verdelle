import { useState } from 'react';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, LogOut, MapPin, Package, Pencil, Plus, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { DemoNotice, EmptyState, Field, money } from '../components/ui';
import { addressSchema } from './Checkout';
import { usePageMeta } from '../hooks/usePageMeta';

const TABS = [
  { key: 'overview', label: 'Dashboard', to: '/account', icon: User },
  { key: 'orders', label: 'Orders', to: '/account/orders', icon: Package },
  { key: 'addresses', label: 'Addresses', to: '/account/addresses', icon: MapPin },
  { key: 'profile', label: 'Profile', to: '/account/profile', icon: Pencil },
];

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'medium' });

function Orders({ orders, limit }) {
  if (!orders.length)
    return (
      <EmptyState icon={Package} title="No orders yet" body="When you place an order it will appear here." action={<Link to="/shop" className="btn-primary">Start shopping</Link>} />
    );
  return (
    <ul className="space-y-4">
      {orders.slice(0, limit).map((o) => (
        <li key={o.number} className="rounded-xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{o.number}</p>
              <p className="text-xs text-muted">Placed {fmt(o.date)}</p>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-forest">{o.status}</span>
          </div>
          <p className="mt-3 text-sm text-muted">{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold">{money(o.total)}</span>
            <Link to={`/track-order?order=${o.number}`} className="text-forest underline">
              Track order
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

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
      className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2"
    >
      <Field label="First name" error={errors.firstName?.message} {...register('firstName')} />
      <Field label="Last name" error={errors.lastName?.message} {...register('lastName')} />
      <Field className="sm:col-span-2" label="Street address" error={errors.address1?.message} {...register('address1')} />
      <Field className="sm:col-span-2" label="Apartment, suite (optional)" {...register('address2')} />
      <Field label="City" error={errors.city?.message} {...register('city')} />
      <Field label="State / Province" error={errors.state?.message} {...register('state')} />
      <Field label="Postcode" error={errors.postcode?.message} {...register('postcode')} />
      <Field label="Country" error={errors.country?.message} {...register('country')} />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" {...register('isDefault')} className="" /> Set as default address
      </label>
      <div className="flex gap-3 sm:col-span-2">
        <button className="btn-primary">Save address</button>
        <button type="button" onClick={onDone} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Addresses() {
  const { addresses, removeAddress } = useAuth();
  const [editing, setEditing] = useState(null); // null | 'new' | address
  return (
    <div>
      {editing ? (
        <AddressForm initial={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
      ) : (
        <button onClick={() => setEditing('new')} className="btn-outline mb-5">
          <Plus size={15} /> Add address
        </button>
      )}
      {!editing && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-xl border border-line bg-white p-5 text-sm">
              {a.isDefault && <span className="mb-2 inline-block rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Default</span>}
              <p className="font-medium">
                {a.firstName} {a.lastName}
              </p>
              <p className="mt-1 text-muted">
                {a.address1}
                {a.address2 && `, ${a.address2}`}
                <br />
                {a.city}, {a.state} {a.postcode}
                <br />
                {a.country}
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEditing(a)} className="btn-ghost px-3 py-1.5 text-xs">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => removeAddress(a.id)} className="btn-ghost px-3 py-1.5 text-xs text-red-800 hover:bg-red-50">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </li>
          ))}
          {!addresses.length && <p className="text-sm text-muted">No saved addresses yet.</p>}
        </ul>
      )}
    </div>
  );
}

function Profile({ user }) {
  const { updateProfile } = useAuth();
  const notify = useToast();
  const schema = z.object({ firstName: z.string().trim().min(1, 'Required'), lastName: z.string().trim().optional(), email: z.string().trim().email('Enter a valid email') });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: user });
  return (
    <form
      noValidate
      onSubmit={handleSubmit((d) => {
        updateProfile(d);
        notify('Profile updated');
      })}
      className="grid max-w-xl gap-4 rounded-xl border border-line bg-white p-6 sm:grid-cols-2"
    >
      <Field label="First name" error={errors.firstName?.message} {...register('firstName')} />
      <Field label="Last name" {...register('lastName')} />
      <Field className="sm:col-span-2" label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <button className="btn-primary w-fit">Save changes</button>
    </form>
  );
}

export default function Account({ tab }) {
  const { user, logout, orders, addresses } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  usePageMeta('My Account');
  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />;
  const current = TABS.find((t) => t.key === tab);

  return (
    <section className="container py-10 md:py-14">
      <p className="eyebrow">My account</p>
      <h1 className="mt-2 text-4xl">Hello, {user.firstName}</h1>
      <DemoNotice className="mt-5 max-w-3xl">Demo account — your profile, addresses and orders are stored only in this browser.</DemoNotice>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <li key={t.key}>
                <NavLink
                  to={t.to}
                  end
                  className={({ isActive }) => `flex items-center gap-2.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm ${isActive ? 'bg-forest text-white' : 'hover:bg-mist/60'}`}
                >
                  <t.icon size={16} /> {t.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/wishlist" className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm hover:bg-mist/60">
                <Heart size={16} /> Wishlist
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm hover:bg-mist/60"
              >
                <LogOut size={16} /> Sign out
              </button>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-5 text-2xl">{current.label}</h2>
          {tab === 'overview' && (
            <div className="space-y-8">
              <ul className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Orders', orders.length, '/account/orders', Package],
                  ['Saved addresses', addresses.length, '/account/addresses', MapPin],
                  ['Wishlist', ids.length, '/wishlist', Heart],
                ].map(([l, n, to, Icon]) => (
                  <li key={l}>
                    <Link to={to} className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 transition hover:border-forest">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-card text-forest">
                        <Icon size={19} />
                      </span>
                      <span>
                        <span className="block font-serif text-2xl">{n}</span>
                        <span className="text-xs text-muted">{l}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="mb-3 font-sans text-sm font-semibold">Recent orders</h3>
                <Orders orders={orders} limit={2} />
              </div>
            </div>
          )}
          {tab === 'orders' && <Orders orders={orders} />}
          {tab === 'addresses' && <Addresses />}
          {tab === 'profile' && <Profile user={user} />}
        </div>
      </div>
    </section>
  );
}
