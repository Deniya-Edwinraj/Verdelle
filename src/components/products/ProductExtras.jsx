import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellRing, CalendarPlus, Camera, Check, Clock, Download, ImagePlus, ShoppingBag, Star, Truck, X, Zap } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { getProduct, products, relatedProducts } from '../../data/products';
import { deliveryWindow, fmtDay, timeToCutoff, dispatchDate } from '../../utils/delivery';
import { ProductImage } from '../art/scenes';
import { RatingStars, money } from '../ui';
import { fmtDate } from '../../utils/format';

/* ------------------------------------------------------------------ */
/* Delivery estimate with a live cut-off countdown                     */
/* ------------------------------------------------------------------ */
export function DeliveryEstimate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const left = timeToCutoff(now);
  const std = deliveryWindow('standard', now);
  const exp = deliveryWindow('express', now);

  return (
    <div className="rounded-2xl bg-mist/50 p-4 ring-1 ring-sage-soft/50">
      <p className="flex items-center gap-2 text-sm text-forest">
        <Clock size={15} className="shrink-0 text-botanical" />
        {left ? (
          <span>
            Order within{' '}
            <strong className="tabular-nums">
              {left.h > 0 && `${left.h}h `}
              {left.m}m
            </strong>{' '}
            for dispatch <strong>today</strong>
          </span>
        ) : (
          <span>
            Order now for dispatch <strong>{fmtDay(dispatchDate(now))}</strong>
          </span>
        )}
      </p>
      <ul className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-ink/80">
          <Truck size={14} className="shrink-0 text-botanical" />
          <span>
            Standard: <strong className="text-ink">{fmtDay(std.from)} – {fmtDay(std.to)}</strong>
          </span>
        </li>
        <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-ink/80">
          <Zap size={14} className="shrink-0 text-clay" />
          <span>
            Express: <strong className="text-ink">{fmtDay(exp.from)} – {fmtDay(exp.to)}</strong>
          </span>
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Back-in-stock alert                                                  */
/* ------------------------------------------------------------------ */
export function StockAlert({ product }) {
  const [alerts, setAlerts] = useLocalStorage('gn_stock_alerts', []);
  const existing = alerts.find((a) => a.productId === product.id);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError('Please enter a valid email address');
    setError('');
    setAlerts((cur) => [...cur.filter((a) => a.productId !== product.id), { productId: product.id, email: v, date: new Date().toISOString() }]);
  };

  return (
    <div id="notify" className="scroll-mt-28 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-line/70">
      {existing ? (
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-white">
            <BellRing size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">You’re on the list</p>
            <p className="mt-0.5 text-sm text-muted">
              We’ll email <strong className="text-ink">{existing.email}</strong> as soon as {product.name} is back.
            </p>
            <button onClick={() => setAlerts((cur) => cur.filter((a) => a.productId !== product.id))} className="mt-2 text-xs font-medium text-botanical hover:underline">
              Cancel alert
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Bell size={17} className="text-botanical" /> Notify me when it’s back
          </p>
          <p className="mt-1 text-sm text-muted">Healthy new stock is growing in the greenhouse. Leave your email and we’ll let you know first.</p>
          <form onSubmit={submit} noValidate className="mt-4">
            <label htmlFor="stock-email" className="sr-only">
              Email address
            </label>
            <div className={`flex items-center gap-2 rounded-full bg-card/70 p-1 pl-4 ring-1 transition focus-within:bg-white focus-within:ring-2 ${error ? 'ring-red-700/50' : 'ring-line/70 focus-within:ring-botanical/40'}`}>
              <input
                id="stock-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!error}
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button className="h-10 shrink-0 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-botanical">Notify me</button>
            </div>
            {error && (
              <p className="mt-2 pl-4 text-xs text-red-800" role="alert">
                {error}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Watering reminder (.ics download + Google Calendar)                 */
/* ------------------------------------------------------------------ */
const INTERVAL = { Weekly: 7, 'Every 1–2 weeks': 10, 'Every 2–3 weeks': 17, 'Every 3–4 weeks': 24 };

function pad(n) {
  return String(n).padStart(2, '0');
}
function icsDate(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

export function CareReminder({ product }) {
  const days = INTERVAL[product.watering] || 7;
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 15 * 60000);
  const title = `Check & water your ${product.name}`;
  const details = `Push a finger into the soil — water only if the top few centimetres feel dry. Care guide: ${window.location.origin}/product/${product.slug}`;
  const rrule = `RRULE:FREQ=DAILY;INTERVAL=${days};COUNT=26`;

  const download = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Verdelle//Care Reminder//EN',
      'BEGIN:VEVENT',
      `UID:${product.id}-${Date.now()}@verdelle`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      rrule,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/,/g, '\\,')}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT0M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${title}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.slug}-watering-reminder.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${icsDate(start)}/${icsDate(end)}&recur=${encodeURIComponent(rrule)}`;

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-line/70">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-forest">
          <CalendarPlus size={18} />
        </span>
        <div>
          <p className="font-semibold text-ink">Never forget to water</p>
          <p className="mt-0.5 text-sm text-muted">
            Add a reminder to check your {product.name} every <strong className="text-ink">{days} days</strong> — adjust it as you learn your plant.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white transition hover:bg-botanical"
        >
          <CalendarPlus size={14} /> Google Calendar
        </a>
        <button onClick={download} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-forest transition hover:border-forest">
          <Download size={14} /> Apple / Outlook (.ics)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frequently bought together                                           */
/* ------------------------------------------------------------------ */
export function BoughtTogether({ product }) {
  const cart = useCart();
  const { openCart } = useUI();
  const bundle = useMemo(() => {
    const inStock = (p) => p && p.stock !== 'out-of-stock' && p.id !== product.id;
    if (product.type === 'plant') {
      const planter = [getProduct('ceramic-planter'), getProduct('terracotta-pot-set')].find(inStock);
      const companion = relatedProducts(product, 4).find(inStock);
      return [product, planter, companion].filter(Boolean);
    }
    const plants = products.filter((p) => p.type === 'plant' && inStock(p)).sort((a, b) => b.popularity - a.popularity);
    return [product, ...plants.slice(0, 2)];
  }, [product]);
  const [picked, setPicked] = useState(() => bundle.map((p) => p.id));
  useEffect(() => setPicked(bundle.map((p) => p.id)), [bundle]);

  if (bundle.length < 2 || product.stock === 'out-of-stock') return null;
  const chosen = bundle.filter((p) => picked.includes(p.id));
  const total = chosen.reduce((s, p) => s + p.price, 0);

  const addAll = () => {
    chosen.forEach((p) => cart.add(p));
    openCart({ product: chosen[0], size: chosen[0].sizes[0].label, pot: chosen[0].potOptions[0]?.label || null, qty: 1 });
  };

  return (
    <section className="container py-12 md:py-16" aria-labelledby="fbt">
      <div className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-10">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
          <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
          Complete the look
        </p>
        <h2 id="fbt" className="mt-3 text-[28px] font-medium tracking-tight md:text-[36px]">
          Frequently bought <em className="font-normal italic text-botanical">together</em>
        </h2>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_300px]">
          <ul className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {bundle.map((p, i) => {
              const on = picked.includes(p.id);
              return (
                <li key={p.id} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-stretch">
                  <label
                    className={`group relative flex flex-1 cursor-pointer items-center gap-3 rounded-[22px] p-2.5 ring-1 transition sm:flex-col sm:items-stretch ${
                      on ? 'bg-white shadow-soft ring-sage' : 'bg-card/50 opacity-60 ring-line/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={i === 0}
                      onChange={() => setPicked((cur) => (cur.includes(p.id) ? cur.filter((x) => x !== p.id) : [...cur, p.id]))}
                      className="absolute left-4 top-4 z-10"
                      aria-label={`Include ${p.name}`}
                    />
                    <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-card sm:h-auto sm:w-full">
                      <ProductImage product={p} className="aspect-square w-full" />
                    </span>
                    <span className="min-w-0 sm:px-1.5 sm:pb-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-sage">{i === 0 ? 'This item' : p.plantType}</span>
                      <Link to={`/product/${p.slug}`} className="block truncate font-serif text-[15px] font-semibold text-ink hover:text-botanical">
                        {p.name}
                      </Link>
                      <span className="text-sm font-semibold text-forest">{money(p.price)}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="rounded-[24px] bg-forest-900 p-6 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
              {chosen.length} {chosen.length === 1 ? 'item' : 'items'} selected
            </p>
            <p className="mt-1 font-serif text-[34px] font-semibold leading-none">{money(total)}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-white/75">
              {chosen.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <Check size={12} className="text-sage-soft" /> {p.name}
                </li>
              ))}
            </ul>
            <button
              onClick={addAll}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-forest transition hover:bg-mist"
            >
              <ShoppingBag size={15} /> Add {chosen.length > 1 ? `all ${chosen.length}` : ''} to cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews: list + write-a-review form with optional photo             */
/* ------------------------------------------------------------------ */
function shrinkImage(file, max = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star size={28} strokeWidth={1.4} className={(hover || value) >= n ? 'fill-[#E2A93B] text-[#E2A93B]' : 'text-line'} />
        </button>
      ))}
    </div>
  );
}

