import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Scale, X } from 'lucide-react';
import { COMPARE_MAX, useUI } from '../../context/UIContext';
import { getProductById } from '../../data/products';
import { ProductImage } from '../art/scenes';

/** Floating tray showing the plants picked for comparison. */
export default function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useUI();
  const { pathname } = useLocation();
  const items = compare.map(getProductById).filter(Boolean);
  if (!items.length || pathname === '/compare' || pathname === '/checkout') return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3 sm:bottom-6">
      <div className="pointer-events-auto flex w-full max-w-xl animate-fade-up items-center gap-3 rounded-full bg-forest-900/95 p-2 pl-4 text-white shadow-float ring-1 ring-white/10 backdrop-blur-xl">
        <Scale size={17} className="hidden shrink-0 text-sage-soft sm:block" aria-hidden="true" />
        <ul className="flex flex-1 items-center gap-2" aria-label="Plants to compare">
          {Array.from({ length: COMPARE_MAX }, (_, i) => items[i]).map((p, i) =>
            p ? (
              <li key={p.id} className="group relative">
                <span className="block h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/30">
                  <ProductImage product={p} className="h-full w-full" />
                </span>
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-forest shadow"
                  aria-label={`Remove ${p.name} from compare`}
                >
                  <X size={11} strokeWidth={3} />
                </button>
              </li>
            ) : (
              <li key={`empty-${i}`} aria-hidden="true" className="hidden h-10 w-10 rounded-full border border-dashed border-white/25 sm:block" />
            ),
          )}
        </ul>
        <button onClick={clearCompare} className="hidden rounded-full px-3 py-2 text-xs text-white/70 transition hover:text-white sm:block">
          Clear
        </button>
        <Link
          to="/compare"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:bg-mist"
        >
          Compare ({items.length}) <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
