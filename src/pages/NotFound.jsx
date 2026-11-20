import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Compass, Home, Search, ShoppingBag } from 'lucide-react';
import { FramedPlant } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';

const DESTINATIONS = [
  [Home, 'Home', 'Back to the beginning', '/'],
  [ShoppingBag, 'Shop plants', 'Browse the full collection', '/shop'],
  [Compass, 'Plant Finder', 'Find your perfect match', '/plant-finder'],
  [BookOpen, 'Plant care', 'Guides for happy plants', '/plant-care'],
];

export default function NotFound() {
  usePageMeta('Page not found');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-white">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-botanical/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[460px] w-[460px] rounded-full bg-sage/20 blur-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
      />

      <div className="container flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-16 text-center md:py-24">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-soft motion-safe:animate-fade-in">
          <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
          Error 404
          <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
        </p>

        {/* 4 [plant] 4 */}
        <div className="mt-6 flex items-center justify-center gap-3 motion-safe:animate-fade-up sm:gap-6" aria-hidden="true">
          <span className="font-serif text-[120px] font-medium leading-none tracking-tight text-white sm:text-[180px] md:text-[220px]">4</span>
          <span className="relative">
            <span className="absolute -inset-3 rounded-full border border-sage-soft/30 motion-safe:animate-[spin_24s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
            <span className="relative block h-[110px] w-[110px] overflow-hidden rounded-full shadow-float ring-4 ring-white/15 sm:h-[160px] sm:w-[160px] md:h-[190px] md:w-[190px]">
              <FramedPlant species="snake" pot="terracotta" seed="404" className="h-full w-full" />
            </span>
          </span>
          <span className="font-serif text-[120px] font-medium leading-none tracking-tight text-white sm:text-[180px] md:text-[220px]">4</span>
        </div>

        <h1 className="mt-8 max-w-2xl text-[34px] font-medium leading-[1.1] tracking-tight text-white motion-safe:animate-fade-up md:text-[48px]" style={{ animationDelay: '100ms' }}>
          This page needs a little more <em className="font-normal italic text-sage-soft">light</em>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 motion-safe:animate-fade-up" style={{ animationDelay: '160ms' }}>
          We couldn’t find <span className="break-all rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white/85">{pathname}</span>. It may have been moved — or it never sprouted.
        </p>

        {/* Search */}
        <form onSubmit={submit} role="search" className="mt-8 w-full max-w-lg motion-safe:animate-fade-up" style={{ animationDelay: '220ms' }}>
          <label htmlFor="nf-search" className="sr-only">
            Search plants
          </label>
          <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-float ring-1 ring-white/30 transition focus-within:ring-2 focus-within:ring-sage">
            <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              id="nf-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a plant…"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
            />
            <button className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-botanical">
              Search <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        {/* Destinations */}
        <ul className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          {DESTINATIONS.map(([Icon, t, b, to], i) => (
            <li key={to} className="motion-safe:animate-fade-up" style={{ animationDelay: `${280 + i * 60}ms` }}>
              <Link
                to={to}
                className="group flex h-full flex-col items-start rounded-[22px] bg-white/[0.06] p-5 text-left ring-1 ring-white/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:ring-sage-soft/40"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sage-soft transition group-hover:bg-sage-soft group-hover:text-forest-900">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <span className="mt-4 flex w-full items-center justify-between gap-2 font-serif text-lg font-semibold text-white">
                  {t}
                  <ArrowRight size={15} className="text-sage-soft transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-0.5 text-xs text-white/60">{b}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={() => navigate(-1)} className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Go back to the previous page
        </button>
      </div>
    </section>
  );
}
