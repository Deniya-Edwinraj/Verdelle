import { useEffect, useMemo, useState } from 'react';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import ProductFilters, { EMPTY_FILTERS, applyFilters, activeCount, MAX_PRICE } from './ProductFilters';
import ProductGrid from './ProductGrid';
import { EmptyState, money } from '../ui';
import { sortProducts, SORTS, PLANT_TYPES } from '../../data/products';

const PAGE = 8;

/** Filterable, sortable product listing with a mobile filter drawer and Load More. */
export default function Catalog({ products, initialSort = 'popular', resetKey, onSortChange }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState(initialSort);
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setFilters(EMPTY_FILTERS);
    setShown(PAGE);
  }, [resetKey]);
  useEffect(() => setSort(initialSort), [initialSort]);
  useEffect(() => setShown(PAGE), [filters, sort]);
  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [drawer]);

  const counts = useMemo(() => Object.fromEntries(PLANT_TYPES.map((t) => [t, products.filter((p) => p.plantType === t).length])), [products]);
  const result = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort]);
  const active = activeCount(filters);

  const chips = [
    ...['types', 'sizes', 'light', 'watering', 'difficulty'].flatMap((k) => filters[k].map((v) => ({ k, v, label: v }))),
    ...(filters.petSafe ? [{ k: 'petSafe', label: 'Pet-friendly' }] : []),
    ...(filters.inStock ? [{ k: 'inStock', label: 'In stock' }] : []),
    ...(filters.maxPrice < MAX_PRICE ? [{ k: 'maxPrice', label: `Under ${money(filters.maxPrice)}` }] : []),
  ];
  const removeChip = (c) =>
    setFilters((f) => (Array.isArray(f[c.k]) ? { ...f, [c.k]: f[c.k].filter((x) => x !== c.v) } : { ...f, [c.k]: c.k === 'maxPrice' ? MAX_PRICE : false }));

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="thin-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">Filters</h2>
            {active > 0 && (
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-forest underline">
                Clear all
              </button>
            )}
          </div>
          <ProductFilters filters={filters} setFilters={setFilters} counts={counts} />
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            Showing <span className="font-medium text-ink">{Math.min(shown, result.length)}</span> of {result.length} products
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="btn-outline h-10 px-4 lg:hidden">
              <SlidersHorizontal size={15} /> Filters {active > 0 && `(${active})`}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  onSortChange?.(e.target.value);
                }}
                className="field h-10 w-auto py-0 pr-8"
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c.k + (c.v || '')}>
                <button onClick={() => removeChip(c)} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-xs text-forest hover:bg-sage-soft" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {result.length ? (
          <>
            <ProductGrid products={result.slice(0, shown)} cols="grid-cols-2 xl:grid-cols-4 lg:grid-cols-3" />
            {shown < result.length && (
              <div className="mt-10 text-center">
                <button onClick={() => setShown((s) => s + PAGE)} className="btn-outline px-8">
                  Load more ({result.length - shown} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No plants match those filters"
            body="Try removing a filter or widening your price range."
            action={
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="btn-primary">
                Clear filters
              </button>
            }
          />
        )}
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm animate-slide-in-right flex-col bg-warm">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-xl">Filters</h2>
              <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist/60" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="thin-scrollbar flex-1 overflow-y-auto px-5 py-5">
              <ProductFilters filters={filters} setFilters={setFilters} counts={counts} />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="btn-outline">
                Clear
              </button>
              <button onClick={() => setDrawer(false)} className="btn-primary">
                Show {result.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
