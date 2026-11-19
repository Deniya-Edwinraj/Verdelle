import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';
import { EmptyState, PageHeader } from '../components/ui';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Wishlist() {
  usePageMeta('Wishlist');
  const { ids } = useWishlist();
  const { add } = useCart();
  const notify = useToast();
  const items = ids.map(getProductById).filter(Boolean);
  const available = items.filter((p) => p.stock !== 'out-of-stock');

  return (
    <>
      <PageHeader title="Your Wishlist" crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} subtitle={items.length ? `${items.length} saved product${items.length > 1 ? 's' : ''}` : undefined} />
      {items.length ? (
        <section className="container py-10 md:py-14">
          {available.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                className="btn-primary"
                onClick={() => {
                  available.forEach((p) => add(p));
                  notify(`${available.length} item${available.length > 1 ? 's' : ''} added to your cart`);
                }}
              >
                Add all to cart
              </button>
            </div>
          )}
          <ProductGrid products={items} />
          <p className="mt-8 text-center text-xs text-muted">Your wishlist is saved in this browser.</p>
        </section>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          body="Tap the heart on any product to save it here for later."
          action={
            <Link to="/shop" className="btn-primary px-8">
              Explore products
            </Link>
          }
        />
      )}
    </>
  );
}
