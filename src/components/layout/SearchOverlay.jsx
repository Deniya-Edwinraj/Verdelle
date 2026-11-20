import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Search, SearchX, TrendingUp, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { searchProducts, products } from '../../data/products';
import { careGuides } from '../../data/careGuides';
import { ProductImage } from '../art/scenes';
import { money } from '../ui';

const POPULAR = ['Low light', 'Pet-friendly', 'Monstera', 'Easy', 'Succulents'];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setSearchOpen(false), [pathname, setSearchOpen]);
  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setSearchOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;
  const all = q ? searchProducts(q) : [];
  const results = q ? all.slice(0, 6) : products.filter((p) => p.bestSeller).slice(0, 6);
  const guides = q ? careGuides.filter((g) => `${g.title} ${g.topic}`.toLowerCase().includes(q.toLowerCase())).slice(0, 3) : [];

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center px-3 pt-3 sm:px-6 sm:pt-[8vh]" role="dialog" aria-modal="true" aria-label="Search">
      {/* Frosted forest backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-forest-900/45 backdrop-blur-md" onClick={() => setSearchOpen(false)} />

      {/* Floating panel */}
      <div className="thin-scrollbar relative flex max-h-[88vh] w-full max-w-4xl animate-fade-up flex-col overflow-hidden rounded-[28px] bg-warm shadow-[0_40px_80px_-20px_rgba(11,36,24,0.55)] ring-1 ring-white/40">
        {/* Search field */}
        <div className="relative border-b border-line/70 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-48 w-48 rounded-full bg-mist blur-3xl" />
          <form onSubmit={submit} className="relative flex items-center gap-3 sm:gap-4" role="search">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-white shadow-soft sm:h-12 sm:w-12" aria-hidden="true">
              <Search size={20} />
            </span>
            <label htmlFor="site-search" className="sr-only">Search plants</label>
            <input
              ref={inputRef}
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plants, care needs, pots…"
              className="min-w-0 flex-1 bg-transparent py-2 font-serif text-xl tracking-tight text-ink placeholder:italic placeholder:text-muted/50 focus:outline-none sm:text-[26px]"
              autoComplete="off"
            />
            {q && (
              <button type="button" onClick={() => { setQ(''); inputRef.current?.focus(); }} className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-card hover:text-forest sm:block">
                Clear
              </button>
            )}
            <kbd className="hidden rounded-md border border-line bg-card px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted md:block">Esc</kbd>
            <button type="button" onClick={() => setSearchOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card text-forest transition hover:rotate-90 hover:bg-forest hover:text-white" aria-label="Close search">
              <X size={18} />
            </button>
          </form>
        </div>

        {/* Body */}
        <div className="thin-scrollbar overflow-y-auto px-4 py-6 sm:px-6 sm:py-7">
          {!q && (
            <div className="mb-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                <TrendingUp size={14} className="text-botanical" /> Popular searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQ(p)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm text-ink/80 shadow-soft ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:bg-forest hover:text-white hover:ring-forest"
                  >
                    {p}
                    <ArrowUpRight size={13} className="text-sage transition group-hover:text-sage-soft" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-end justify-between gap-3">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
              <span aria-hidden="true" className="h-px w-8 bg-botanical/60" />
              {q ? 'Plants' : 'Bestsellers'}
            </p>
            {q && (
              <p className="text-xs text-muted" aria-live="polite">
                <span className="font-semibold text-ink">{all.length}</span> {all.length === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>

          {results.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="group flex items-center gap-3.5 rounded-2xl bg-white p-2.5 pr-4 shadow-soft ring-1 ring-line/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-sage-soft"
                  >
                    <span className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-card">
                      <ProductImage product={p} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[15px] font-semibold text-ink transition-colors group-hover:text-forest">{p.name}</span>
                      <span className="block truncate text-xs italic text-muted">{p.botanical}</span>
                      <span className="mt-1 block text-sm font-semibold text-forest">{money(p.price)}</span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-forest opacity-0 transition duration-300 group-hover:rotate-45 group-hover:opacity-100">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-[24px] bg-white px-6 py-10 text-center ring-1 ring-line/70">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-mist text-forest">
                <SearchX size={24} strokeWidth={1.6} />
              </span>
              <p className="mt-4 font-serif text-xl text-ink">
                No plants match <em className="italic text-botanical">“{q}”</em>
              </p>
              <p className="mt-1.5 text-sm text-muted">Try a plant name, “low light” or “pet-friendly”.</p>
            </div>
          )}

          {guides.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-8 bg-botanical/60" />
                Care guides
              </p>
              <ul className="grid gap-2 sm:grid-cols-3">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to={`/plant-care/${g.slug}`}
                      className="group flex h-full items-center gap-3 rounded-2xl bg-white p-3 text-sm ring-1 ring-line/60 transition hover:bg-forest hover:text-white hover:ring-forest"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist text-forest transition group-hover:bg-white/15 group-hover:text-sage-soft">
                        <BookOpen size={16} />
                      </span>
                      <span className="line-clamp-2 font-medium leading-snug">{g.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        {q && all.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-line/70 bg-white px-4 py-3.5 sm:px-6">
            <p className="hidden text-xs text-muted sm:block">
              Press <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-sans text-[10px] font-semibold">Enter</kbd> to see everything
            </p>
            <button
              onClick={submit}
              className="group ml-auto inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-botanical"
            >
              See all {all.length} results <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
