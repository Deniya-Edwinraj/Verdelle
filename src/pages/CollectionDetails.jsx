import { Link, useParams } from 'react-router-dom';
import { getCollection, collectionProducts, collections } from '../data/collections';
import Catalog from '../components/products/Catalog';
import { PageHero } from '../components/ui';
import { FramedPlant } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

export default function CollectionDetails() {
  const { slug } = useParams();
  const c = getCollection(slug);
  usePageMeta(c?.name, c?.description);
  if (!c) return <NotFound />;
  const others = collections.filter((x) => x.slug !== slug).slice(0, 4);
  return (
    <>
      <PageHero eyebrow={`Collection · ${c.tag}`} title={c.name} subtitle={c.description} crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: c.name }]} plants={c.feature.species === 'none' ? ['peperomia', 'aloe'] : [c.feature.species, 'snake']}>
        <p className="mt-5 text-sm text-white/80">{collectionProducts(slug).length} products</p>
      </PageHero>
      <div className="container py-10 md:py-14">
        <Catalog products={collectionProducts(slug)} resetKey={slug} />
      </div>
      <section className="section bg-card/60">
        <div className="container">
          <h2 className="mb-6 text-2xl font-semibold">Explore more collections</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/collections/${o.slug}`} className="group block overflow-hidden rounded-card bg-white ring-1 ring-line transition hover:shadow-soft">
                  <FramedPlant species={o.feature.species} pot={o.feature.pot} seed={`col-${o.slug}`} className="aspect-[4/3] w-full" />
                  <span className="block p-4 font-serif text-lg font-semibold text-forest">{o.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
