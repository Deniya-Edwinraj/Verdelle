import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Scale, ShoppingBag, X } from 'lucide-react';
import { COMPARE_MAX, useUI } from '../context/UIContext';
import { getProductById, PET, products } from '../data/products';
import { ProductImage } from '../components/art/scenes';
import { PageHero, RatingStars, money } from '../components/ui';
import { useProductActions } from '../components/products/ProductCard';
import { usePageMeta } from '../hooks/usePageMeta';

const ROWS = [
  ['Price from', (p) => money(p.price)],
  ['Rating', (p) => <RatingStars rating={p.rating} count={p.reviewCount} size={13} />],
  ['Plant type', (p) => p.plantType],
  ['Light', (p) => p.light.join(', ')],
  ['Watering', (p) => p.watering],
  ['Humidity', (p) => p.humidity],
  ['Temperature', (p) => p.temperature],
  ['Care level', (p) => p.difficulty],
  [
    'Pet safety',
    (p) => (
      <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${p.pet === 'safe' ? 'bg-mist text-forest' : p.pet === 'toxic' ? 'bg-[#F6E7DF] text-[#8A3B1E]' : 'bg-card text-muted'}`}>
        {PET[p.pet].label}
      </span>
    ),
  ],
  ['Sizes', (p) => p.sizes.map((s) => s.label).join(', ')],
  ['Mature size', (p) => p.matureSize],
  ['Growth', (p) => p.growth],
];

function AddButton({ product }) {
  const { addToCart, outOfStock } = useProductActions(product);
  return (
    <button
      onClick={() => addToCart()}
      disabled={outOfStock}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-forest text-xs font-semibold text-white transition hover:bg-botanical disabled:bg-line disabled:text-muted"
    >
      <ShoppingBag size={14} /> {outOfStock ? 'Sold out' : 'Add to cart'}
    </button>
  );
}

export default function Compare() {
  usePageMeta('Compare Plants', 'Compare light, watering, care level and pet safety side by side.');
  const { compare, toggleCompare, clearCompare } = useUI();
  const items = compare.map(getProductById).filter(Boolean);
  const suggestions = products.filter((p) => p.type === 'plant' && !compare.includes(p.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const slots = Math.max(0, COMPARE_MAX - items.length);

  return (
    <>
      <PageHero
        eyebrow="Side by side"
        title="Compare Plants"
        subtitle="Line up to three plants and see which one suits your light, routine and home best."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Compare' }]}
        plants={['calathea', 'zz']}
      />

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-line/70">
          {items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-mist text-forest">
                <Scale size={30} strokeWidth={1.5} />
              </span>
              <h2 className="mt-6 text-[30px] font-medium tracking-tight">
                Nothing to <em className="font-normal italic text-botanical">compare</em> yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted">Tap the scales icon on any plant card, or pick a few below.</p>
            </div>
          ) : (
            <div className="thin-scrollbar overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <caption className="sr-only">Plant comparison</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-40 p-5 text-left align-bottom">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">{items.length} of {COMPARE_MAX} plants</span>
                      <button onClick={clearCompare} className="mt-2 block text-xs font-medium text-botanical hover:underline">
                        Clear all
                      </button>
                    </th>
                    {items.map((p) => (
                      <th key={p.id} scope="col" className="p-4 align-top font-normal">
                        <div className="relative">
                          <Link to={`/product/${p.slug}`} className="block overflow-hidden rounded-2xl bg-card">
                            <ProductImage product={p} className="aspect-square w-full" />
                          </Link>
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-forest shadow-soft backdrop-blur transition hover:bg-forest hover:text-white"
                            aria-label={`Remove ${p.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <Link to={`/product/${p.slug}`} className="mt-3 block text-left font-serif text-lg font-semibold text-ink hover:text-botanical">
                          {p.name}
                        </Link>
                        <p className="text-left text-xs italic text-muted">{p.botanical}</p>
                        <div className="mt-3">
                          <AddButton product={p} />
                        </div>
                      </th>
                    ))}
                    {Array.from({ length: slots }, (_, i) => (
                      <th key={`slot-${i}`} scope="col" className="p-4 align-top">
                        <Link
                          to="/shop"
                          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-xs font-medium text-muted transition hover:border-sage hover:text-forest"
                        >
                          <Plus size={20} /> Add a plant
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label, render], r) => (
                    <tr key={label} className={r % 2 === 0 ? 'bg-card/50' : ''}>
                      <th scope="row" className="p-4 pl-5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {label}
                      </th>
                      {items.map((p) => (
                        <td key={p.id} className="p-4 text-ink/85">
                          {render(p)}
                        </td>
                      ))}
                      {Array.from({ length: slots }, (_, i) => (
                        <td key={i} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {items.length < COMPARE_MAX && (
          <div className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                  <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                  Popular picks
                </p>
                <h2 className="mt-3 text-[28px] font-medium tracking-tight md:text-[34px]">
                  Add a plant to <em className="font-normal italic text-botanical">compare</em>
                </h2>
              </div>
              <Link to="/plant-finder" className="group hidden items-center gap-1.5 text-sm font-medium text-forest sm:inline-flex">
                Try the Plant Finder <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="group w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="relative block">
                      <ProductImage product={p} className="aspect-square w-full" />
                      <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-forest shadow-soft transition group-hover:bg-forest group-hover:text-white">
                        <Plus size={15} />
                      </span>
                    </span>
                    <span className="block truncate px-3 pt-2 text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block px-3 pb-3 text-xs text-muted">{p.difficulty} care</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
