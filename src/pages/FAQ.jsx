import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Mail, PackageSearch, PawPrint, Phone, Plus, RotateCcw, Search, SearchX, Sprout, Truck, X } from 'lucide-react';
import { PageHero } from '../components/ui';
import { SITE } from '../data/site';
import { money } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';

const L = (to, t) => (
  <Link to={to} className="font-medium text-forest underline decoration-sage/60 underline-offset-4 transition hover:decoration-forest">
    {t}
  </Link>
);

const GROUPS = [
  {
    key: 'orders',
    title: 'Orders & delivery',
    icon: Truck,
    items: [
      ['How long does delivery take?', `Plants are usually dispatched within 1–2 business days — orders placed before 2pm on a weekday often leave the same day. Standard delivery then takes 3–5 business days and express 1–2 business days. Each product page shows your estimated delivery dates.`],
      ['Is delivery free?', `Standard delivery is free on orders over ${money(SITE.freeShippingThreshold)} after discounts. Otherwise it’s ${money(SITE.shipping.standard.price)}, and express is ${money(SITE.shipping.express.price)}.`],
      ['How are plants packed?', 'Soil is secured, leaves are supported and boxes are clearly marked as live plants. We use recyclable boxes and paper padding wherever possible.'],
      ['How do I track my order?', <>Use the order number from your confirmation email on our {L('/track-order', 'Track Order')} page to see where your plants are, from packing to your door.</>],
      ['Can I send a plant as a gift?', `Yes — tick “This order is a gift” at checkout to add a message for the recipient. Gift wrap with a handwritten note is ${money(SITE.giftWrap.price)}.`],
      ['Can I change or cancel my order?', <>Contact us as soon as possible via the {L('/contact', 'contact page')} — if it hasn’t been packed yet, we’ll update or cancel it.</>],
    ],
  },
  {
    key: 'care',
    title: 'Plant care',
    icon: Sprout,
    items: [
      ['My plant looks droopy after delivery — is it okay?', 'A little stress after travel is normal. Unbox it straight away, check the soil, water only if it’s dry and keep it out of harsh sun for a few days while it settles.'],
      ['How often should I water?', <>It depends on light, season and pot. Our {L('/plant-care/watering-frequency', 'watering guide')} explains how to check the soil before you water — and every plant page can add a watering reminder to your calendar.</>],
      ['Which plants are best for beginners?', <>Try our {L('/plant-finder', 'Plant Finder')} for a personal match, or browse {L('/shop/easy-care', 'Easy-Care')} plants — ZZ, pothos and snake plants are great starters.</>],
      ['Do your pots have drainage?', <>Yes — all our {L('/shop/pots-and-planters', 'pots and planters')} have drainage holes to help prevent root rot.</>],
    ],
  },
  {
    key: 'pets',
    title: 'Pets & safety',
    icon: PawPrint,
    items: [
      ['Which plants are safe for cats and dogs?', <>See our {L('/shop/pet-friendly', 'Pet-Friendly')} collection. We label every plant using ASPCA toxic and non-toxic listings.</>],
      ['What does “Pet safety: check before purchasing” mean?', 'We don’t have confirmed toxicity data for that plant, so please check with your vet before bringing it home.'],
      ['My pet chewed a plant — what should I do?', 'Contact your vet or a pet poison helpline straight away, and keep the plant label handy so you can tell them exactly what it was.'],
    ],
  },
  {
    key: 'returns',
    title: 'Returns & account',
    icon: RotateCcw,
    items: [
      ['What if my plant arrives damaged or doesn’t settle in?', <>Every plant comes with our {SITE.guaranteeDays}-day guarantee. If it arrives damaged or struggles within {SITE.guaranteeDays} days of delivery despite proper care, send us a photo and we’ll replace it or refund you. See {L('/shipping-returns', 'Shipping & Returns')} for details.</>],
      ['Can I return a pot or planter?', 'Yes — unused pots, planters and accessories can be returned within 30 days in their original condition.'],
      ['A plant I want is sold out — can I be notified?', 'Yes. Open the plant’s page and leave your email under “Notify me when it’s back” — we’ll let you know as soon as healthy new stock is ready.'],
      ['Do I need an account?', 'No — guest checkout is available. An account lets you save addresses, see past orders and keep a wishlist.'],
      ['Do you have any discount codes?', 'Join our newsletter for $5 off your first order, plus seasonal offers and care tips straight to your inbox.'],
    ],
  },
];

