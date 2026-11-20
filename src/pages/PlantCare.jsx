import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ChevronDown, Droplets, Search, SearchX, SlidersHorizontal, Sprout, Sun } from 'lucide-react';
import { careGuides, CARE_TOPICS } from '../data/careGuides';
import CareCard from '../components/care/CareCard';
import { EmptyState, PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

const QUICK = [
  { icon: Droplets, title: 'Watering', topic: 'Watering', body: 'Check the soil, not the calendar.' },
  { icon: Sun, title: 'Lighting', topic: 'Lighting', body: 'Bright indirect vs. direct, explained.' },
  { icon: AlertTriangle, title: 'Common Problems', topic: 'Problems', body: 'Yellow leaves, root rot and pests.' },
  { icon: Sprout, title: 'Growing', topic: 'Growing', body: 'Repotting, pruning and propagation.' },
];

export default function PlantCare() {
  usePageMeta('Plant Care', 'Free Verdelle plant-care guides: watering, light, repotting, yellow leaves, root rot, pruning, fertiliser, propagation and pests.');
  const [params, setParams] = useSearchParams();
  const topic = CARE_TOPICS.includes(params.get('topic')) ? params.get('topic') : 'All';
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const list = useMemo(
    () =>
      careGuides.filter(
        (g) => (topic === 'All' || g.topic === topic) && (level === 'All' || g.difficulty === level) && (!q || `${g.title} ${g.summary} ${g.topic}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [topic, level, q],
  );
  const setTopic = (t) => {
    const next = new URLSearchParams(params);
    if (t === 'All') next.delete('topic');
    else next.set('topic', t);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHero eyebrow="Plant Care hub" title="Grow with confidence" subtitle="Practical, plain-English guides to keep your plants thriving. Every home is different — use these as a starting point." crumbs={[{ label: 'Home', to: '/' }, { label: 'Plant Care' }]} plants={['calathea', 'pothos']} />

      {/* Quick topic cards, floating over the hero curve */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {QUICK.map(({ icon: Icon, title, topic: t, body }, i) => {
            const active = topic === t;
            const count = careGuides.filter((g) => g.topic === t).length;
            return (
              <li key={title}>
                <button
                  onClick={() => setTopic(active ? 'All' : t)}
                  aria-pressed={active}
                  className={`group relative flex h-full w-full flex-col items-start overflow-hidden rounded-[24px] p-5 text-left ring-1 transition duration-500 ease-out hover:-translate-y-1.5 md:p-6 ${
                    active ? 'bg-forest-900 text-white shadow-float ring-forest' : 'bg-white/90 shadow-lift ring-white/60 backdrop-blur-xl hover:shadow-float'
                  }`}
                >
                  {/* Glow */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-opacity duration-500 ${
                      active ? 'bg-botanical/60 opacity-100' : 'bg-mist opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  <span className="relative flex w-full items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:-rotate-6 ${
                        active ? 'bg-white/10 text-sage-soft ring-1 ring-white/15' : 'bg-mist text-forest group-hover:bg-forest group-hover:text-white'
                      }`}
                    >
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                    <span className={`font-serif text-2xl italic leading-none ${active ? 'text-white/25' : 'text-sage-soft'}`}>0{i + 1}</span>
                  </span>
                  <span className={`relative mt-6 font-serif text-lg font-semibold md:text-xl ${active ? 'text-white' : 'text-forest'}`}>{title}</span>
                  <span className={`relative mt-1 text-xs leading-relaxed md:text-[13px] ${active ? 'text-white/70' : 'text-muted'}`}>{body}</span>
                  <span className={`relative mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? 'text-sage-soft' : 'text-botanical'}`}>
                    {count} {count === 1 ? 'guide' : 'guides'}
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mb-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                Care library
              </p>
              <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
                {topic === 'All' ? (
                  <>
                    All <em className="font-normal italic text-botanical">guides</em>
                  </>
                ) : (
                  <>
                    <em className="font-normal italic text-botanical">{topic}</em> guides
                  </>
                )}
              </h2>
            </div>
            <p className="text-sm text-muted" aria-live="polite">
              Showing <span className="font-semibold text-ink">{list.length}</span> of {careGuides.length} guides
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 rounded-[24px] bg-white p-2 shadow-soft ring-1 ring-line/70 lg:flex-row lg:items-center lg:justify-between lg:rounded-full">
            <ul className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Guide topics">
              {CARE_TOPICS.map((t) => (
                <li key={t}>
                  <button
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${topic === t ? 'bg-forest text-white shadow-soft' : 'text-ink/75 hover:bg-mist/70 hover:text-forest'}`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex items-center">
                <span className="sr-only">Level</span>
                <SlidersHorizontal size={15} className="pointer-events-none absolute left-4 text-muted" />
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="h-11 w-full appearance-none rounded-full border-0 bg-card pl-10 pr-9 text-sm text-ink outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-forest sm:w-auto"
                >
                  <option value="All">All levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3.5 text-muted" />
              </label>
              <label className="relative block sm:w-64">
                <span className="sr-only">Search care guides</span>
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search guides"
                  className="h-11 w-full rounded-full border-0 bg-card pl-10 pr-4 text-sm outline-none ring-1 ring-transparent transition placeholder:text-muted focus:bg-white focus:ring-forest"
                />
              </label>
            </div>
          </div>
        </div>
        {list.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {list.map((g) => (
              <li key={g.slug}>
                <CareCard guide={g} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={SearchX} title="No guides found" body="Try a different topic or search term." action={<button className="btn-primary" onClick={() => { setQ(''); setLevel('All'); setTopic('All'); }}>Show all guides</button>} />
        )}
      </section>

      <section className="container pb-16 md:pb-24">
        <div className="relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[32px] bg-forest-900 p-8 text-white shadow-float md:flex-row md:items-center md:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 -z-10 h-96 w-96 rounded-full bg-botanical/50 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="flex items-start gap-5">
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10 text-sage-soft ring-1 ring-white/15 sm:grid">
              <Sprout size={24} strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-[30px] font-medium leading-tight tracking-tight text-white md:text-[40px]">
                New to <em className="font-normal italic text-sage-soft">plants?</em>
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">Start with forgiving, easy-care varieties that bounce back from the occasional mistake.</p>
            </div>
          </div>
          <Link
            to="/shop/easy-care"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest shadow-soft transition hover:-translate-y-0.5 hover:bg-mist"
          >
            Shop easy-care plants
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
