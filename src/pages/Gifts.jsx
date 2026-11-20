import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Bell, Briefcase, Cake, CreditCard, Flower2, Gift, Heart, Home, PawPrint, PenLine, Truck, Zap } from 'lucide-react';
import { OCCASIONS } from '../data/services';
import { SITE } from '../data/site';
import ProductGrid from '../components/products/ProductGrid';
import { GiftCardArt } from '../components/art/scenes';
import { PageHero, money } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

const ICONS = { home: Home, cake: Cake, heart: Heart, flower: Flower2, paw: PawPrint, briefcase: Briefcase };

export default function Gifts() {
  usePageMeta('Gift Shop', 'Plant gifts for every occasion — housewarming, birthdays, thank yous and more, with gift wrap and a handwritten note.');
  const [params, setParams] = useSearchParams();
  const active = OCCASIONS.find((o) => o.key === params.get('for')) || OCCASIONS[0];

  return (
    <>
      <PageHero
        eyebrow="Gift shop"
        title="Gifts that keep growing"
        subtitle="Thoughtful plants for every occasion — gift wrapped, with a handwritten note and delivered to their door."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Gifts' }]}
        plants={['anthurium', 'peace-lily']}
      />

      {/* Perks */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ul className="grid grid-cols-2 gap-3 rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-4 md:p-4">
          {[
            [Gift, 'Gift wrap', `Kraft paper & twine · ${money(SITE.giftWrap.price)}`],
            [PenLine, 'Handwritten note', 'Your message, written by our team'],
            [Truck, 'No prices included', 'We leave them off the packing slip'],
            [Zap, 'Last-minute?', 'Express delivery in 1–2 business days'],
          ].map(([Icon, t, b]) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl p-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={19} strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs leading-snug text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Occasions */}
      <section className="container py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
              <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
              Shop by occasion
            </p>
            <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
              Who are you <em className="font-normal italic text-botanical">celebrating?</em>
            </h2>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Occasions">
          {OCCASIONS.map((o) => {
            const Icon = ICONS[o.icon] || Gift;
            const on = o.key === active.key;
            return (
              <li key={o.key}>
                <button
                  onClick={() => setParams({ for: o.key }, { replace: true })}
                  aria-pressed={on}
                  className={`group flex h-full w-full flex-col items-start rounded-[22px] p-4 text-left ring-1 transition duration-300 hover:-translate-y-1 ${
                    on ? 'bg-forest-900 text-white shadow-float ring-forest' : 'bg-white shadow-soft ring-line/70 hover:shadow-lift hover:ring-sage-soft'
                  }`}
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl transition ${on ? 'bg-white/10 text-sage-soft' : 'bg-mist text-forest group-hover:bg-forest group-hover:text-white'}`}>
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                  <span className={`mt-4 font-serif text-[17px] font-semibold ${on ? 'text-white' : 'text-ink'}`}>{o.label}</span>
                  <span className={`mt-0.5 text-[11px] ${on ? 'text-white/60' : 'text-muted'}`}>{o.picks.length} gift ideas</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mb-8 mt-12 flex flex-col gap-2 rounded-[24px] bg-mist/50 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-2xl text-ink">
              {active.label} <em className="italic text-botanical">gifts</em>
            </p>
            <p className="mt-1 text-sm text-muted">{active.blurb}</p>
          </div>
          {active.key === 'office' && (
            <Link to="/plant-styling#business" className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest">
              Ordering for a team? Talk to us <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        <ProductGrid key={active.key} products={active.picks} />
      </section>

      {/* Occasion reminders */}
      <section className="container pb-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:flex-row md:items-center md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
              <Bell size={20} />
            </span>
            <div>
              <p className="font-serif text-2xl text-ink">
                Never miss a <em className="italic text-botanical">special day</em>
              </p>
              <p className="mt-0.5 text-sm text-muted">Save birthdays and anniversaries — we’ll remind you a week before. Save 3 and earn 50 bonus leaves.</p>
            </div>
          </div>
          <Link to="/account/occasions" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            Save your dates <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Gift card + subscription */}
      <section className="container grid gap-5 pb-16 md:grid-cols-2 md:pb-24">
        <Link to="/gift-cards" className="group relative isolate flex flex-col justify-between overflow-hidden rounded-[32px] bg-forest-900 p-8 text-white shadow-float md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-botanical/50 blur-3xl" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sage-soft">
                <CreditCard size={14} /> Gift cards
              </p>
              <p className="mt-3 font-serif text-[30px] leading-tight text-white">
                Not sure what <em className="italic text-sage-soft">they’d like?</em>
              </p>
              <p className="mt-2 max-w-xs text-sm text-white/70">Send a digital gift card — emailed instantly or on the day you choose.</p>
            </div>
            <span className="hidden w-32 shrink-0 rotate-6 overflow-hidden rounded-xl shadow-float transition-transform duration-500 group-hover:rotate-0 sm:block">
              <GiftCardArt amount={50} design="sage" className="aspect-[1.6/1] w-full" />
            </span>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sage-soft">
            Choose a gift card <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <Link to="/subscription" className="group relative isolate flex flex-col justify-between overflow-hidden rounded-[32px] bg-white p-8 shadow-soft ring-1 ring-line/70 transition hover:shadow-lift md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-mist blur-3xl" />
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">
              <Gift size={14} /> The gift that keeps giving
            </p>
            <p className="mt-3 font-serif text-[30px] leading-tight text-ink">
              Gift a <em className="italic text-botanical">plant subscription</em>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">A new plant on their doorstep every month or season — they’ll think of you every time.</p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest">
            Explore subscriptions <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </>
  );
}
