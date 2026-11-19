import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Droplets, Search, SearchX, Sun, Sprout, AlertTriangle } from 'lucide-react';
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

      <section className="container -mt-8 relative z-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {QUICK.map(({ icon: Icon, title, topic: t, body }) => (
            <li key={title}>
              <button onClick={() => setTopic(t)} aria-pressed={topic === t} className={`flex h-full w-full flex-col items-start rounded-card bg-white p-4 text-left shadow-float ring-1 transition hover:ring-forest ${topic === t ? 'ring-2 ring-forest' : 'ring-line'}`}>
                <Icon size={20} className="text-botanical" />
                <span className="mt-2 font-serif text-[17px] font-semibold text-forest">{title}</span>
                <span className="mt-0.5 text-xs text-muted">{body}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Guide topics">
            {CARE_TOPICS.map((t) => (
              <li key={t}>
                <button onClick={() => setTopic(t)} aria-pressed={topic === t} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${topic === t ? 'bg-forest text-white' : 'bg-card hover:bg-mist'}`}>
                  {t}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Level</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="field h-10 w-auto py-0 pr-8">
                <option>All</option>
                <option>Beginner</option>
                <option>Intermediate</option>
              </select>
            </label>
            <label className="relative block sm:w-64">
              <span className="sr-only">Search care guides</span>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides" className="field h-10 pl-9" />
            </label>
          </div>
        </div>
        {list.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="container pb-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-forest p-8 text-white md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">New to plants?</h2>
            <p className="mt-2 max-w-md text-sm text-white/80">Start with forgiving, easy-care varieties that bounce back from the occasional mistake.</p>
          </div>
          <Link to="/shop/easy-care" className="btn-light px-6">Shop easy-care plants</Link>
        </div>
      </section>
    </>
  );
}
