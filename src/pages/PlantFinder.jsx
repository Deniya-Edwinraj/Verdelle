import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Armchair, CalendarClock, Check, CloudSun, Compass, Dog, Droplets, Lamp, Moon, PawPrint, RotateCcw, Sofa, Sparkles, Sun, SunMedium, TreePalm, Heart,
} from 'lucide-react';
import { products, PET } from '../data/products';
import { PageHero } from '../components/ui';
import ProductCard from '../components/products/ProductCard';
import { usePageMeta } from '../hooks/usePageMeta';

const QUESTIONS = [
  {
    key: 'light',
    title: 'How much light does the spot get?',
    hint: 'Think about where the plant will live most of the day.',
    options: [
      { value: 'Low', label: 'Low light', sub: 'North-facing or far from windows', icon: Moon },
      { value: 'Medium', label: 'Medium light', sub: 'A few metres from a bright window', icon: CloudSun },
      { value: 'Bright indirect', label: 'Bright, indirect', sub: 'Bright room, no sun on the leaves', icon: SunMedium },
      { value: 'Direct', label: 'Direct sun', sub: 'Sunny windowsill for part of the day', icon: Sun },
    ],
  },
  {
    key: 'pets',
    title: 'Do you share your home with pets?',
    hint: 'We’ll only suggest plants listed as non-toxic to cats and dogs.',
    options: [
      { value: 'yes', label: 'Yes — cats or dogs', sub: 'Show pet-friendly plants only', icon: Dog },
      { value: 'no', label: 'No pets', sub: 'Show me everything', icon: Heart },
    ],
  },
  {
    key: 'care',
    title: 'How hands-on do you want to be?',
    hint: 'Be honest — there’s a perfect plant for every routine.',
    options: [
      { value: 'forgetful', label: 'I often forget to water', sub: 'Tough, drought-tolerant plants', icon: CalendarClock },
      { value: 'weekly', label: 'A weekly check-in', sub: 'Easy to moderate care', icon: Droplets },
      { value: 'enthusiast', label: 'I love plant care', sub: 'Show me the divas too', icon: Sparkles },
    ],
  },
  {
    key: 'size',
    title: 'What size are you looking for?',
    hint: 'Sizes are approximate and include the nursery pot.',
    options: [
      { value: 'Small', label: 'Small', sub: 'Desks, shelves and sills', icon: Lamp },
      { value: 'Medium', label: 'Medium', sub: 'Side tables and plant stands', icon: Armchair },
      { value: 'Large', label: 'Large', sub: 'A statement floor plant', icon: TreePalm },
      { value: 'any', label: 'Surprise me', sub: 'Any size is fine', icon: Sofa },
    ],
  },
];

const LIGHT_ORDER = ['Low', 'Medium', 'Bright indirect', 'Direct'];

function score(p, a) {
  let s = 0;
  const reasons = [];
  // Light
  if (p.light.includes(a.light)) {
    s += 40;
    reasons.push(`Loves ${a.light.toLowerCase()} light`);
  } else {
    const d = Math.min(...p.light.map((l) => Math.abs(LIGHT_ORDER.indexOf(l) - LIGHT_ORDER.indexOf(a.light))));
    if (d === 1) s += 18;
  }
  // Pets (hard filter handled before scoring)
  if (a.pets === 'yes') reasons.push('Pet-friendly');
  // Care
  const relaxed = p.watering === 'Every 2–3 weeks' || p.watering === 'Every 3–4 weeks';
  if (a.care === 'forgetful') {
    if (p.difficulty === 'Easy') s += 18;
    if (relaxed) {
      s += 15;
      reasons.push(`Water ${p.watering.toLowerCase()}`);
    }
    if (p.difficulty === 'Easy' && !relaxed) reasons.push('Very forgiving');
  } else if (a.care === 'weekly') {
    if (p.difficulty !== 'Advanced') {
      s += 30;
      reasons.push(`${p.difficulty} care`);
    }
  } else {
    s += p.difficulty === 'Advanced' ? 30 : p.difficulty === 'Moderate' ? 25 : 18;
    if (p.difficulty !== 'Easy') reasons.push('A rewarding challenge');
  }
  // Size
  if (a.size === 'any' || p.sizes.some((x) => x.label === a.size)) {
    s += 25;
    if (a.size !== 'any') reasons.push(`Available in ${a.size.toLowerCase()}`);
  }
  if (p.stock === 'out-of-stock') s -= 20;
  return { p, score: Math.max(0, Math.min(98, s + Math.round(p.rating))), reasons: reasons.slice(0, 3) };
}

