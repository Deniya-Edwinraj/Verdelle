import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { products, getCategory, CATEGORIES, searchProducts } from '../data/products';
import Catalog from '../components/products/Catalog';
import { PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

const BANNER = {
  'easy-care': ['zz', 'snake'],
  'low-light': ['chinese-evergreen', 'zz'],
  'pet-friendly': ['spider', 'calathea'],
  flowering: ['anthurium', 'peace-lily'],
  'large-plants': ['bird-of-paradise', 'fiddle'],
  'pots-and-planters': ['peperomia', 'aloe'],
};

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'popular';
  const cat = category ? getCategory(category) : null;

  const base = useMemo(() => {
    let list = cat ? products.filter(cat.test) : products;
    if (q) {
      const found = searchProducts(q);
      list = list.filter((p) => found.includes(p));
    }
    return list;
  }, [cat, q]);

  const title = q ? `Results for “${q}”` : cat ? cat.name : 'All Plants';
  const blurb = q ? `${base.length} plant${base.length === 1 ? '' : 's'} match your search.` : cat ? cat.blurb : 'Hand-picked indoor plants, pots and planters — filtered by light, care level and pet safety.';
  usePageMeta(title, blurb);
  if (category && !cat) return <NotFound />;

  return (
    <>
      <PageHero
        title={title}
        subtitle={blurb}
        plants={BANNER[cat?.slug] || ['monstera', 'snake']}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, ...(cat ? [{ label: cat.name }] : q ? [{ label: 'Search' }] : [])]}
      >
        <p className="mt-5 text-sm text-white/80">{base.length} products</p>
      </PageHero>
      <nav aria-label="Shop categories" className="border-b border-line bg-white">
        <ul className="no-scrollbar container flex gap-2 overflow-x-auto py-3">
          <li>
            <Link to="/shop" className={`block whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${!cat && !q ? 'bg-forest text-white' : 'bg-card text-ink hover:bg-mist'}`}>
              All Plants
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop/${c.slug}`} className={`block whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${cat?.slug === c.slug ? 'bg-forest text-white' : 'bg-card text-ink hover:bg-mist'}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container py-10 md:py-14">
        <Catalog
          products={base}
          initialSort={sort}
          resetKey={`${category}|${q}`}
          onSortChange={(v) => {
            const next = new URLSearchParams(params);
            next.set('sort', v);
            setParams(next, { replace: true });
          }}
        />
      </div>
    </>
  );
}
