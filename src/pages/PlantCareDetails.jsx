import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Lightbulb } from 'lucide-react';
import { getGuide, careGuides } from '../data/careGuides';
import { getProduct } from '../data/products';
import { EditorialScene } from '../components/art/scenes';
import CareCard, { DifficultyTag } from '../components/care/CareCard';
import ProductGrid from '../components/products/ProductGrid';
import { Breadcrumb, DemoNotice } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

export default function PlantCareDetails() {
  const { slug } = useParams();
  const g = getGuide(slug);
  usePageMeta(g?.title, g?.summary);
  if (!g) return <NotFound />;
  const plants = g.related.map(getProduct).filter(Boolean);
  const more = careGuides.filter((x) => x.slug !== slug).sort((a, b) => Number(b.topic === g.topic) - Number(a.topic === g.topic)).slice(0, 3);

  return (
    <article>
      <header className="bg-mist/40">
        <div className="container grid items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
          <div>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Plant Care', to: '/plant-care' }, { label: g.title }]} />
            <div className="mt-6 flex items-center gap-3 text-xs text-muted">
              <DifficultyTag level={g.difficulty} /> {g.topic} · <Clock size={12} /> {g.minutes} min read
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{g.title}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">{g.intro}</p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <EditorialScene kind={g.image} label={g.title} className="aspect-[4/3] w-full" />
          </div>
        </div>
      </header>

      <div className="container grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_260px]">
        <div>
          <ol className="space-y-6">
            {g.steps.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-serif text-white">{i + 1}</span>
                <div>
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <p className="mt-1.5 leading-relaxed text-ink/85">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          {g.tips.length > 0 && (
            <aside className="mt-10 rounded-card bg-mist/60 p-5">
              <p className="flex items-center gap-2 font-semibold text-forest">
                <Lightbulb size={17} /> Verdelle tips
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-ink/85">
                {g.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </aside>
          )}
          <DemoNotice className="mt-6">General guidance only — plant needs vary with climate, soil, pot and season. For pets that may have eaten a plant, contact your vet.</DemoNotice>
          <Link to="/plant-care" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline">
            <ArrowLeft size={15} /> All care guides
          </Link>
        </div>
        <aside aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 rounded-card border border-line p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">In this guide</p>
            <ol className="mt-3 space-y-2 text-sm">
              {g.steps.map(([t], i) => (
                <li key={t} className="text-ink/80">{i + 1}. {t}</li>
              ))}
            </ol>
            <Link to="/shop" className="btn-primary mt-5 w-full text-xs">Shop plants</Link>
          </div>
        </aside>
      </div>

      {plants.length > 0 && (
        <section className="section bg-card/60">
          <div className="container">
            <h2 className="mb-6 text-2xl font-semibold">Plants for this guide</h2>
            <ProductGrid products={plants} />
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <h2 className="mb-6 text-2xl font-semibold">Keep learning</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <CareCard guide={m} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