export function ReviewsPanel({ product, seeded }) {
  const [all, setAll] = useLocalStorage('gn_reviews', {});
  const mine = all[product.id] || [];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const notify = useToast();

  const reviews = [...mine, ...seeded];
  const count = product.reviewCount + mine.length;
  const avg = mine.length ? (product.rating * product.reviewCount + mine.reduce((s, r) => s + r.rating, 0)) / count : product.rating;
  const breakdown = [5, 4, 3, 2, 1].map((n) => {
    const local = reviews.filter((r) => Math.round(r.rating) === n).length;
    return [n, reviews.length ? local / reviews.length : 0];
  });

  const pickPhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('Please choose an image file');
    if (f.size > 8 * 1024 * 1024) return setError('Please choose an image under 8 MB');
    try {
      setPhoto(await shrinkImage(f));
      setError('');
    } catch {
      setError('We couldn’t read that image — try another one');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!rating) return setError('Please choose a star rating');
    if (name.trim().length < 2) return setError('Please add your name');
    if (body.trim().length < 10) return setError('Tell us a little more — at least 10 characters');
    const review = { id: `u-${Date.now()}`, rating, name: name.trim(), title: title.trim(), body: body.trim(), photo, date: new Date().toISOString(), mine: true };
    setAll((cur) => ({ ...cur, [product.id]: [review, ...(cur[product.id] || [])] }));
    setOpen(false);
    setRating(0);
    setName('');
    setTitle('');
    setBody('');
    setPhoto(null);
    setError('');
    notify('Thank you — your review has been posted');
  };

  return (
    <div>
      {/* Summary */}
      <div className="grid gap-6 rounded-2xl bg-card/60 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div>
          <span className="font-serif text-5xl font-semibold leading-none text-forest">{avg.toFixed(1)}</span>
          <RatingStars rating={avg} size={15} className="mt-2" />
          <p className="mt-1 text-xs text-muted">{count} reviews</p>
        </div>
        <ul className="space-y-1.5">
          {breakdown.map(([n, share]) => (
            <li key={n} className="flex items-center gap-2 text-xs text-muted">
              <span className="w-3">{n}</span>
              <Star size={11} className="fill-[#E2A93B] text-[#E2A93B]" />
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                <span className="block h-full rounded-full bg-botanical" style={{ width: `${share * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-botanical"
        >
          {open ? <X size={15} /> : <Star size={15} />} {open ? 'Cancel' : 'Write a review'}
        </button>
      </div>

      {/* Form */}
      {open && (
        <form onSubmit={submit} noValidate className="mt-5 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-line/70 motion-safe:animate-fade-up">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Your rating</p>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="field rounded-xl" placeholder="e.g. Priya S." />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Headline (optional)</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} className="field rounded-xl" placeholder="Arrived healthy and happy" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Your review</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={600} rows={4} className="field resize-y rounded-xl" placeholder="How did it arrive? How is it settling in?" />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="sr-only" id={`photo-${product.id}`} />
            {photo ? (
              <span className="relative">
                <img src={photo} alt="Your review photo" className="h-20 w-20 rounded-xl object-cover ring-1 ring-line" />
                <button type="button" onClick={() => setPhoto(null)} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-forest text-white shadow" aria-label="Remove photo">
                  <X size={12} />
                </button>
              </span>
            ) : (
              <label htmlFor={`photo-${product.id}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-sage px-4 py-2.5 text-sm font-medium text-forest transition hover:bg-mist/50">
                <ImagePlus size={16} /> Add a photo (optional)
              </label>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition hover:bg-botanical">Post review</button>
        </form>
      )}

      {/* List */}
      <ul className="mt-4 divide-y divide-line">
        {reviews.map((r) => (
          <li key={r.id} className="py-5">
            <div className="flex items-center justify-between gap-3">
              <RatingStars rating={r.rating} size={13} />
              <span className="text-xs text-muted">{fmtDate(r.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {r.title && <p className="mt-2 font-semibold text-ink">{r.title}</p>}
            <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{r.body}</p>
            {r.photo && <img src={r.photo} alt={`Photo from ${r.name}`} className="mt-3 h-28 w-28 rounded-xl object-cover ring-1 ring-line" loading="lazy" />}
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-mist text-[10px] font-semibold uppercase text-forest">{r.name.charAt(0)}</span>
              {r.name}
              {r.mine && <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold text-forest">Your review</span>}
              {r.photo && <Camera size={12} className="text-muted" aria-label="Includes photo" />}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
