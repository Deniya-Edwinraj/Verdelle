import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { ProductImage } from '../art/scenes';
import { QuantitySelector, money } from '../ui';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { update, remove } = useCart();
  const { product } = item;
  return (
    <li className="flex gap-4 py-5">
      <Link to={`/product/${product.slug}`} className="shrink-0 overflow-hidden rounded-lg bg-card">
        <ProductImage product={product} className="h-24 w-24 sm:h-28 sm:w-28" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link to={`/product/${product.slug}`} className="font-serif text-lg font-semibold text-forest hover:text-botanical">{product.name}</Link>
          <p className="mt-0.5 text-xs text-muted">{[`Size: ${item.size}`, item.pot && `Pot: ${item.pot}`].filter(Boolean).join(' · ')}</p>
          <p className="mt-1 flex items-baseline gap-2 text-sm">
            {money(item.unitPrice)}
            {item.regularPrice > item.unitPrice && <span className="text-xs text-muted line-through">{money(item.regularPrice)}</span>}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <QuantitySelector size="sm" value={item.qty} onChange={(q) => update(item.key, q)} label={`Quantity for ${product.name}`} />
          <p className="w-20 text-right font-semibold">{money(item.lineTotal)}</p>
          <button onClick={() => remove(item.key)} className="grid h-9 w-9 place-items-center rounded-md text-muted hover:bg-mist/60 hover:text-red-800" aria-label={`Remove ${product.name}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
