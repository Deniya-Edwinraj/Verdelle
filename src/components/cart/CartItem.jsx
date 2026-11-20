import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { ProductImage } from '../art/scenes';
import { money } from '../ui';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { update, remove } = useCart();
  const { product } = item;
  const href = `/product/${product.slug}`;
  const onSale = item.regularPrice > item.unitPrice;
  const options = [item.size && ['Size', item.size], item.pot && ['Pot', item.pot]].filter(Boolean);

  return (
    <li className="group relative flex gap-4 rounded-[24px] bg-white p-3 shadow-soft ring-1 ring-line/70 transition duration-300 hover:shadow-lift hover:ring-sage-soft sm:gap-5 sm:p-4">
      <Link to={href} className="relative shrink-0 overflow-hidden rounded-[18px] bg-card">
        <ProductImage product={product} className="h-28 w-24 transition-transform duration-700 ease-out group-hover:scale-105 sm:h-32 sm:w-28" />
        {onSale && <span className="absolute left-2 top-2 rounded-full bg-clay px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">Sale</span>}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.plantType && <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-sage">{product.plantType}</p>}
            <Link to={href} className="mt-1 block font-serif text-lg font-semibold leading-snug text-ink transition-colors hover:text-botanical sm:text-xl">
              {product.name}
            </Link>
            {product.botanical && <p className="truncate text-xs italic text-muted">{product.botanical}</p>}
          </div>
          <button
            onClick={() => remove(item.key)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-card text-muted transition hover:rotate-90 hover:bg-[#F6E7DF] hover:text-[#8A3B1E]"
            aria-label={`Remove ${product.name}`}
          >
            <X size={15} />
          </button>
        </div>

        {options.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {options.map(([k, v]) => (
              <li key={k} className="rounded-full bg-mist/60 px-2.5 py-1 text-[11px] text-forest">
                <span className="text-forest/60">{k}:</span> {v}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="inline-flex h-10 items-center rounded-full bg-card p-1 ring-1 ring-line/70" role="group" aria-label={`Quantity for ${product.name}`}>
            <button
              type="button"
              onClick={() => update(item.key, Math.max(1, item.qty - 1))}
              disabled={item.qty <= 1}
              className="grid h-8 w-8 place-items-center rounded-full text-forest transition hover:bg-white hover:shadow-soft disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:shadow-none"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => update(item.key, Math.min(10, item.qty + 1))}
              disabled={item.qty >= 10}
              className="grid h-8 w-8 place-items-center rounded-full text-forest transition hover:bg-white hover:shadow-soft disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:shadow-none"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right leading-tight">
            <p className="text-[11px] text-muted">
              {money(item.unitPrice)} each
              {onSale && <span className="ml-1.5 line-through">{money(item.regularPrice)}</span>}
            </p>
            <p className="mt-0.5 font-serif text-xl font-semibold text-forest">{money(item.lineTotal)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
