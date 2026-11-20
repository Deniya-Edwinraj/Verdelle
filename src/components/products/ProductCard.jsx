import { Link } from 'react-router-dom';
import { Bell, Eye, Heart, Plus, Scale, ShoppingBag, Star } from 'lucide-react';
import { ProductImage } from '../art/scenes';
import { money } from '../ui';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';

export function useProductActions(product) {
  const cart = useCart();
  const wl = useWishlist();
  const notify = useToast();
  const { openCart, setQuickView, inCompare, toggleCompare } = useUI();
  const outOfStock = product.stock === 'out-of-stock';
  return {
    outOfStock,
    wished: wl.has(product.id),
    compared: inCompare(product.id),
    addToCart: (opts = {}) => {
      if (outOfStock) return;
      cart.add(product, opts);
      setQuickView(null);
      openCart({ product, size: opts.size || product.sizes[0].label, pot: opts.pot || product.potOptions[0]?.label || null, qty: opts.qty || 1 });
    },
    toggleCompare: () => {
      const r = toggleCompare(product.id);
      if (r === 'full') notify('You can compare up to 3 plants — remove one first', { type: 'info' });
      else
        notify(r === 'added' ? `${product.name} added to compare` : 'Removed from compare', {
          type: 'info',
          action:
            r === 'added' ? (
              <Link to="/compare" className="shrink-0 text-xs font-semibold underline underline-offset-2">
                Compare
              </Link>
            ) : undefined,
        });
    },
    toggleWish: () => {
      const added = wl.toggle(product.id);
      notify(added ? `${product.name} saved to your wishlist` : `Removed from your wishlist`, { type: 'info' });
    },
  };
}

/** Product card: portrait photo, frosted actions, serif name, price row with round add-to-cart. */
export default function ProductCard({ product, className = '' }) {
  const { setQuickView } = useUI();
  const { addToCart, toggleWish, wished, outOfStock, compared, toggleCompare } = useProductActions(product);
  const href = `/product/${product.slug}`;
  const badge = outOfStock ? 'Sold out' : product.discount ? `-${Math.round(product.discount * 100)}%` : product.isNew ? 'New' : product.bestSeller ? 'Bestseller' : null;
  const badgeCls = badge?.startsWith('-') ? 'bg-clay text-white' : badge === 'Sold out' ? 'bg-ink/75 text-white' : badge === 'New' ? 'bg-forest text-white' : 'bg-white/90 text-forest';

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white p-2 shadow-[0_1px_2px_rgba(23,63,45,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:shadow-lift sm:p-2.5 ${className}`}
    >
      {/* image */}
      <div className="relative overflow-hidden rounded-xl bg-card">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage product={product} bg="transparent" className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        </Link>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {badge && <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] shadow-sm ${badgeCls}`}>{badge}</span>}

        <button
          type="button"
          onClick={toggleWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full border border-white/60 backdrop-blur-md transition ${wished ? 'bg-white text-clay' : 'bg-white/70 text-forest hover:bg-white'}`}
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>
        {product.type === 'plant' && (
          <button
            type="button"
            onClick={toggleCompare}
            aria-pressed={compared}
            aria-label={compared ? `Remove ${product.name} from compare` : `Compare ${product.name}`}
            title={compared ? 'Remove from compare' : 'Compare'}
            className={`absolute right-2.5 top-[52px] grid h-9 w-9 place-items-center rounded-full border border-white/60 backdrop-blur-md transition ${
              compared ? 'bg-forest text-white' : 'bg-white/70 text-forest hover:bg-white sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100'
            }`}
          >
            <Scale size={15} />
          </button>
        )}

        {/* quick view: slides up on hover (desktop), focusable for keyboard users */}
        <button
          type="button"
          onClick={() => setQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="absolute inset-x-2.5 bottom-2.5 hidden translate-y-3 items-center justify-center gap-2 rounded-full bg-white/90 py-2 text-xs font-medium text-forest opacity-0 shadow-soft backdrop-blur-md transition-all duration-300 hover:bg-white focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
        >
          <Eye size={14} /> Quick view
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3.5 sm:px-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-sage">{product.plantType}</p>
          {product.rating ? (
            <p className="flex shrink-0 items-center gap-1 text-[11px] text-muted" aria-label={`Rated ${product.rating} out of 5 from ${product.reviewCount} reviews`}>
              <Star size={11} className="fill-[#E9C46A] text-[#E9C46A]" aria-hidden="true" />
              <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
              <span className="hidden sm:inline">({product.reviewCount})</span>
            </p>
          ) : null}
        </div>
        <h3 className="mt-1.5 font-serif text-[17px] font-semibold leading-snug text-ink sm:text-[18px]">
          <Link to={href} className="transition-colors hover:text-botanical">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11.5px] italic text-muted">{product.botanical}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="leading-tight">
            {product.sizes.length > 1 && <span className="block text-[10px] uppercase tracking-wider text-muted">From</span>}
            <span className="flex items-baseline gap-1.5">
              <span className="font-serif text-[19px] font-semibold text-forest">{money(product.price)}</span>
              {product.originalPrice && <span className="text-xs text-muted line-through">{money(product.originalPrice)}</span>}
            </span>
          </div>
          {outOfStock ? (
            <Link
              to={`${href}#notify`}
              aria-label={`Notify me when ${product.name} is back in stock`}
              title="Notify me when back in stock"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-forest transition hover:bg-forest hover:text-white"
            >
              <Bell size={16} />
            </Link>
          ) : (
          <button
            type="button"
            onClick={() => addToCart()}
            disabled={outOfStock}
            aria-label={outOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            className="group/add relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-white shadow-soft transition-all duration-300 hover:bg-botanical hover:shadow-lift disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none"
          >
            <ShoppingBag size={16} className="transition-transform duration-300 group-hover/add:scale-90" />
            {!outOfStock && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-clay text-white ring-2 ring-white">
                <Plus size={10} strokeWidth={3} />
              </span>
            )}
          </button>
          )}
        </div>
      </div>
    </article>
  );
}
