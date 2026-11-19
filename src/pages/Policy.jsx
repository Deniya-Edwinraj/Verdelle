import { Link } from 'react-router-dom';
import { DemoNotice, PageHero } from '../components/ui';
import { SITE } from '../data/site';
import { money } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';

const PAGES = {
  shipping: {
    title: 'Shipping & Returns',
    intro: 'How we get your plants to you safely — and what happens if something isn’t right.',
    sections: [
      ['Dispatch', ['Orders are usually packed and dispatched within 1–2 business days. We may hold live plants during extreme heat or cold to protect them.']],
      ['Delivery options', [`${SITE.shipping.standard.label}: ${money(SITE.shipping.standard.price)} — free on orders over ${money(SITE.freeShippingThreshold)}.`, `${SITE.shipping.express.label}: ${money(SITE.shipping.express.price)}.`, 'Delivery times are estimates.']],
      ['Live plant arrival guarantee', ['If a plant arrives damaged, send a photo within 7 days of delivery and we’ll arrange a replacement or refund.', 'Some leaf drop or droop after travel is normal and usually recovers within a week or two.']],
      ['Returns', ['Unused pots, planters and accessories can be returned within 30 days.', 'For hygiene and plant-health reasons, healthy live plants can’t be returned once delivered — but please contact us if you have a concern.']],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'How this demo storefront handles your information.',
    sections: [
      ['What this demo stores', ['Your cart, wishlist, recently viewed plants, demo profile, saved addresses and demo orders are stored in your browser’s localStorage only.', 'Passwords and payment card details are never collected or stored.']],
      ['Newsletter & contact forms', ['Form entries stay in this browser until an email provider or helpdesk is connected.']],
      ['Cookies & fonts', ['No tracking cookies are set. Fonts are bundled with the site.']],
      ['Your choices', ['Clear your browser’s site data at any time to remove everything stored by this demo.']],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'The terms that apply when you use this website.',
    sections: [
      ['Using this website', ['Plant-care content is general guidance and not professional horticultural or veterinary advice.']],
      ['Products & pricing', [`Prices are shown in ${SITE.currency.code}. Plants are natural products and may vary slightly in shape, size and colour from the reference photos shown.`]],
      ['Orders', ['Orders placed in this demo storefront are not fulfilled and no payment is taken.']],
      ['Promotions', [`The ${SITE.saleName} promotion is demo content and applies only to items marked as on sale.`]],
    ],
  },
};

export default function Policy({ page }) {
  const p = PAGES[page];
  usePageMeta(p.title, p.intro);
  return (
    <>
      <PageHero title={p.title} subtitle={p.intro} crumbs={[{ label: 'Home', to: '/' }, { label: p.title }]} plants={['pothos', 'zz']} />
      <section className="container max-w-3xl py-12 md:py-16">
        <DemoNotice className="mb-8">Template policy text for a demo store — have it reviewed and replaced with your real policies before launch.</DemoNotice>
        <div className="prose-gn">
          {p.sections.map(([h, paras]) => (
            <div key={h}>
              <h2>{h}</h2>
              {paras.length > 1 ? (
                <ul>{paras.map((t) => <li key={t}>{t}</li>)}</ul>
              ) : (
                <p>{paras[0]}</p>
              )}
            </div>
          ))}
          <p className="mt-10 text-sm text-muted">
            Questions? <Link to="/contact" className="text-forest underline">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
