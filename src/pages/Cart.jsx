import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import ProductCarousel from '../components/products/ProductCarousel';
import { EmptyState, PageHeader, SectionHeading } from '../components/ui';
import { products } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Cart() {
  usePageMeta('Your Cart');
  const { items, count, clear } = useCart();
  const suggestions = products.filter((p) => p.bestSeller).filter((p) => !items.some((i) => i.id === p.id));

  return (
    <>
      <PageHeader title="Your Cart" crumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} subtitle={count ? `${count} item${count > 1 ? 's' : ''} in your cart` : undefined} />
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          body="Find a leafy friend for every corner of your home."
          action={
            <Link to="/shop" className="btn-primary px-8">
              Continue Shopping
            </Link>
          }
        />
      ) : (
        <section className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[1fr_380px]">
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {items.map((i) => (
                <CartItem key={i.key} item={i} />
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline">
                <ArrowLeft size={15} /> Continue Shopping
              </Link>
              <button onClick={clear} className="text-sm text-muted underline hover:text-ink">
                Clear cart
              </button>
            </div>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary>
              <Link to="/checkout" className="btn-primary mt-6 h-12 w-full">
                <Lock size={15} /> Proceed to Checkout
              </Link>
              <p className="mt-3 text-center text-xs text-muted">Taxes calculated at checkout where applicable.</p>
            </OrderSummary>
          </div>
        </section>
      )}
      {suggestions.length > 0 && (
        <section className="section bg-card/60">
          <div className="container">
            <SectionHeading title="Plant lovers also picked" />
            <ProductCarousel products={suggestions} label="Suggested products" />
          </div>
        </section>
      )}
    </>
  );
}
