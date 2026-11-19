import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Heart, Sun } from 'lucide-react';
import { Modal, PetBadge, QuantitySelector, RatingStars, money } from '../ui';
import { ProductImage } from '../art/scenes';
import { useUI } from '../../context/UIContext';
import { unitPriceFor } from '../../context/CartContext';
import { useProductActions } from './ProductCard';
import OptionSelector from './OptionSelector';

function Body({ product, onClose }) {
  const [size, setSize] = useState(product.sizes[0].label);
  const [pot, setPot] = useState(product.potOptions[0]?.label);
  const [qty, setQty] = useState(1);
  const { addToCart, toggleWish, wished, outOfStock } = useProductActions(product);
  const p = unitPriceFor(product, size, pot);

  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-card">
        <ProductImage product={product} className="aspect-square h-full w-full" />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div>
          <p className="eyebrow">{product.plantType}</p>
          <h2 className="mt-1 text-3xl leading-tight">{product.name}</h2>
          <p className="text-sm italic text-muted">{product.botanical}</p>
        </div>
        <RatingStars rating={product.rating} count={product.reviewCount} showValue />
        <p className="flex items-baseline gap-2 text-xl">
          <span className="font-semibold text-forest">{money(p.price)}</span>
          {product.discount > 0 && <span className="text-sm text-muted line-through">{money(p.regular)}</span>}
        </p>
        {product.type === 'plant' && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-forest"><Sun size={12} /> {product.light.join(' / ')}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-forest"><Droplets size={12} /> {product.watering}</span>
            <PetBadge status={product.pet} />
          </div>
        )}
        <OptionSelector legend="Size" options={product.sizes} value={size} onChange={setSize} />
        {product.potOptions.length > 0 && <OptionSelector legend="Pot" options={product.potOptions} value={pot} onChange={setPot} priceMode="addon" />}
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <button
            className="btn-primary h-11 flex-1"
            disabled={outOfStock}
            onClick={() => {
              addToCart({ size, pot, qty });
              onClose();
            }}
          >
            {outOfStock ? 'Sold out' : 'Add to Cart'}
          </button>
          <button onClick={toggleWish} aria-pressed={wished} aria-label="Toggle wishlist" className="grid h-11 w-11 place-items-center rounded-md border border-line text-forest hover:bg-mist/60">
            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>
        <Link to={`/product/${product.slug}`} onClick={onClose} className="text-sm font-medium text-forest underline underline-offset-4 hover:text-botanical">
          View full details & care
        </Link>
      </div>
    </div>
  );
}

export default function QuickViewModal() {
  const { quickView, setQuickView } = useUI();
  const close = () => setQuickView(null);
  return (
    <Modal open={!!quickView} onClose={close} title={quickView ? `Quick view: ${quickView.name}` : 'Quick view'}>
      {quickView && <Body key={quickView.id} product={quickView} onClose={close} />}
    </Modal>
  );
}
