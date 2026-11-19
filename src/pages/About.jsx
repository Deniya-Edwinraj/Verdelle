import { Link } from 'react-router-dom';
import { Leaf, Package, Recycle, Sprout, HeartHandshake, Sun } from 'lucide-react';
import { EditorialScene, FramedPlant } from '../components/art/scenes';
import { DemoNotice, PageHero } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

export default function About() {
  usePageMeta('Our Story', 'Meet Verdelle — our story, mission, plant-quality promise and sustainable packaging approach.');
  return (
    <>
      <PageHero eyebrow="Our story" title="Rooted in a love of green spaces" subtitle="Verdelle started with a simple idea: everyone deserves a home that feels alive." crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} plants={['monstera', 'fiddle']} />

      <section className="section">
        <div className="container grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <EditorialScene kind="shelf" label="Plants on a sunny greenhouse shelf" className="aspect-[4/3] w-full" />
          </div>
          <div>
            <p className="eyebrow">How it began</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">From a windowsill collection to your doorstep</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/80">
              <p>What began as a crowded windowsill of cuttings shared with friends grew into a small online shop for healthy, beautifully grown indoor plants.</p>
              <p>Today we work with growers who share our care for quality, and we pack every plant as if it were going to our own homes.</p>
            </div>
            <DemoNotice className="mt-5">Brand story details are illustrative placeholders until confirmed by the business.</DemoNotice>
          </div>
        </div>
      </section>

      <section className="bg-forest text-white">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">Our mission</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">To make living with plants simple, joyful and accessible.</h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/85 md:pt-8">
            We help you choose the right plant for your light and lifestyle, deliver it in great condition, and back it with honest, practical care advice — including clear pet-safety information.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">Our approach</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Sprout, 'Grown with care', 'Plants are acclimatised before shipping so they settle into homes more easily.'],
              [Sun, 'Quality-checked', 'Each plant is inspected for healthy roots, foliage and pests before it leaves us.'],
              [HeartHandshake, 'Honest advice', 'We’d rather recommend the right plant than the most expensive one.'],
              [Package, 'Thoughtful packing', 'Soil is secured, leaves are supported and boxes are clearly marked.'],
              [Recycle, 'Low-waste packaging', 'Recyclable boxes, paper padding and minimal plastic wherever possible.'],
              [Leaf, 'Clear pet labels', 'Pet-safety status on every plant, based on ASPCA listings.'],
            ].map(([Icon, t, b]) => (
              <li key={t} id={t === 'Low-waste packaging' ? 'sustainability' : undefined} className="rounded-card bg-card p-6">
                <Icon size={24} strokeWidth={1.5} className="text-botanical" />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-mist/40">
        <div className="container">
          <h2 className="text-center text-3xl font-semibold">In the greenhouse</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted">Team and greenhouse imagery placeholders — replace with your own photography.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ['monstera', 'basket'],
              ['areca', 'concrete'],
              ['anthurium', 'white'],
              ['spider', 'terracotta'],
            ].map(([s, pot]) => (
              <li key={s} className="overflow-hidden rounded-card">
                <FramedPlant species={s} pot={pot} seed={`about-${s}`} className="aspect-square w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex flex-col items-center rounded-2xl bg-card px-6 py-14 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to grow your nest?</h2>
          <p className="mt-3 max-w-md text-muted">Explore our favourite plants or find the perfect match for your light.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-primary px-7">Shop plants</Link>
            <Link to="/plant-care" className="btn-outline px-7">Plant care guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
