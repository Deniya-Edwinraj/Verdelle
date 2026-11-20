import { useState } from 'react';
import { Building2, Camera, Check, Home, ImagePlus, Lightbulb, Palette, PencilRuler, Send, Truck, X } from 'lucide-react';
import { PageHero } from '../components/ui';
import { EditorialScene } from '../components/art/scenes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

const ROOMS = ['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Home office', 'Whole home'];
const LIGHT = ['Low', 'Medium', 'Bright indirect', 'Sunny'];
const BUDGETS = ['Under $100', '$100–$250', '$250–$500', '$500+'];
const STYLES = ['Minimal', 'Jungle', 'Scandi', 'Boho', 'Not sure'];

function Eyebrow({ children, light }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-sage-soft' : 'text-botanical'}`}>
      <span aria-hidden="true" className={`h-px w-10 ${light ? 'bg-sage-soft/60' : 'bg-botanical/60'}`} />
      {children}
    </p>
  );
}

function Chips({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`rounded-full px-4 py-2 text-sm ring-1 transition ${value === o ? 'bg-forest font-semibold text-white ring-forest' : 'bg-white text-ink/80 ring-line/70 hover:ring-sage'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const k = Math.min(1, 700 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

export default function PlantStyling() {
  usePageMeta('Plant Styling', 'Free plant styling advice for your home, and tailored plant schemes for offices, hospitality and interior designers.');
  const notify = useToast();
  const [, setRequests] = useLocalStorage('gn_styling_requests', []);
  const [kind, setKind] = useState('home');
  const [room, setRoom] = useState('Living room');
  const [light, setLight] = useState('Medium');
  const [budget, setBudget] = useState('$100–$250');
  const [style, setStyle] = useState('Not sure');
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', company: '', size: '', notes: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/')).slice(0, 4 - photos.length);
    try {
      const urls = await Promise.all(files.map(toDataUrl));
      setPhotos((p) => [...p, ...urls].slice(0, 4));
    } catch {
      setError('We couldn’t read one of those images');
    }
    e.target.value = '';
  };

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please add your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address');
    if (kind === 'business' && form.company.trim().length < 2) return setError('Please add your company name');
    setError('');
    const req = { id: `ST-${Date.now().toString().slice(-6)}`, kind, room, light, budget, style, photos, ...form, date: new Date().toISOString() };
    setRequests((cur) => [req, ...cur]);
    setSent(req);
    notify('Styling request sent — we’ll be in touch soon');
  };

  const input = 'h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40';
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70';

  return (
    <>
      <PageHero
        eyebrow="Plant styling"
        title="Styled by plant people"
        subtitle="Send us a photo of your space and our stylists will recommend the right plants and planters — free for homes, tailored for businesses."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Plant Care', to: '/plant-care' }, { label: 'Plant styling' }]}
        plants={['bird-of-paradise', 'monstera']}
      />

      {/* How it works */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ol className="grid gap-3 rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-4 md:p-4">
          {[
            [Camera, 'Share your space', 'A few photos and the basics'],
            [Lightbulb, 'We read the light', 'And match plants to it'],
            [PencilRuler, 'Get your plan', 'A styled shortlist by email'],
            [Truck, 'Shop & settle in', 'Delivered with care cards'],
          ].map(([Icon, t, b], i) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl p-3">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={19} strokeWidth={1.7} />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-forest font-serif text-[10px] italic text-white">{i + 1}</span>
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Home vs business */}
      <section className="container py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['home', Home, 'For your home', 'Free', ['Personal plant shortlist for your room', 'Planter and placement suggestions', 'Reply within 2 business days']],
            ['business', Building2, 'For business', 'Tailored quote', ['Offices, hospitality & retail spaces', 'Interior designer & trade pricing', 'Delivery, installation & plant care plans']],
          ].map(([k, Icon, t, price, items]) => (
            <button
              key={k}
              id={k === 'business' ? 'business' : undefined}
              onClick={() => {
                setKind(k);
                document.getElementById('styling-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`group relative flex scroll-mt-28 flex-col overflow-hidden rounded-[28px] p-7 text-left ring-1 transition duration-300 hover:-translate-y-1 md:p-8 ${
                kind === k ? 'bg-forest-900 text-white shadow-float ring-forest' : 'bg-white shadow-soft ring-line/70 hover:shadow-lift'
              }`}
            >
              {kind === k && <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-botanical/50 blur-3xl" />}
              <span className="relative flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${kind === k ? 'bg-white/10 text-sage-soft' : 'bg-mist text-forest'}`}>
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${kind === k ? 'bg-white/15 text-sage-soft' : 'bg-mist text-forest'}`}>{price}</span>
              </span>
              <span className={`relative mt-6 font-serif text-[28px] font-semibold ${kind === k ? 'text-white' : 'text-ink'}`}>{t}</span>
              <ul className="relative mt-4 space-y-2">
                {items.map((it) => (
                  <li key={it} className={`flex items-center gap-2 text-sm ${kind === k ? 'text-white/80' : 'text-ink/75'}`}>
                    <Check size={14} className={kind === k ? 'text-sage-soft' : 'text-botanical'} /> {it}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="styling-form" className="container scroll-mt-24 pb-16 md:pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative hidden overflow-hidden rounded-[32px] shadow-lift lg:block">
            <EditorialScene kind="shelf" label="A styled shelf of indoor plants" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
            <div className="absolute inset-x-8 bottom-8 text-white">
              <Eyebrow light>{kind === 'home' ? 'Free styling' : 'Trade & business'}</Eyebrow>
              <p className="mt-3 font-serif text-[30px] leading-tight">
                {kind === 'home' ? (
                  <>
                    The right plant for <em className="italic text-sage-soft">every corner</em>
                  </>
                ) : (
                  <>
                    Greener spaces, <em className="italic text-sage-soft">happier teams</em>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900">
                  <Check size={30} strokeWidth={2.5} />
                </span>
                <p className="mt-5 font-serif text-2xl">
                  Request <em className="italic text-botanical">received</em>
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  {sent.kind === 'home'
                    ? `Thanks, ${sent.name.split(' ')[0]}! A stylist will email your plant plan to ${sent.email} within 2 business days.`
                    : `Thanks, ${sent.name.split(' ')[0]}! Our business team will contact you at ${sent.email} to arrange a call.`}
                </p>
                <p className="mt-3 text-xs text-muted">Reference {sent.id}</p>
                <button onClick={() => { setSent(null); setPhotos([]); setForm({ name: '', email: '', company: '', size: '', notes: '' }); }} className="mt-6 rounded-full border border-line px-6 py-2.5 text-sm font-medium text-forest transition hover:border-forest">
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid grid-cols-2 gap-1 rounded-full bg-card p-1">
                  {[
                    ['home', 'For my home', Home],
                    ['business', 'For my business', Building2],
                  ].map(([k, t, Icon]) => (
                    <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={`inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${kind === k ? 'bg-forest text-white shadow-soft' : 'text-ink/70 hover:text-forest'}`}>
                      <Icon size={15} /> {t}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={label}>Name</span>
                    <input value={form.name} onChange={set('name')} className={input} />
                  </label>
                  <label className="block">
                    <span className={label}>Email</span>
                    <input type="email" value={form.email} onChange={set('email')} className={input} />
                  </label>
                  {kind === 'business' && (
                    <>
                      <label className="block">
                        <span className={label}>Company</span>
                        <input value={form.company} onChange={set('company')} className={input} />
                      </label>
                      <label className="block">
                        <span className={label}>Space size (approx.)</span>
                        <input value={form.size} onChange={set('size')} placeholder="e.g. 200 m² / 25 desks" className={input} />
                      </label>
                    </>
                  )}
                </div>

                {kind === 'home' && <Chips legend="Which room?" options={ROOMS} value={room} onChange={setRoom} />}
                <Chips legend="How much light?" options={LIGHT} value={light} onChange={setLight} />
                <Chips legend="Budget" options={kind === 'home' ? BUDGETS : ['Under $1,000', '$1,000–$5,000', '$5,000+', 'Ongoing plan']} value={budget} onChange={setBudget} />
                {kind === 'home' && <Chips legend="Your style" options={STYLES} value={style} onChange={setStyle} />}

                <div>
                  <p className={label}>Photos of your space (up to 4)</p>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((p, i) => (
                      <span key={i} className="relative">
                        <img src={p} alt={`Your space ${i + 1}`} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-line" />
                        <button type="button" onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-forest text-white shadow" aria-label="Remove photo">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {photos.length < 4 && (
                      <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-sage text-forest transition hover:bg-mist/50">
                        <ImagePlus size={20} />
                        <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
                      </label>
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className={label}>Anything else? (optional)</span>
                  <textarea
                    value={form.notes}
                    onChange={set('notes')}
                    rows={3}
                    placeholder={kind === 'home' ? 'Pets, favourite plants, spots you’d like to fill…' : 'Number of locations, timelines, maintenance needs…'}
                    className="w-full resize-none rounded-2xl bg-card/70 p-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40"
                  />
                </label>

                {error && (
                  <p className="text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}
                <button className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical">
                  <Send size={15} /> {kind === 'home' ? 'Get my free plant plan' : 'Request a business consultation'}
                </button>
                <p className="flex items-center justify-center gap-2 text-xs text-muted">
                  <Palette size={13} className="text-botanical" /> No obligation — just good plant advice.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