export default function PlantFinder() {
  usePageMeta('Plant Finder', 'Answer four quick questions and find the perfect plant for your light, pets and routine.');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;
  const q = QUESTIONS[step];

  const results = useMemo(() => {
    if (!done) return [];
    return products
      .filter((p) => p.type === 'plant')
      .filter((p) => answers.pets !== 'yes' || p.pet === 'safe')
      .filter((p) => !(answers.care === 'forgetful' && p.difficulty === 'Advanced'))
      .map((p) => score(p, answers))
      .sort((x, y) => y.score - x.score || y.p.popularity - x.p.popularity)
      .slice(0, 6);
  }, [done, answers]);

  const choose = (value) => {
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setTimeout(() => setStep((s) => s + 1), 180);
  };
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const summary = done
    ? [
        [Sun, `${answers.light} light`],
        [PawPrint, answers.pets === 'yes' ? 'Pet-friendly' : 'No pets'],
        [Droplets, QUESTIONS[2].options.find((o) => o.value === answers.care)?.label],
        [Sofa, answers.size === 'any' ? 'Any size' : `${answers.size} size`],
      ]
    : [];

  return (
    <>
      <PageHero
        eyebrow="Plant Finder"
        title="Find your perfect plant"
        subtitle="Four quick questions about your space and routine — we’ll match you with plants that will genuinely thrive."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Plant Finder' }]}
        plants={['monstera', 'peace-lily']}
      />

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
        {!done ? (
          <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-line/70 sm:p-10">
            {/* Progress */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {QUESTIONS.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < step ? 'w-6 bg-botanical' : i === step ? 'w-10 bg-forest' : 'w-6 bg-card'}`} />
                ))}
              </div>
            </div>

            <h2 key={q.key} className="mt-6 text-[28px] font-medium leading-tight tracking-tight motion-safe:animate-fade-up md:text-[36px]">
              {q.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{q.hint}</p>

            <ul className={`mt-8 grid gap-3 ${q.options.length === 2 ? 'sm:grid-cols-2' : q.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {q.options.map(({ value, label, sub, icon: Icon }, i) => {
                const selected = answers[q.key] === value;
                return (
                  <li key={value} className="motion-safe:animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <button
                      onClick={() => choose(value)}
                      aria-pressed={selected}
                      className={`group flex h-full w-full items-center gap-4 rounded-[22px] p-5 text-left ring-1 transition duration-300 hover:-translate-y-0.5 ${
                        selected ? 'bg-forest text-white shadow-float ring-forest' : 'bg-card/60 ring-line/70 hover:bg-white hover:shadow-lift hover:ring-sage-soft'
                      }`}
                    >
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition ${
                          selected ? 'bg-white/15 text-sage-soft' : 'bg-white text-forest group-hover:bg-forest group-hover:text-white'
                        }`}
                      >
                        <Icon size={22} strokeWidth={1.6} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block font-serif text-lg font-semibold ${selected ? 'text-white' : 'text-ink'}`}>{label}</span>
                        <span className={`block text-xs ${selected ? 'text-white/70' : 'text-muted'}`}>{sub}</span>
                      </span>
                      {selected && <Check size={18} className="shrink-0 text-sage-soft" />}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-forest transition hover:bg-card disabled:opacity-0"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <span className="flex items-center gap-2 text-xs text-muted">
                <Compass size={14} className="text-botanical" /> Takes about 30 seconds
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="flex flex-col gap-4 rounded-[28px] bg-white/90 p-5 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Your answers</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {summary.map(([Icon, label]) => (
                    <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-mist/70 px-3 py-1.5 text-xs font-medium text-forest">
                      <Icon size={13} /> {label}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={restart}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-forest transition hover:border-forest hover:bg-forest hover:text-white"
              >
                <RotateCcw size={15} /> Start again
              </button>
            </div>

            <div className="mb-8 mt-14">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                Your matches
              </p>
              <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
                Plants made for <em className="font-normal italic text-botanical">your space</em>
              </h2>
            </div>

            {results.length ? (
              <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {results.map(({ p, score: s, reasons }, i) => (
                  <li key={p.id} className="flex flex-col">
                    <div className="mb-2 flex items-center justify-between gap-2 px-1">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${i === 0 ? 'bg-forest text-white' : 'bg-mist text-forest'}`}>
                        {i === 0 ? '★ Best match · ' : ''}
                        {s}% match
                      </span>
                    </div>
                    <ProductCard product={p} className="flex-1" />
                    {reasons.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5 px-1">
                        {reasons.map((r) => (
                          <li key={r} className="inline-flex items-center gap-1 text-[11px] text-muted">
                            <Check size={12} className="text-botanical" /> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-[24px] bg-white p-8 text-center text-sm text-muted ring-1 ring-line/70">No exact matches — try a different light level or size.</p>
            )}

            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[28px] bg-forest-900 p-7 text-white sm:flex-row sm:items-center md:p-9">
              <div>
                <p className="font-serif text-2xl text-white">
                  Want to see them <em className="italic text-sage-soft">side by side?</em>
                </p>
                <p className="mt-1 text-sm text-white/70">Tap the scales icon on any card to compare up to three plants.</p>
              </div>
              <Link to="/shop" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-mist">
                Browse all plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-muted">
              Pet-friendly plants are {PET.safe.detail.charAt(0).toLowerCase() + PET.safe.detail.slice(1)} Recommendations are general guidance.
            </p>
          </>
        )}
      </section>
    </>
  );
}