function FaqItem({ q, a, open, onToggle, index }) {
  const id = useId();
  return (
    <li className={`overflow-hidden rounded-[22px] ring-1 transition duration-300 ${open ? 'bg-white shadow-lift ring-sage-soft' : 'bg-white/70 shadow-soft ring-line/70 hover:bg-white'}`}>
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id} className="group flex w-full items-center gap-4 p-5 text-left md:p-6">
          <span className={`hidden font-serif text-sm italic sm:block ${open ? 'text-botanical' : 'text-sage'}`}>{String(index + 1).padStart(2, '0')}</span>
          <span className={`flex-1 text-[15px] font-semibold leading-snug transition-colors md:text-base ${open ? 'text-forest' : 'text-ink group-hover:text-forest'}`}>{q}</span>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-300 ${open ? 'rotate-45 bg-forest text-white' : 'bg-mist text-forest group-hover:bg-forest group-hover:text-white'}`}
            aria-hidden="true"
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className={`overflow-hidden ${open ? '' : 'invisible'}`}>
          <p className="px-5 pb-6 text-[15px] leading-relaxed text-ink/75 sm:pl-[60px] md:px-6 md:pl-[64px]">{a}</p>
        </div>
      </div>
    </li>
  );
}

export default function FAQ() {
  usePageMeta('FAQs', 'Answers about Verdelle delivery, plant care, pet safety, gifts and returns.');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');
  const [open, setOpen] = useState('orders-0');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUPS.filter((g) => active === 'all' || g.key === active)
      .map((g) => ({
        ...g,
        items: g.items.map((it, i) => ({ q: it[0], a: it[1], i })).filter((it) => !q || it.q.toLowerCase().includes(q) || (typeof it.a === 'string' && it.a.toLowerCase().includes(q))),
      }))
      .filter((g) => g.items.length);
  }, [query, active]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about ordering, gifting and caring for your plants."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
        plants={['spider', 'snake']}
      />

      {/* Search */}
      <section className="container relative z-10 -mt-16 max-w-4xl md:-mt-24">
        <div className="rounded-[28px] bg-white/90 p-3 shadow-lift ring-1 ring-white/60 backdrop-blur-xl sm:p-4">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <div className="flex h-14 items-center gap-3 rounded-full bg-card/70 px-5 ring-1 ring-line/70 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-botanical/40">
            <Search size={19} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search delivery, watering, pets, gifts…"
              className="h-full min-w-0 flex-1 bg-transparent font-serif text-lg text-ink outline-none placeholder:italic placeholder:text-muted/60"
            />
            {query && (
              <button onClick={() => setQuery('')} className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-forest" aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
          <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-1" aria-label="Filter by topic">
            {[{ key: 'all', title: 'All topics', icon: null, count: GROUPS.reduce((n, g) => n + g.items.length, 0) }, ...GROUPS.map((g) => ({ ...g, count: g.items.length }))].map(({ key, title, icon: Icon, count }) => (
              <li key={key}>
                <button
                  onClick={() => setActive(key)}
                  aria-pressed={active === key}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${active === key ? 'bg-forest text-white shadow-soft' : 'text-ink/75 hover:bg-mist/70 hover:text-forest'}`}
                >
                  {Icon && <Icon size={15} />}
                  {title}
                  <span className={`rounded-full px-1.5 text-[10px] font-semibold ${active === key ? 'bg-white/20' : 'bg-card'}`}>{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Questions */}
      <section className="container max-w-4xl py-14 md:py-20">
        {query && (
          <p className="mb-6 text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-ink">{total}</span> {total === 1 ? 'answer' : 'answers'} for “{query}”
          </p>
        )}

        {groups.length ? (
          <div className="space-y-14">
            {groups.map(({ key, title, icon: Icon, items }) => (
              <div key={key}>
                <div className="mb-5 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-white shadow-soft">
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-botanical">
                      {items.length} {items.length === 1 ? 'question' : 'questions'}
                    </p>
                    <h2 className="text-[26px] font-medium leading-tight tracking-tight md:text-[30px]">{title}</h2>
                  </div>
                </div>
                <ul className="space-y-3">
                  {items.map((it, n) => {
                    const id = `${key}-${it.i}`;
                    return <FaqItem key={id} q={it.q} a={it.a} index={n} open={open === id || !!query.trim()} onToggle={() => setOpen(open === id ? null : id)} />;
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-14 text-center ring-1 ring-line/70">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mist text-forest">
              <SearchX size={26} strokeWidth={1.6} />
            </span>
            <p className="mt-5 font-serif text-2xl text-ink">
              No answers for <em className="italic text-botanical">“{query}”</em>
            </p>
            <p className="mt-2 text-sm text-muted">Try another word, or ask us directly — we’re happy to help.</p>
            <button onClick={() => { setQuery(''); setActive('all'); }} className="mt-6 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-forest transition hover:border-forest">
              Show all questions
            </button>
          </div>
        )}

        {/* Quick links */}
        <ul className="mt-16 grid gap-3 sm:grid-cols-3">
          {[
            [PackageSearch, 'Track an order', 'See where your plants are', '/track-order'],
            [Compass, 'Plant Finder', 'Find your perfect match', '/plant-finder'],
            [RotateCcw, 'Shipping & returns', 'Our arrival guarantee', '/shipping-returns'],
          ].map(([Icon, t, b, to]) => (
            <li key={t}>
              <Link to={to} className="group flex h-full items-center gap-3 rounded-[22px] bg-white p-4 shadow-soft ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:shadow-lift hover:ring-sage-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest transition group-hover:bg-forest group-hover:text-white">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{t}</span>
                  <span className="block truncate text-xs text-muted">{b}</span>
                </span>
                <ArrowRight size={15} className="shrink-0 text-forest transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact */}
        <div className="relative isolate mt-6 overflow-hidden rounded-[32px] bg-forest-900 p-8 text-white shadow-float md:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-botanical/50 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft">
                <span aria-hidden="true" className="h-px w-10 bg-sage-soft/60" />
                We’re here to help
              </p>
              <h2 className="mt-4 text-[30px] font-medium leading-tight tracking-tight text-white md:text-[40px]">
                Still have <em className="font-normal italic text-sage-soft">questions?</em>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">Our plant team answers every message personally — usually within one business day. {SITE.hours}.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20">
                  <Mail size={14} className="text-sage-soft" /> {SITE.email}
                </a>
                <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20">
                  <Phone size={14} className="text-sage-soft" /> {SITE.phone}
                </a>
              </div>
            </div>
            <Link to="/contact" className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-mist">
              Contact us <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
