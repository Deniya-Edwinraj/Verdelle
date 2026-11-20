import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Check, Gift, Mail, PackageOpen, PauseCircle, Repeat, Sparkles, Sprout, Truck, User } from 'lucide-react';
import { SUBSCRIPTION_FREQUENCIES, SUBSCRIPTION_PLANS, planPrice } from '../data/services';
import { getProduct } from '../data/products';
import { ProductImage } from '../components/art/scenes';
import { Accordion, PageHero, money } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
      <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
      {children}
    </p>
  );
}

export default function Subscription() {
  usePageMeta('Plant Subscription', 'A new, healthy plant delivered every month or season — easy-care, pet-friendly or statement plants, with a matching planter.');
  const { user } = useAuth();
  const notify = useToast();
  const [subs, setSubs] = useLocalStorage('gn_subscriptions', []);
  const [plan, setPlan] = useState('pet-friendly');
  const [freq, setFreq] = useState('monthly');
  const [planter, setPlanter] = useState('White');
  const [gift, setGift] = useState(false);
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  const chosen = SUBSCRIPTION_PLANS.find((p) => p.key === plan);
  const price = planPrice(chosen, freq);
  const freqLabel = SUBSCRIPTION_FREQUENCIES.find((f) => f.key === freq).label.toLowerCase();

  const subscribe = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError(gift ? 'Add the recipient’s name' : 'Add your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address');
    setError('');
    const first = new Date();
    first.setDate(first.getDate() + 7);
    const sub = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      plan: chosen.key,
      planName: chosen.name,
      freq,
      price,
      planter,
      gift,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: 'active',
      started: new Date().toISOString(),
      nextDelivery: first.toISOString(),
    };
    setSubs((cur) => [sub, ...cur]);
    setDone(sub);
    notify(`Welcome to the ${chosen.name}!`);
    document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHero
        eyebrow="Plant subscription"
        title="A new plant, on repeat"
        subtitle="A healthy, hand-picked plant and matching planter delivered every month or season. Pause, skip or cancel any time."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Gifts', to: '/gifts' }, { label: 'Plant subscription' }]}
        plants={['monstera', 'calathea']}
      />

      {/* How it works */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ol className="grid gap-3 rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-4 md:p-4">
          {[
            [Sprout, 'Choose a club', 'Easy-care, pet-friendly or statement'],
            [Repeat, 'Pick how often', 'Monthly, every 2 or 3 months'],
            [PackageOpen, 'Unbox & enjoy', 'Plant, planter and a care card'],
            [PauseCircle, 'Total flexibility', 'Pause, skip or cancel any time'],
          ].map(([Icon, t, b], i) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl p-3">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={19} strokeWidth={1.7} />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-forest font-serif text-[10px] italic text-white">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Plans */}
      <section className="container py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Choose your club</Eyebrow>
            <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
              Plans for every <em className="font-normal italic text-botanical">plant parent</em>
            </h2>
          </div>
          <div className="inline-flex w-fit rounded-full bg-white p-1 shadow-soft ring-1 ring-line/70" role="radiogroup" aria-label="Delivery frequency">
            {SUBSCRIPTION_FREQUENCIES.map((f) => (
              <button
                key={f.key}
                role="radio"
                aria-checked={freq === f.key}
                onClick={() => setFreq(f.key)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${freq === f.key ? 'bg-forest text-white shadow-soft' : 'text-ink/70 hover:text-forest'}`}
              >
                {f.label}
                {f.note && <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${freq === f.key ? 'bg-white/20' : 'bg-clay/10 text-clay'}`}>{f.note}</span>}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-5 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((p) => {
            const on = p.key === plan;
            const samples = p.sample.map(getProduct).filter(Boolean);
            return (
              <li key={p.key}>
                <button
                  onClick={() => setPlan(p.key)}
                  aria-pressed={on}
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-[28px] p-6 text-left ring-1 transition duration-300 hover:-translate-y-1 md:p-7 ${
                    on ? 'bg-forest-900 text-white shadow-float ring-forest' : 'bg-white shadow-soft ring-line/70 hover:shadow-lift'
                  }`}
                >
                  {on && <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-botanical/50 blur-3xl" />}
                  <div className="relative flex items-start justify-between gap-3">
                    <p className={`font-serif text-2xl font-semibold ${on ? 'text-white' : 'text-ink'}`}>{p.name}</p>
                    {p.popular && <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${on ? 'bg-white/15 text-sage-soft' : 'bg-mist text-forest'}`}>Most popular</span>}
                  </div>
                  <p className={`relative mt-2 text-sm leading-relaxed ${on ? 'text-white/70' : 'text-muted'}`}>{p.blurb}</p>
                  <p className="relative mt-5">
                    <span className={`font-serif text-[40px] font-semibold leading-none ${on ? 'text-white' : 'text-forest'}`}>{money(planPrice(p, freq))}</span>
                    <span className={`ml-1 text-sm ${on ? 'text-white/60' : 'text-muted'}`}>/ delivery</span>
                  </p>
                  <ul className="relative mt-5 space-y-2">
                    {[...p.includes, 'Free delivery on every box'].map((t) => (
                      <li key={t} className={`flex items-start gap-2 text-sm ${on ? 'text-white/85' : 'text-ink/80'}`}>
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${on ? 'bg-white/15 text-sage-soft' : 'bg-mist text-forest'}`}>
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-auto pt-6">
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${on ? 'text-white/50' : 'text-muted'}`}>Plants you might receive</p>
                    <div className="mt-2 flex -space-x-3">
                      {samples.map((s) => (
                        <span key={s.id} className={`h-12 w-12 overflow-hidden rounded-full ring-2 ${on ? 'ring-forest-900' : 'ring-white'}`} title={s.name}>
                          <ProductImage product={s} className="h-full w-full" />
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="container scroll-mt-24 pb-14 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {done ? (
            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-8 text-center shadow-lift ring-1 ring-line/70 md:p-12">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900 shadow-float">
                <Check size={36} strokeWidth={2.5} />
              </span>
              <h2 className="mt-6 text-[30px] font-medium tracking-tight md:text-[36px]">
                Welcome to the <em className="font-normal italic text-botanical">{done.planName}</em>
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                {done.gift ? `${done.name}’s` : 'Your'} first box ships around{' '}
                <strong className="text-ink">{new Date(done.nextDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>. We’ve sent the details to{' '}
                <strong className="text-ink">{done.email}</strong>.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {user && (
                  <Link to="/account/subscriptions" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
                    Manage subscription <ArrowRight size={15} />
                  </Link>
                )}
                <button onClick={() => setDone(null)} className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-medium text-forest transition hover:border-forest">
                  Start another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={subscribe} noValidate className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8">
              <Eyebrow>Your details</Eyebrow>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  [false, 'For me', User],
                  [true, 'As a gift', Gift],
                ].map(([v, t, Icon]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGift(v)}
                    aria-pressed={gift === v}
                    className={`flex items-center gap-3 rounded-2xl p-4 text-left text-sm font-semibold ring-1 transition ${gift === v ? 'bg-forest text-white ring-forest' : 'bg-card/60 text-ink ring-line/70 hover:ring-sage'}`}
                  >
                    <Icon size={18} /> {t}
                  </button>
                ))}
              </div>

              <fieldset className="mt-6">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Planter colour</legend>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['White', '#F4F4F0'],
                    ['Sage', '#B7C8B5'],
                    ['Charcoal', '#3C4440'],
                    ['Terracotta', '#C98A62'],
                  ].map(([c, hex]) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPlanter(c)}
                      aria-pressed={planter === c}
                      className={`inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm ring-1 transition ${planter === c ? 'bg-white font-semibold text-forest ring-2 ring-forest' : 'bg-card/60 text-ink/80 ring-line/70 hover:ring-sage'}`}
                    >
                      <span className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ background: hex }} /> {c}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">{gift ? 'Recipient’s name' : 'Your name'}</span>
                  <span className="flex h-12 items-center gap-3 rounded-2xl bg-card/70 px-4 ring-1 ring-line/70 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-botanical/40">
                    <User size={16} className="text-muted" />
                    <input value={name} onChange={(e) => setName(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">{gift ? 'Your email (for updates)' : 'Email'}</span>
                  <span className="flex h-12 items-center gap-3 rounded-2xl bg-card/70 px-4 ring-1 ring-line/70 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-botanical/40">
                    <Mail size={16} className="text-muted" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" />
                  </span>
                </label>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}
              <p className="mt-4 text-xs text-muted">Delivery address and payment are confirmed in the next step. You can pause, skip or cancel any time from your account.</p>
            </form>
          )}

          {/* Summary */}
          <aside className="relative isolate h-fit overflow-hidden rounded-[32px] bg-forest-900 p-6 text-white shadow-float md:p-7 lg:sticky lg:top-24">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-botanical/50 blur-3xl" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">Your subscription</p>
            <p className="mt-2 font-serif text-2xl text-white">{chosen.name}</p>
            <ul className="mt-5 space-y-3 border-y border-white/10 py-5 text-sm">
              {[
                [Repeat, 'Delivery', SUBSCRIPTION_FREQUENCIES.find((f) => f.key === freq).label],
                [Sparkles, 'Planter', planter],
                [Truck, 'Shipping', 'Free'],
                [CalendarCheck, 'First box', 'Ships within 7 days'],
              ].map(([Icon, k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-white/65">
                    <Icon size={15} className="text-sage-soft" /> {k}
                  </span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-end justify-between">
              <span className="text-sm text-white/65">Per delivery</span>
              <span className="font-serif text-[36px] font-semibold leading-none">{money(price)}</span>
            </p>
            <button
              onClick={done ? () => setDone(null) : subscribe}
              className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-forest transition hover:bg-mist"
            >
              {done ? 'Start another subscription' : `Subscribe — ${money(price)} ${freqLabel}`}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-center text-[11px] text-white/50">Pause, skip or cancel any time.</p>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-3xl pb-16 md:pb-24">
        <Eyebrow>Good to know</Eyebrow>
        <h2 className="mb-6 mt-3 text-[28px] font-medium tracking-tight md:text-[34px]">
          Subscription <em className="font-normal italic text-botanical">questions</em>
        </h2>
        <div className="rounded-[24px] bg-white px-6 shadow-soft ring-1 ring-line/70">
          <Accordion
            defaultOpen={-1}
            items={[
              ['Will I get the same plant twice?', 'No — we keep track of what you’ve received and pick something new each time, matched to your club.'],
              ['Can I pause or skip a delivery?', 'Yes. Pause, skip or cancel any time from your account before your next box is packed.'],
              ['What if my plant arrives damaged?', 'Every subscription plant is covered by our plant guarantee — send us a photo and we’ll replace it.'],
              ['Can I give a subscription as a gift?', 'Absolutely — choose “As a gift” and we’ll include a gift note with the first box.'],
            ].map(([title, body]) => ({ title, content: <p>{body}</p> }))}
          />
        </div>
      </section>
    </>
  );
}
