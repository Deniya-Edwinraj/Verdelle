import { useState } from 'react';
import { ArrowRight, Building2, CalendarCheck, Check, HeartPulse, Leaf, RefreshCcw, Send, Sparkles, Truck, Wrench } from 'lucide-react';
import { RENTAL_PLANS } from '../data/services';
import { PageHero, money } from '../components/ui';
import { EditorialScene } from '../components/art/scenes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

export default function OfficePlants() {
  usePageMeta('Office Plant Rental', 'Plant rental for offices and workplaces — plants, planters, installation, regular care visits and free replacements for one monthly fee.');
  const notify = useToast();
  const [, setRequests] = useLocalStorage('gn_rental_requests', []);
  const [plan, setPlan] = useState('workplace');
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', employees: '', notes: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please add your name');
    if (form.company.trim().length < 2) return setError('Please add your company name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address');
    setError('');
    const req = { id: `RENT-${Date.now().toString().slice(-6)}`, plan, ...form, date: new Date().toISOString() };
    setRequests((cur) => [req, ...cur]);
    setSent(req);
    notify('Thanks — our workplace team will be in touch');
  };

  const input = 'h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40';
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70';

  return (
    <>
      <PageHero
        eyebrow="Plants for business"
        title="Office plant rental"
        subtitle="Beautiful, healthy plants for your workplace — designed, installed and cared for by us, for one simple monthly fee."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Office plants' }]}
        plants={['areca', 'snake']}
      />

      {/* Benefits */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ul className="grid grid-cols-2 gap-3 rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-4 md:p-4">
          {[
            [Sparkles, 'Designed for you', 'A plant plan for your space'],
            [Truck, 'Delivered & installed', 'Plants, planters and placement'],
            [Wrench, 'Regular care visits', 'Watering, pruning, cleaning'],
            [RefreshCcw, 'Free replacements', 'Any plant that struggles is swapped'],
          ].map(([Icon, t, b]) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl p-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={19} strokeWidth={1.7} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Plans */}
      <section className="container py-14 md:py-20">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
          <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
          Rental plans
        </p>
        <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
          One monthly fee. <em className="font-normal italic text-botanical">Zero plant stress.</em>
        </h2>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {RENTAL_PLANS.map((p) => {
            const on = plan === p.key;
            return (
              <li key={p.key}>
                <button
                  onClick={() => {
                    setPlan(p.key);
                    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-[28px] p-7 text-left ring-1 transition duration-300 hover:-translate-y-1 ${on ? 'bg-forest-900 text-white shadow-float ring-forest' : 'bg-white shadow-soft ring-line/70 hover:shadow-lift'}`}
                >
                  {on && <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-botanical/50 blur-3xl" />}
                  <span className="relative flex items-start justify-between gap-3">
                    <span className={`font-serif text-[28px] font-semibold ${on ? 'text-white' : 'text-ink'}`}>{p.name}</span>
                    {p.popular && <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${on ? 'bg-white/15 text-sage-soft' : 'bg-mist text-forest'}`}>Most popular</span>}
                  </span>
                  <span className={`relative text-sm ${on ? 'text-white/65' : 'text-muted'}`}>
                    {p.plants} · {p.ideal}
                  </span>
                  <span className="relative mt-6">
                    {p.price ? (
                      <>
                        <span className="text-sm text-muted">from </span>
                        <span className={`font-serif text-[40px] font-semibold leading-none ${on ? 'text-white' : 'text-forest'}`}>{money(p.price)}</span>
                        <span className={`text-sm ${on ? 'text-white/60' : 'text-muted'}`}> / month</span>
                      </>
                    ) : (
                      <span className={`font-serif text-[32px] font-semibold ${on ? 'text-white' : 'text-forest'}`}>Custom quote</span>
                    )}
                  </span>
                  <ul className="relative mt-6 space-y-2">
                    {p.perks.map((t) => (
                      <li key={t} className={`flex items-center gap-2 text-sm ${on ? 'text-white/85' : 'text-ink/80'}`}>
                        <Check size={15} className={on ? 'text-sage-soft' : 'text-botanical'} /> {t}
                      </li>
                    ))}
                  </ul>
                  <span className={`relative mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold ${on ? 'text-sage-soft' : 'text-forest'}`}>
                    Get a quote <ArrowRight size={15} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [HeartPulse, 'Wellbeing', 'Plants help create calmer, more welcoming workspaces.'],
            [CalendarCheck, 'Flexible terms', '12-month plans with easy upgrades as you grow.'],
            [Leaf, 'Sustainable', 'Healthy plants are re-homed or composted, never landfilled.'],
          ].map(([Icon, t, b]) => (
            <li key={t} className="flex gap-3 rounded-2xl bg-mist/50 p-4">
              <Icon size={18} className="mt-0.5 shrink-0 text-botanical" />
              <span>
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quote */}
      <section id="quote" className="container scroll-mt-24 pb-16 md:pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative hidden overflow-hidden rounded-[32px] shadow-lift lg:block">
            <EditorialScene kind="shelf" label="Plants in a bright workspace" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
            <p className="absolute inset-x-8 bottom-8 font-serif text-[30px] leading-tight text-white">
              Greener spaces, <em className="italic text-sage-soft">happier teams</em>
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900">
                  <Check size={30} strokeWidth={2.5} />
                </span>
                <p className="mt-5 font-serif text-2xl">
                  Quote request <em className="italic text-botanical">received</em>
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted">Thanks, {sent.name.split(' ')[0]}! We’ll contact you at {sent.email} within 1 business day to arrange a free site visit.</p>
                <p className="mt-3 text-xs text-muted">Reference {sent.id}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">
                  <Building2 size={14} /> Free quote & site visit
                </p>
                <p className="mt-2 font-serif text-2xl text-ink">
                  Tell us about your <em className="italic text-botanical">workplace</em>
                </p>
                <div className="mt-6 grid gap-1 rounded-full bg-card p-1 sm:grid-cols-3">
                  {RENTAL_PLANS.map((p) => (
                    <button key={p.key} type="button" onClick={() => setPlan(p.key)} aria-pressed={plan === p.key} className={`rounded-full py-2 text-sm font-semibold transition ${plan === p.key ? 'bg-forest text-white shadow-soft' : 'text-ink/70 hover:text-forest'}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={label}>Your name</span>
                    <input value={form.name} onChange={set('name')} className={input} />
                  </label>
                  <label className="block">
                    <span className={label}>Company</span>
                    <input value={form.company} onChange={set('company')} className={input} />
                  </label>
                  <label className="block">
                    <span className={label}>Work email</span>
                    <input type="email" value={form.email} onChange={set('email')} className={input} />
                  </label>
                  <label className="block">
                    <span className={label}>Phone (optional)</span>
                    <input type="tel" value={form.phone} onChange={set('phone')} className={input} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Team size</span>
                    <select value={form.employees} onChange={set('employees')} className={input}>
                      <option value="">Choose…</option>
                      {['1–10', '11–50', '51–200', '200+'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className={label}>About your space (optional)</span>
                  <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Floor area, light, number of locations, any timelines…" className="w-full resize-none rounded-2xl bg-card/70 p-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40" />
                </label>
                {error && (
                  <p className="mt-3 text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}
                <button className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical">
                  <Send size={15} /> Request my free quote
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
