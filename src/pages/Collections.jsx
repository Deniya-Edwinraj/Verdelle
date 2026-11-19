import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections, collectionProducts } from '../data/collections';
import { FramedPlant } from '../components/art/scenes';
import { PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Collections() {
  usePageMeta('Collections', 'Shop Verdelle collections — low-maintenance greens, low-light plants, statement floor plants, pet-friendly picks and more.');
  return (
    <>
      <PageHero eyebrow="Curated for you" title="Plant Collections" subtitle="Thoughtfully grouped plants for every room, routine and level of experience." crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} plants={['bird-of-paradise', 'peace-lily']} />
      <section className="section">
        <ul className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link to={`/collections/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-line/70 transition hover:shadow-lift">
                <div className="overflow-hidden">
                  <FramedPlant species={c.feature.species} pot={c.feature.pot} seed={`col-${c.slug}`} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-botanical">{c.tag}</span>
                  <h2 className="mt-1 text-xl font-semibold">{c.name}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-muted">{c.tagline}</p>
                  <p className="mt-4 flex items-center justify-between text-sm font-medium text-forest">
                    {collectionProducts(c.slug).length} products <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
