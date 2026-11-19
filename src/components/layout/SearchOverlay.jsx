import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={() => setSearchOpen(false)} />
      <div className="relative max-h-[90vh] animate-fade-up overflow-y-auto border-b border-line bg-white shadow-lift">
        <div className="container py-5 md:py-8">
          <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-forest pb-2" role="search">
            <Search size={22} className="text-forest" aria-hidden="true" />
            <label htmlFor="site-search" className="sr-only">Search plants</label>
            <input ref={inputRef} id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plants, care needs, pots…" className="min-w-0 flex-1 bg-transparent py-2 font-serif text-xl text-ink placeholder:text-muted/60 focus:outline-none md:text-2xl" autoComplete="off" />
            <button type="button" onClick={() => setSearchOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-forest hover:bg-mist/60" aria-label="Close search">
              <X size={20} />
            </button>
          </form>
          {!q && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">Popular:</span>
              {POPULAR.map((p) => (
                <button key={p} onClick={() => setQ(p)} className="rounded-full border border-line px-3 py-1 hover:border-forest">
                  {p}
                </button>
              ))}
            </div>
          )}
          <p className="eyebrow mb-3 mt-6">{q ? `${all.length} plants found` : 'Bestsellers'}</p>
          {results.length ? (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <Link to={`/product/${p.slug}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-mist/50">
                    <span className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-card">
                      <ProductImage product={p} className="h-full w-full" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs italic text-muted">{p.botanical}</span>
                      <span className="text-sm text-forest">{money(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No plants match “{q}”. Try a plant name, “low light” or “pet-friendly”.</p>
          )}
          {guides.length > 0 && (
            <>
              <p className="eyebrow mb-2 mt-6">Care guides</p>
              <ul className="space-y-1">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/plant-care/${g.slug}`} className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-mist/50">
                      <BookOpen size={15} className="text-botanical" /> {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {q && all.length > 0 && (
            <button onClick={submit} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline">
              See all results <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
