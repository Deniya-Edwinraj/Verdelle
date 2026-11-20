import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Check, Clock, GraduationCap, Inbox, Mail, Sprout } from 'lucide-react';
import { COURSE_DAYS } from '../data/services';
import { PageHero } from '../components/ui';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePageMeta } from '../hooks/usePageMeta';

export default function CareCourse() {
  usePageMeta('Free Plant Care Course', 'A free 5-day email course for new plant parents — light, watering, problems and growing your jungle.');
  const [enrolled, setEnrolled] = useLocalStorage('gn_course', []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError('Please enter a valid email address');
    setError('');
    if (!enrolled.includes(v)) setEnrolled([...enrolled, v]);
    setDone({ name: name.trim(), email: v });
  };

  const form = (
    <div className="rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-line/70 md:p-8">
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage text-forest-900">
            <Inbox size={28} />
          </span>
          <p className="mt-5 font-serif text-2xl text-ink">
            You’re <em className="italic text-botanical">enrolled{done.name ? `, ${done.name.split(' ')[0]}` : ''}!</em>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Day 1 lands in <strong className="text-ink">{done.email}</strong> shortly. Keep an eye on your inbox each morning this week.
          </p>
          <Link to="/plant-care" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            Browse care guides meanwhile <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="font-serif text-2xl text-ink">
            Start the <em className="italic text-botanical">free course</em>
          </p>
          <p className="mt-1 text-sm text-muted">One short, practical email each morning for 5 days.</p>
          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="sr-only">First name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name (optional)" className="h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40" />
            </label>
            <label className={`flex h-12 items-center gap-3 rounded-2xl bg-card/70 px-4 ring-1 transition focus-within:bg-white focus-within:ring-2 ${error ? 'ring-red-700/50' : 'ring-line/70 focus-within:ring-botanical/40'}`}>
              <Mail size={16} className="text-muted" aria-hidden="true" />
              <span className="sr-only">Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-800" role="alert">
              {error}
            </p>
          )}
          <button className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical">
            <GraduationCap size={16} /> Enrol for free
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">Unsubscribe any time. We never share your email.</p>
        </form>
      )}
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow="Free email course"
        title="Plant Parenting 101"
        subtitle="Five days, five short lessons — everything you need to keep your first plants happy and thriving."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Plant Care', to: '/plant-care' }, { label: 'Free course' }]}
        plants={['pothos', 'spider']}
      />

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8 lg:pt-28">
            <ul className="grid grid-cols-3 gap-3">
              {[
                [Clock, '5 minutes a day'],
                [BookOpen, '5 practical lessons'],
                [Award, 'Graduation gift'],
              ].map(([Icon, t]) => (
                <li key={t} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center text-xs font-medium text-ink/80 shadow-soft ring-1 ring-line/60">
                  <Icon size={18} className="text-botanical" /> {t}
                </li>
              ))}
            </ul>

            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                What you’ll learn
              </p>
              <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                Your week of <em className="font-normal italic text-botanical">green confidence</em>
              </h2>
              <ol className="relative mt-8 space-y-4">
                <span aria-hidden="true" className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-sage via-sage-soft to-transparent" />
                {COURSE_DAYS.map(([t, b], i) => (
                  <li key={t} className="relative flex gap-5">
                    <span className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full font-serif text-base italic ring-4 ring-warm ${i === 4 ? 'bg-forest text-white' : 'bg-white text-forest shadow-soft'}`}>
                      {i === 4 ? <GraduationCap size={20} /> : `Day ${i + 1}`}
                    </span>
                    <div className="flex-1 rounded-[22px] bg-white p-5 shadow-soft ring-1 ring-line/70">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Day {i + 1}</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-ink">{t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-4 rounded-[24px] bg-mist/60 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-forest">
                <Sprout size={20} />
              </span>
              <div>
                <p className="font-semibold text-ink">Graduation gift</p>
                <p className="mt-1 text-sm text-muted">Finish the course and we’ll send you 10% off your next plant — plus a printable care cheat sheet.</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-forest">
                  {['Beginner friendly', 'No jargon', 'Works for any plant'].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Check size={12} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">{form}</div>
        </div>
      </section>
    </>
  );
}
