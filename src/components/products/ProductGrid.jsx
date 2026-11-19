import ProductCard from './ProductCard';

export default function ProductGrid({ products, cols = 'grid-cols-2 lg:grid-cols-4' }) {
  return (
    <ul className={`grid gap-3 sm:gap-5 ${cols}`}>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
