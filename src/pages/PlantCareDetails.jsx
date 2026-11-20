import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Layers, Lightbulb, ListOrdered, Sprout } from 'lucide-react';
import { getGuide, careGuides } from '../data/careGuides';
import { getProduct } from '../data/products';
import { EditorialScene } from '../components/art/scenes';
import CareCard from '../components/care/CareCard';
import ProductGrid from '../components/products/ProductGrid';
import { Breadcrumb, DemoNotice } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

/** Splits a title so its final word can be set in an italic accent. */
function splitTitle(title) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title, null];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

function Eyebrow({ children, light = false }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-sage-soft' : 'text-botanical'}`}>
      <span aria-hidden="true" className={`h-px w-10 ${light ? 'bg-sage-soft/60' : 'bg-botanical/60'}`} />
      {children}
    </p>
  );
}

/** Tracks which step is currently in view for the sidebar. */
function useActiveStep(count, slug) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive(0);
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = Array.from({ length: count }, (_, i) => document.getElementById(`step-${i + 1}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count, slug]);
  return active;
}

export default function PlantCareDetails() {
  const { slug } = useParams();
  const g = getGuide(slug);
  usePageMeta(g?.title, g?.summary);
  const active = useActiveStep(g?.steps.length || 0, slug);
  if (!g) return <NotFound />;
  const plants = g.related.map(getProduct).filter(Boolean);
  const more = careGuides.filter((x) => x.slug !== slug).sort((a, b) => Number(b.topic === g.topic) - Number(a.topic === g.topic)).slice(0, 3);
  const [lead, accent] = splitTitle(g.title);
  const beginner = g.difficulty === 'Beginner';
  const progress = ((active + 1) / g.steps.length) * 100;

  return (
    <article>
      {/* ---------- Hero ---------- */}
      <header className="relative isolate overflow-hidden bg-forest-900 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-botanical/45 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[380px] w-[380px] rounded-full bg-sage/15 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />

        <div className="container grid items-center gap-12 pb-28 pt-10 md:pb-36 md:pt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 backdrop-blur-md motion-safe:animate-fade-in">
              <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Plant Care', to: '/plant-care' }, { label: g.title }]} light />
            </div>

            <div className="mt-8 motion-safe:animate-fade-up">
              <Eyebrow light>{g.topic} guide</Eyebrow>
            </div>
            <h1 className="mt-4 text-[38px] font-medium leading-[1.08] tracking-tight text-white motion-safe:animate-fade-up md:text-[58px]" style={{ animationDelay: '80ms' }}>
              {lead}
              {accent && (
                <>
                  {' '}
                  <em className="font-normal italic text-sage-soft">{accent}</em>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-xl border-l border-white/25 pl-5 text-[15px] leading-relaxed text-white/75 motion-safe:animate-fade-up md:text-base" style={{ animationDelay: '160ms' }}>
              {g.intro}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5 motion-safe:animate-fade-up" style={{ animationDelay: '220ms' }}>
              {[
                [Layers, g.difficulty],
                [Clock, `${g.minutes} min read`],
                [ListOrdered, `${g.steps.length} steps`],
              ].map(([Icon, label]) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
                  <Icon size={14} className="text-sage-soft" /> {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div aria-hidden="true" className="absolute -right-4 -top-4 bottom-8 left-8 rounded-[28px] border border-sage-soft/25 md:-right-6 md:-top-6" />
            <div className="relative overflow-hidden rounded-[28px] shadow-float ring-1 ring-white/10">
              <EditorialScene kind={g.image} label={g.title} className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]" />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-ink shadow-float sm:-left-6">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${beginner ? 'bg-forest text-white' : 'bg-[#F3EBDD] text-[#7A5B2E]'}`}>
                <Sprout size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-serif text-lg leading-none text-forest">{beginner ? 'Beginner friendly' : `${g.difficulty} level`}</p>
                <p className="mt-1 text-xs text-muted">{g.steps.length} simple steps</p>
              </div>
            </div>
          </div>
        </div>

        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-10 w-full text-warm md:h-16">
          <path fill="currentColor" d="M0 80V40C240 8 480 0 720 0s480 8 720 40v40H0Z" />
        </svg>
      </header>

      {/* ---------- Body ---------- */}
      <div className="container grid max-w-6xl gap-12 py-14 md:py-20 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div>
          <Eyebrow>Step by step</Eyebrow>
          <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
            How to get it <em className="font-normal italic text-botanical">right</em>
          </h2>

          <ol className="relative mt-10 space-y-5">
            <span aria-hidden="true" className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-sage via-sage-soft to-transparent md:left-[31px]" />
            {g.steps.map(([title, body], i) => {
              const on = active === i;
              return (
                <li key={title} id={`step-${i + 1}`} data-index={i} className="relative flex scroll-mt-28 gap-5 md:gap-6">
                  <span
                    className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full font-serif text-xl italic ring-4 ring-warm transition duration-500 md:h-16 md:w-16 md:text-2xl ${
                      on ? 'bg-forest text-white shadow-float' : 'bg-white text-forest shadow-soft ring-offset-0'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className={`flex-1 rounded-[24px] p-6 ring-1 transition duration-500 md:p-7 ${
                      on ? 'bg-white shadow-lift ring-sage-soft' : 'bg-white/70 shadow-soft ring-line/70'
                    }`}
                  >
                    <h3 className="text-xl font-semibold tracking-tight md:text-[22px]">{title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{body}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {g.tips.length > 0 && (
            <aside className="relative isolate mt-12 overflow-hidden rounded-[28px] bg-forest-900 p-7 text-white md:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-botanical/50 blur-3xl" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-sage-soft ring-1 ring-white/15">
                  <Lightbulb size={20} strokeWidth={1.6} />
                </span>
                <p className="font-serif text-2xl text-white">
                  Verdelle <em className="italic text-sage-soft">tips</em>
                </p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {g.tips.map((t) => (
                  <li key={t} className="flex gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm leading-relaxed text-white/85 ring-1 ring-white/10">
                    <Check size={16} className="mt-0.5 shrink-0 text-sage-soft" />
                    {t}
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <DemoNotice className="mt-8">General guidance only — plant needs vary with climate, soil, pot and season. For pets that may have eaten a plant, contact your vet.</DemoNotice>

          <Link
            to="/plant-care"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-forest shadow-soft transition hover:border-forest hover:bg-forest hover:text-white"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> All care guides
          </Link>
        </div>

        {/* Sidebar */}
        <aside aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[24px] bg-white p-6 shadow-soft ring-1 ring-line/70">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">In this guide</p>
                <span className="text-xs text-muted">
                  {active + 1}/{g.steps.length}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-gradient-to-r from-botanical to-sage transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <ol className="mt-5 space-y-1">
                {g.steps.map(([t], i) => {
                  const on = active === i;
                  return (
                    <li key={t}>
                      <a
                        href={`#step-${i + 1}`}
                        className={`flex items-start gap-3 rounded-xl px-3 py-2 text-sm transition ${on ? 'bg-mist/70 font-medium text-forest' : 'text-ink/70 hover:bg-card hover:text-forest'}`}
                      >
                        <span className={`mt-px font-serif text-xs italic ${on ? 'text-botanical' : 'text-sage'}`}>{String(i + 1).padStart(2, '0')}</span>
                        {t}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="relative isolate overflow-hidden rounded-[24px] bg-forest-900 p-6 text-white">
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 -z-10 h-40 w-40 rounded-full bg-botanical/60 blur-2xl" />
              <p className="font-serif text-xl leading-snug text-white">
                Ready to put it into <em className="italic text-sage-soft">practice?</em>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/65">Browse plants that suit this guide.</p>
              <Link
                to="/shop"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:bg-mist"
              >
                Shop plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- Related plants ---------- */}
      {plants.length > 0 && (
        <section className="section relative overflow-hidden bg-mist/40">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-white/70 blur-3xl" />
          <div className="container relative">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Shop the guide</Eyebrow>
                <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                  Plants for this <em className="font-normal italic text-botanical">guide</em>
                </h2>
              </div>
              <Link to="/shop" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                Shop all plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ProductGrid products={plants} />
          </div>
        </section>
      )}

      {/* ---------- More guides ---------- */}
      <section className="section">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Care library</Eyebrow>
              <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
                Keep <em className="font-normal italic text-botanical">learning</em>
              </h2>
            </div>
            <Link to="/plant-care" className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest">
              View all guides <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
