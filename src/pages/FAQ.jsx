import { Link } from 'react-router-dom';
import { Accordion, PageHero } from '../components/ui';
import { SITE } from '../data/site';
import { money } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';

const L = (to, t) => (
  <Link to={to} className="text-forest underline">
    {t}
  </Link>
);

const GROUPS = [
  {
    title: 'Orders & delivery',
    items: [
      ['How long does delivery take?', 'Standard delivery usually takes 3–5 business days and express 1–2 business days after dispatch. Plants are usually dispatched within 1–2 business days.'],
      ['Is delivery free?', `Standard delivery is free on orders over ${money(SITE.freeShippingThreshold)} after discounts.`],
      ['How are plants packed?', 'Soil is secured, leaves are supported and boxes are clearly marked as live plants. Packaging is recyclable wherever possible.'],
      ['Can I change or cancel my order?', <>Contact us as soon as possible via the {L('/contact', 'contact page')} — if it hasn’t been packed we’ll update it.</>],
    ],
  },
  {
    title: 'Plant care',
    items: [
      ['My plant looks droopy after delivery — is it okay?', 'A little stress after travel is normal. Unbox it, check the soil, water only if dry and keep it out of harsh sun for a few days.'],
      ['How often should I water?', <>It depends on light, season and pot. Our {L('/plant-care/watering-frequency', 'watering guide')} explains how to check before you water.</>],
      ['Which plants are best for beginners?', <>Browse our {L('/shop/easy-care', 'Easy-Care')} plants — ZZ, pothos and snake plants are great starters.</>],
      ['Do you sell pots with drainage?', <>Yes — all our {L('/shop/pots-and-planters', 'pots and planters')} have drainage holes.</>],
    ],
  },
  {
    title: 'Pets & safety',
    items: [
      ['Which plants are safe for cats and dogs?', <>See our {L('/shop/pet-friendly', 'Pet-Friendly')} category. We label plants using ASPCA toxic/non-toxic listings.</>],
      ['What does “Pet safety: check before purchasing” mean?', 'We don’t have confirmed toxicity data for that item, so please check with your vet first.'],
      ['My pet chewed a plant — what should I do?', 'Contact your vet or a pet poison helpline right away.'],
    ],
  },
  {
    title: 'Returns & account',
    items: [
      ['What if my plant arrives damaged?', <>Send us a photo within 7 days and we’ll arrange a replacement. See {L('/shipping-returns', 'Shipping & Returns')}.</>],
      ['Do I need an account?', 'No — guest checkout is available. In this demo store, accounts are stored only in your browser.'],
      ['Which discount codes work?', 'In this demo, try GREEN10 for 10% off or WELCOME5 for $5 off.'],
    ],
  },
];

export default function FAQ() {
  usePageMeta('FAQs', 'Answers about Verdelle delivery, plant care, pet safety and returns.');
  return (
    <>
      <PageHero title="Frequently Asked Questions" subtitle="Everything you need to know about ordering and caring for your plants." crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} plants={['spider', 'snake']} />
      <section className="container grid max-w-4xl gap-12 py-12 md:py-16">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h2 className="mb-4 text-2xl font-semibold">{g.title}</h2>
            <Accordion defaultOpen={-1} items={g.items.map(([title, content]) => ({ title, content: <p>{content}</p> }))} />
          </div>
        ))}
        <div className="rounded-2xl bg-mist/50 p-8 text-center">
          <h2 className="text-2xl font-semibold">Still have questions?</h2>
          <Link to="/contact" className="btn-primary mt-5">Contact us</Link>
        </div>
      </section>
    </>
  );
}
