import { Link } from 'react-router-dom';
import { ArrowRight, Sprout } from 'lucide-react';
import { collections, collectionProducts } from '../data/collections';
import { FramedPlant } from '../components/art/scenes';
import { PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Collections() {
  usePageMeta('Collections', 'Shop Verdelle collections — low-maintenance greens, low-light plants, statement floor plants, pet-friendly picks and more.');
  return (
    <>
      <PageHero eyebrow="Curated for you" title="Plant Collections" subtitle="Thoughtfully grouped plants for every room, routine and level of experience." crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} plants={['bird-of-paradise', 'peace-lily']} />
      <section className="section relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-mist/60 blur-3xl" />
        <div className="container relative">
          {/* Header */}
          <div className="mb-12 grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                {collections.length} curated edits
              </p>
              <h2 className="mt-4 text-[34px] font-medium leading-[1.12] tracking-tight md:text-[46px]">
                Find your <em className="font-normal italic text-botanical">perfect match</em>
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted md:col-span-5 md:pb-2">
              Whether you’re after something forgiving, sun-loving or simply striking — start with a collection made for the way you live.
            </p>
          </div>

          {/* Bento grid */}
          <ul className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[270px] md:gap-5 lg:grid-cols-4">
            {collections.map((c, i) => {
              const featured = i === 0;
              const wide = i === 5;
              const count = collectionProducts(c.slug).length;
              return (
                <li key={c.slug} className={featured ? 'sm:col-span-2 sm:row-span-2' : wide ? 'sm:col-span-2' : ''}>
                  <Link
                    to={`/collections/${c.slug}`}
                    className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-5 text-white shadow-soft ring-1 ring-black/5 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-lift md:p-6"
                  >
                    <FramedPlant
                      species={c.feature.species}
                      pot={c.feature.pot}
                      seed={`col-${c.slug}`}
                      className="absolute inset-0 -z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/85 via-forest-900/25 to-forest-900/5 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/25 backdrop-blur-md">
                        {c.tag}
                      </span>
                      <span className="font-serif text-2xl italic leading-none text-white/60">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Bottom content */}
                    <div>
                      <h3 className={`font-serif font-semibold leading-tight tracking-tight text-white ${featured ? 'text-[30px] md:text-[40px]' : 'text-[22px]'}`}>{c.name}</h3>
                      <p
                        className={`mt-2 text-sm leading-relaxed text-white/75 ${
                          featured || wide ? 'max-w-md' : 'max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100'
                        }`}
                      >
                        {featured ? c.description : c.tagline}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
                        <span className="text-xs font-medium text-white/85">
                          {count} {count === 1 ? 'product' : 'products'}
                        </span>
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-white group-hover:text-forest">
                          <ArrowRight size={17} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Help strip */}
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70 sm:flex-row sm:items-center md:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
                <Sprout size={22} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold text-ink">
                  Not sure where to <em className="font-normal italic text-botanical">start?</em>
                </p>
                <p className="mt-0.5 text-sm text-muted">Our care guides help you match plants to your light and routine.</p>
              </div>
            </div>
            <Link
              to="/plant-care"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical"
            >
              Explore care guides <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
