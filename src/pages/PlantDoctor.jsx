import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, BookOpen, Bug, CalendarDays, Check, Clock, Droplets, ImagePlus, Leaf, Mail, MessageCircle, Sprout, Stethoscope, Sun, TrendingUp, Video, Wind, X,
} from 'lucide-react';
import { SYMPTOMS } from '../data/services';
import { getGuide } from '../data/careGuides';
import { PageHero, money } from '../components/ui';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

const ICONS = { yellow: Leaf, 'brown-tips': Wind, drooping: Droplets, spots: Sun, pests: Bug, leggy: TrendingUp };
const CONSULT_PRICE = 19;
const SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00'];

function Eyebrow({ children, light }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-sage-soft' : 'text-botanical'}`}>
      <span aria-hidden="true" className={`h-px w-10 ${light ? 'bg-sage-soft/60' : 'bg-botanical/60'}`} />
      {children}
    </p>
  );
}

function shrink(file, max = 800) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const nextDays = () =>
  Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  })
    .filter((d) => d.getDay() !== 0)
    .slice(0, 6);

export default function PlantDoctor() {
  usePageMeta('Plant Doctor', 'Diagnose yellow leaves, brown tips, drooping and pests — or ask the Verdelle plant team for personal advice.');
  const notify = useToast();
  const [requests, setRequests] = useLocalStorage('gn_doctor_requests', []);
  const [picked, setPicked] = useState([]);
  const [mode, setMode] = useState('ask'); // ask | video
  const [form, setForm] = useState({ name: '', email: '', plant: '', details: '' });
  const [photo, setPhoto] = useState(null);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const days = nextDays();

  const toggle = (k) => setPicked((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  const results = SYMPTOMS.filter((s) => picked.includes(s.key));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickPhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('Please choose an image file');
    try {
      setPhoto(await shrink(f));
      setError('');
    } catch {
      setError('We couldn’t read that image — try another one');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please add your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address');
    if (mode === 'ask' && form.details.trim().length < 10) return setError('Tell us a little more about what you’re seeing');
    if (mode === 'video' && (!day || !slot)) return setError('Choose a day and time for your call');
    setError('');
    const req = {
      id: `PD-${Date.now().toString().slice(-6)}`,
      mode,
      ...form,
      symptoms: picked,
      photo,
      when: mode === 'video' ? `${day.toDateString()} ${slot}` : null,
      date: new Date().toISOString(),
    };
    setRequests((cur) => [req, ...cur]);
    setSent(req);
    notify(mode === 'video' ? 'Your consultation is booked' : 'Your question has been sent to our plant team');
  };

  const inputCls = 'h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40';
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70';

  return (
    <>
      <PageHero
        eyebrow="Plant Doctor"
        title="What’s wrong with my plant?"
        subtitle="Pick the symptoms you’re seeing for instant advice — or ask our plant team for a personal diagnosis."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Plant Care', to: '/plant-care' }, { label: 'Plant Doctor' }]}
        plants={['calathea', 'boston-fern']}
      />

      {/* Symptom checker */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <div className="rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-line/70 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Step 1 · Symptom checker</Eyebrow>
              <h2 className="mt-3 text-[26px] font-medium tracking-tight md:text-[32px]">
                What are you <em className="font-normal italic text-botanical">noticing?</em>
              </h2>
              <p className="mt-1 text-sm text-muted">Select everything that applies.</p>
            </div>
            {picked.length > 0 && (
              <button onClick={() => setPicked([])} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-muted transition hover:bg-card hover:text-forest">
                <X size={13} /> Clear
              </button>
            )}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {SYMPTOMS.map((s) => {
              const Icon = ICONS[s.key] || Leaf;
              const on = picked.includes(s.key);
              return (
                <li key={s.key}>
                  <button
                    onClick={() => toggle(s.key)}
                    aria-pressed={on}
                    className={`group relative flex h-full w-full flex-col items-start rounded-[22px] p-4 text-left ring-1 transition duration-300 hover:-translate-y-0.5 ${
                      on ? 'bg-forest text-white shadow-float ring-forest' : 'bg-card/60 ring-line/70 hover:bg-white hover:shadow-lift hover:ring-sage-soft'
                    }`}
                  >
                    {on && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-white/20">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <span className={`grid h-11 w-11 place-items-center rounded-2xl ${on ? 'bg-white/15 text-sage-soft' : 'bg-white text-forest'}`}>
                      <Icon size={19} strokeWidth={1.7} />
                    </span>
                    <span className={`mt-4 text-sm font-semibold leading-snug ${on ? 'text-white' : 'text-ink'}`}>{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Results */}
      <section className="container py-12 md:py-16">
        {results.length === 0 ? (
          <div className="flex flex-col items-center rounded-[28px] border-2 border-dashed border-line px-6 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mist text-forest">
              <Stethoscope size={26} strokeWidth={1.6} />
            </span>
            <p className="mt-5 font-serif text-2xl text-ink">
              Select a symptom to see a <em className="italic text-botanical">diagnosis</em>
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-muted">We’ll show the most likely causes and exactly what to do next.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Eyebrow>Step 2 · Likely causes</Eyebrow>
              <h2 className="mt-3 text-[26px] font-medium tracking-tight md:text-[32px]">
                Here’s what might be <em className="font-normal italic text-botanical">going on</em>
              </h2>
            </div>
            {results.map((s) => {
              const guide = getGuide(s.guide);
              const Icon = ICONS[s.key] || Leaf;
              return (
                <article key={s.key} className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8 motion-safe:animate-fade-up">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-3 font-serif text-2xl text-ink">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white">
                        <Icon size={19} />
                      </span>
                      {s.label}
                    </p>
                    {guide && (
                      <Link to={`/plant-care/${guide.slug}`} className="group inline-flex items-center gap-1.5 rounded-full bg-mist/70 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white">
                        <BookOpen size={13} /> {guide.title} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                  <ol className="mt-6 grid gap-3 md:grid-cols-3">
                    {s.causes.map(([cause, sign, fix], i) => (
                      <li key={cause} className="flex flex-col rounded-2xl bg-card/60 p-5 ring-1 ring-line/60">
                        <span className="flex items-center justify-between">
                          <span className="font-semibold text-ink">{cause}</span>
                          <span className="font-serif text-sm italic text-sage">{i === 0 ? 'Most likely' : `0${i + 1}`}</span>
                        </span>
                        <span className="mt-2 flex gap-2 text-sm text-muted">
                          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-clay" /> {sign}
                        </span>
                        <span className="mt-3 flex gap-2 border-t border-line pt-3 text-sm text-ink/85">
                          <Sprout size={14} className="mt-0.5 shrink-0 text-botanical" /> {fix}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Ask an expert */}
      <section id="ask" className="relative isolate scroll-mt-24 overflow-hidden bg-forest-900 py-14 text-white md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-botanical/45 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow light>Step 3 · Still unsure?</Eyebrow>
            <h2 className="mt-4 text-[32px] font-medium leading-tight tracking-tight text-white md:text-[44px]">
              Ask our <em className="font-normal italic text-sage-soft">plant team</em>
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Send a photo and a few details and one of our plant specialists will reply with a personal diagnosis — even if your plant didn’t come from us.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                [MessageCircle, 'Free photo diagnosis', 'Usually answered within 1–2 business days'],
                [Video, `20-minute video consultation · ${money(CONSULT_PRICE)}`, 'Show us your plant and space, live'],
                [Leaf, 'For any plant', 'Wherever you bought it'],
              ].map(([Icon, t, b]) => (
                <li key={t} className="flex items-center gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sage-soft">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{t}</span>
                    <span className="block text-xs text-white/60">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] bg-warm p-6 text-ink shadow-float md:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900">
                  <Check size={30} strokeWidth={2.5} />
                </span>
                <p className="mt-5 font-serif text-2xl">
                  {sent.mode === 'video' ? 'Consultation ' : 'Question '}
                  <em className="italic text-botanical">{sent.mode === 'video' ? 'booked' : 'received'}</em>
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  {sent.mode === 'video'
                    ? `We’ll email a video link to ${sent.email} before your call on ${sent.when}.`
                    : `Thanks, ${sent.name.split(' ')[0]}! A plant specialist will reply to ${sent.email} within 1–2 business days.`}
                </p>
                <p className="mt-3 text-xs text-muted">Reference {sent.id}</p>
                <button onClick={() => { setSent(null); setForm({ name: '', email: '', plant: '', details: '' }); setPhoto(null); setDay(null); setSlot(null); }} className="mt-6 rounded-full border border-line px-6 py-2.5 text-sm font-medium text-forest transition hover:border-forest">
                  Ask another question
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid grid-cols-2 gap-1 rounded-full bg-card p-1" role="tablist" aria-label="How would you like help?">
                  {[
                    ['ask', 'Ask a question', MessageCircle],
                    ['video', 'Book a video call', Video],
                  ].map(([k, t, Icon]) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={mode === k}
                      onClick={() => setMode(k)}
                      className={`inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${mode === k ? 'bg-forest text-white shadow-soft' : 'text-ink/70 hover:text-forest'}`}
                    >
                      <Icon size={15} /> {t}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={label}>Your name</span>
                    <input value={form.name} onChange={set('name')} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={label}>Email</span>
                    <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Which plant? (optional)</span>
                    <input value={form.plant} onChange={set('plant')} placeholder="e.g. Fiddle-leaf fig" className={inputCls} />
                  </label>
                </div>

                {mode === 'ask' ? (
                  <>
                    <label className="mt-4 block">
                      <span className={label}>What’s happening?</span>
                      <textarea
                        value={form.details}
                        onChange={set('details')}
                        rows={4}
                        placeholder="Where it lives, how often you water, when you noticed the problem…"
                        className="w-full resize-none rounded-2xl bg-card/70 p-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40"
                      />
                    </label>
                    <div className="mt-3">
                      <input id="pd-photo" type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
                      {photo ? (
                        <span className="relative inline-block">
                          <img src={photo} alt="Your plant" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-line" />
                          <button type="button" onClick={() => setPhoto(null)} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-forest text-white shadow" aria-label="Remove photo">
                            <X size={12} />
                          </button>
                        </span>
                      ) : (
                        <label htmlFor="pd-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-sage px-4 py-2.5 text-sm font-medium text-forest transition hover:bg-mist/50">
                          <ImagePlus size={16} /> Add a photo — it helps a lot
                        </label>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-5">
                    <p className={label}>Choose a day</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {days.map((d) => {
                        const on = day?.toDateString() === d.toDateString();
                        return (
                          <button
                            key={d.toDateString()}
                            type="button"
                            onClick={() => setDay(d)}
                            aria-pressed={on}
                            className={`flex flex-col items-center rounded-2xl py-2.5 ring-1 transition ${on ? 'bg-forest text-white ring-forest' : 'bg-white ring-line/70 hover:ring-sage'}`}
                          >
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${on ? 'text-white/70' : 'text-muted'}`}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="font-serif text-lg font-semibold">{d.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className={`${label} mt-4`}>Choose a time</p>
                    <div className="flex flex-wrap gap-2">
                      {SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSlot(t)}
                          aria-pressed={slot === t}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm ring-1 transition ${slot === t ? 'bg-forest font-semibold text-white ring-forest' : 'bg-white text-ink/80 ring-line/70 hover:ring-sage'}`}
                        >
                          <Clock size={13} /> {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mt-4 text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}
                <button className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical">
                  {mode === 'video' ? (
                    <>
                      <CalendarDays size={15} /> Book consultation · {money(CONSULT_PRICE)}
                    </>
                  ) : (
                    <>
                      <Mail size={15} /> Send to our plant team
                    </>
                  )}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
                {picked.length > 0 && <p className="mt-3 text-center text-xs text-muted">We’ll include the symptoms you selected above.</p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
