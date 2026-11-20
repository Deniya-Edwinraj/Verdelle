import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Package, Recycle, Sprout, HeartHandshake, Sun } from 'lucide-react';
import { EditorialScene, FramedPlant } from '../components/art/scenes';
import { PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

/** Decorative fern frond: tapered leaflets in pairs along a gently curved stem. */
function Frond({ className = '', leaves = 13 }) {
  const P0 = [30, 390];
  const C = [70, 150];
  const P1 = [330, 40];
  const at = (t) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C[0] + t ** 2 * P1[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C[1] + t ** 2 * P1[1],
  ];
  const angleAt = (t) => {
    const dx = 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]);
    const dy = 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const leaf = (L, w) => `M0 0C${L * 0.3} ${-w} ${L * 0.72} ${-w} ${L} 0C${L * 0.72} ${w} ${L * 0.3} ${w} 0 0Z`;
  const items = [];
  for (let i = 1; i <= leaves; i++) {
    const t = 0.08 + (i / (leaves + 1)) * 0.9;
    const [x, y] = at(t);
    const a = angleAt(t);
    const L = 120 * (1 - t * 0.72);
    const w = L * 0.2;
    [-1, 1].forEach((side) => {
      items.push(<path key={`${i}${side}`} d={leaf(L, w)} transform={`translate(${x} ${y}) rotate(${a + side * 52})`} />);
    });
  }
  const [tx, ty] = at(1);
  return (
    <svg aria-hidden="true" viewBox="0 0 420 420" className={className} fill="currentColor">
      <path d={`M${P0[0]} ${P0[1]}Q${C[0]} ${C[1]} ${P1[0]} ${P1[1]}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {items}
      <path d={leaf(36, 8)} transform={`translate(${tx} ${ty}) rotate(${angleAt(1)})`} />
    </svg>
  );
}

export default function About() {
  usePageMeta('Our Story', 'Meet Verdelle — our story, mission, plant-quality promise and sustainable packaging approach.');
  return (
    <>
      <PageHero eyebrow="Our story" title="Rooted in a love of green spaces" subtitle="Verdelle started with a simple idea: everyone deserves a home that feels alive." crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} plants={['monstera', 'fiddle']} />

      <section className="section relative overflow-hidden">
        {/* Soft background wash */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-mist/60 blur-3xl" />

        <div className="container relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Imagery */}
          <div className="relative mx-auto w-full max-w-xl lg:col-span-6">
            <div aria-hidden="true" className="absolute -right-4 -top-4 bottom-8 left-8 rounded-[28px] border border-sage/50 md:-right-6 md:-top-6" />
            <div className="relative overflow-hidden rounded-[28px] shadow-lift">
              <EditorialScene kind="shelf" label="Plants on a sunny greenhouse shelf" className="aspect-[4/5] w-full transition-transform duration-700 hover:scale-[1.03] sm:aspect-[5/4] lg:aspect-[4/5]" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 shadow-float ring-1 ring-line/70 backdrop-blur sm:-left-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-white">
                <Sprout size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-serif text-lg leading-none text-forest">Hand-picked</p>
                <p className="mt-1 text-xs text-muted">and packed with care</p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
              <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
              How it began
            </p>
            <h2 className="mt-4 text-[34px] font-medium leading-[1.12] tracking-tight md:text-[46px]">
              From a windowsill collection to <em className="font-normal italic text-botanical">your doorstep</em>
            </h2>

            <p className="mt-6 font-serif text-xl leading-relaxed text-ink/90">
              What began as a crowded windowsill of cuttings shared with friends grew into a small online shop for healthy, beautifully grown indoor plants.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Today we work with growers who share our care for quality, and we pack every plant as if it were going to our own homes.
            </p>

            {/* Journey */}
            <ol className="mt-9 grid grid-cols-3 gap-3 border-t border-line pt-7">
              {[
                [Leaf, 'The windowsill', 'Cuttings shared with friends'],
                [HeartHandshake, 'Our growers', 'Partners who share our standards'],
                [Package, 'Your home', 'Packed as if it were our own'],
              ].map(([Icon, t, b], i) => (
                <li key={t} className="relative">
                  <span className="flex items-center gap-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-forest">
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    {i < 2 && <span aria-hidden="true" className="hidden h-px flex-1 bg-gradient-to-r from-sage/60 to-transparent sm:block" />}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{t}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{b}</p>
                </li>
              ))}
            </ol>

          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        {/* Ambient glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-botanical/45 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[360px] w-[360px] rounded-full bg-sage/15 blur-3xl" />
        {/* Soft fern fronds */}
        <Frond className="pointer-events-none absolute -bottom-10 -left-10 -z-10 hidden h-[420px] w-[420px] text-sage/[0.14] md:block" />
        <Frond className="pointer-events-none absolute -right-12 -top-12 -z-10 hidden h-[300px] w-[300px] rotate-180 text-sage/[0.09] md:block" />
        {/* Fine line pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />

        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft">
              <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
              Our mission
              <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
            </p>
            <h2 className="mt-6 text-[34px] font-medium leading-[1.15] tracking-tight text-white md:text-[52px]">
              To make living with plants <em className="font-normal italic text-sage-soft">simple, joyful</em> and accessible.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-base">
              We help you choose the right plant for your light and lifestyle, deliver it in great condition, and back it with honest, practical care advice — including clear pet-safety information.
            </p>
          </div>

          <ul className="mx-auto mt-14 grid max-w-5xl gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
            {[
              [Sun, 'The right match', 'Plants chosen for your light, space and lifestyle.'],
              [Package, 'Arrives thriving', 'Carefully packed so it reaches you in great condition.'],
              [HeartHandshake, 'Honest care', 'Practical advice and clear pet-safety information.'],
            ].map(([Icon, t, b], i) => (
              <li
                key={t}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-sage-soft/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-soft/15 text-sage-soft ring-1 ring-sage-soft/20 transition group-hover:bg-sage-soft group-hover:text-forest-900">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <span className="font-serif text-3xl italic leading-none text-white/15">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[440px] w-[440px] rounded-full bg-mist/60 blur-3xl" />
        <div className="container relative">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                Our approach
              </p>
              <h2 className="mt-4 text-[34px] font-medium leading-[1.12] tracking-tight md:text-[46px]">
                Care in every <em className="font-normal italic text-botanical">small detail</em>
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted md:col-span-5 md:pb-2">
              From the greenhouse to your front door, these are the principles behind every plant we send.
            </p>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Sprout, 'Grown with care', 'Plants are acclimatised before shipping so they settle into homes more easily.'],
              [Sun, 'Quality-checked', 'Each plant is inspected for healthy roots, foliage and pests before it leaves us.'],
              [HeartHandshake, 'Honest advice', 'We’d rather recommend the right plant than the most expensive one.'],
              [Package, 'Thoughtful packing', 'Soil is secured, leaves are supported and boxes are clearly marked.'],
              [Recycle, 'Low-waste packaging', 'Recyclable boxes, paper padding and minimal plastic wherever possible.'],
              [Leaf, 'Clear pet labels', 'Pet-safety status on every plant, based on ASPCA listings.'],
            ].map(([Icon, t, b], i) => (
              <li
                key={t}
                id={t === 'Low-waste packaging' ? 'sustainability' : undefined}
                className="group relative bg-white p-7 transition-colors duration-300 hover:bg-warm md:p-9"
              >
                {/* Accent line revealed on hover */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-botanical to-sage transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-forest transition duration-300 group-hover:-rotate-6 group-hover:bg-forest group-hover:text-white">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="font-serif text-2xl italic leading-none text-sage-soft transition-colors group-hover:text-sage">0{i + 1}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section relative overflow-hidden bg-mist/40">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-white/70 blur-3xl" />
        <div className="container relative">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
                Behind the scenes
              </p>
              <h2 className="mt-4 text-[34px] font-medium leading-[1.12] tracking-tight md:text-[46px]">
                In the <em className="font-normal italic text-botanical">greenhouse</em>
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted md:col-span-5 md:pb-2">
              A glimpse of the plants we grow, check and nurture before they make their way to you.
            </p>
          </div>

          <ul className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-4 md:gap-5">
            {[
              ['monstera', 'basket', 'Monstera', 'col-span-2 row-span-2'],
              ['areca', 'concrete', 'Areca palm', 'col-span-2 md:col-span-2'],
              ['anthurium', 'white', 'Anthurium', ''],
              ['spider', 'terracotta', 'Spider plant', ''],
            ].map(([s, pot, name, span]) => (
              <li key={s} className={`group relative overflow-hidden rounded-[24px] shadow-soft ring-1 ring-black/5 ${span}`}>
                <FramedPlant species={s} pot={pot} seed={`about-${s}`} className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <p className="font-serif text-lg leading-tight text-white md:text-xl">{name}</p>
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 translate-y-2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md ring-1 ring-white/25 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Leaf size={15} strokeWidth={1.7} />
                  </span>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-forest-900 px-6 py-16 text-center text-white shadow-float md:px-16 md:py-24">
          {/* Ambient glows */}
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/2 -z-10 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-botanical/50 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-sage/15 blur-3xl" />
          {/* Fine dot texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          {/* Fern fronds framing the message */}
          <Frond className="pointer-events-none absolute -bottom-16 -left-16 -z-10 hidden h-[340px] w-[340px] text-sage/[0.16] md:block" />
          <Frond className="pointer-events-none absolute -bottom-16 -right-16 -z-10 hidden h-[340px] w-[340px] -scale-x-100 text-sage/[0.16] md:block" />

          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 text-sage-soft ring-1 ring-white/15 backdrop-blur">
            <Sprout size={24} strokeWidth={1.5} />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-[34px] font-medium leading-[1.12] tracking-tight text-white md:text-[52px]">
            Ready to grow <em className="font-normal italic text-sage-soft">your nest?</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/70 md:text-base">
            Explore our favourite plants or find the perfect match for your light.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-forest shadow-soft transition hover:-translate-y-0.5 hover:bg-mist"
            >
              Shop plants
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/plant-care"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
            >
              Plant care guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
