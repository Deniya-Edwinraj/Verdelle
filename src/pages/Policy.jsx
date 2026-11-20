import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { PageHero } from '../components/ui';
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
      [`${SITE.guaranteeDays}-day plant guarantee`, [`If a plant arrives damaged, or struggles within ${SITE.guaranteeDays} days of delivery despite proper care, send us a photo and we’ll arrange a replacement or refund.`, 'Repotting a plant within the guarantee period may affect a claim — please contact us first.', 'Some leaf drop or droop after travel is normal and usually recovers within a week or two.']],
      ['Returns', ['Unused pots, planters and accessories can be returned within 30 days.', 'For hygiene and plant-health reasons, healthy live plants can’t be returned once delivered — but please contact us if you have a concern.']],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: `How ${SITE.name} collects, uses and protects your information when you browse, shop and grow with us.`,
    sections: [
      [
        'Who we are',
        [
          `${SITE.name} is an online plant shop selling indoor plants, pots, planters and plant-care supplies. In this policy, “we”, “us” and “our” mean ${SITE.name}, and “you” means anyone who visits our website or buys from us. If you have any questions about your privacy, email us at ${SITE.email}.`,
        ],
      ],
      [
        'Information we collect',
        [
          'Contact details — your name, email address, phone number and delivery and billing addresses.',
          'Order details — the plants and products you buy, delivery choices, discount codes used and your order history.',
          'Account details — your login email, saved addresses and wishlist, if you create an account.',
          'Messages — anything you send us through the contact form, email or social media, including photos of plants that arrived damaged.',
          'Technical details — basic device and browser information needed to keep the website working and secure.',
        ],
      ],
      [
        'Payment information',
        [
          'Card and payment details are entered directly with our payment provider and are processed securely by them. We never see or store your full card number.',
        ],
      ],
      [
        'How we use your information',
        [
          'To process, pack and deliver your orders, and to send order confirmations and delivery updates.',
          'To handle plant arrival claims, replacements, refunds and returns.',
          'To answer your questions and give plant-care support.',
          'To manage your account, wishlist and saved addresses.',
          'To send our newsletter, plant-care tips and offers — only if you have signed up, and you can unsubscribe at any time.',
          'To prevent fraud, keep our website secure and meet our legal and tax obligations.',
        ],
      ],
      [
        'Who we share it with',
        [
          'Delivery partners and couriers, so your plants reach the right door.',
          'Payment providers, to take payment securely.',
          'Email and customer-support services we use to send messages and answer questions.',
          'Website hosting and IT providers that keep our shop running.',
          'Authorities, where we are required to by law.',
          'We never sell your personal information or share it with others for their own marketing.',
        ],
      ],
      [
        'Cookies & browser storage',
        [
          'We use your browser’s storage to remember your cart, wishlist, recently viewed plants and sign-in, so the shop works the way you expect.',
          'We do not use advertising or cross-site tracking cookies. If we add analytics in the future, we will update this policy and ask for your consent where required.',
          'You can clear this information at any time from your browser settings, though your cart and wishlist will be emptied.',
        ],
      ],
      [
        'How long we keep it',
        [
          'We keep order and payment records for as long as the law requires for tax and accounting. Account information is kept until you close your account, and newsletter details until you unsubscribe. After that, we delete or anonymise your information.',
        ],
      ],
      [
        'Keeping your information safe',
        [
          'Our website uses a secure, encrypted connection, and we limit access to your information to the people and services who need it to look after your order. No system is completely secure, so please choose a strong password and keep it private.',
        ],
      ],
      [
        'Your rights & choices',
        [
          'Ask for a copy of the personal information we hold about you.',
          'Ask us to correct anything that is wrong or out of date.',
          'Ask us to delete your information, unless we need to keep it by law.',
          'Unsubscribe from marketing emails using the link in any email.',
          `To make a request, email ${SITE.email}. We will reply as soon as we can and within the time required by law.`,
        ],
      ],
      [
        'Children',
        [`Our shop is intended for adults. We do not knowingly collect personal information from children. If you believe a child has shared information with us, contact us and we will delete it.`],
      ],
      [
        'Changes to this policy',
        ['We may update this policy from time to time, for example when we add a new service. The latest version will always be on this page, and we will let you know about any significant changes.'],
      ],
      [
        'Contact us',
        [`Questions or requests about your privacy can be sent to ${SITE.email}, or by post to ${SITE.name}, ${SITE.address}.`],
      ],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: `The terms that apply when you browse our website or buy plants and products from ${SITE.name}.`,
    sections: [
      [
        'About these terms',
        [
          `These terms apply to your use of the ${SITE.name} website and to every order you place with us. By using our website or placing an order, you agree to them. Please also read our Privacy Policy and Shipping & Returns policy, which form part of these terms.`,
        ],
      ],
      [
        'Your account',
        [
          'You must be at least 18, or have permission from a parent or guardian, to place an order.',
          'Please keep your account details accurate and up to date.',
          'You are responsible for keeping your password private and for activity on your account.',
        ],
      ],
      [
        'Living plants',
        [
          'Every plant is unique. Size, shape, leaf count and colour may vary from the photos, which show a typical example.',
          'Plant heights are approximate and include the pot unless stated otherwise.',
          'A little leaf drop, droop or yellowing after travel is normal and usually recovers within a week or two in the right spot.',
          'Plants grow and change with the seasons, so availability may vary through the year.',
        ],
      ],
      [
        'Prices & payment',
        [
          `All prices are shown in ${SITE.currency.code} and include any taxes that apply unless stated otherwise. Delivery costs are shown at checkout before you pay. Payment is taken when you place your order. If a product is listed at the wrong price because of an error, we will contact you before dispatching it, and you can choose to continue at the correct price or cancel for a full refund.`,
        ],
      ],
      [
        'Orders',
        [
          'After you place an order, we send an email confirming that we have received it. Your order is accepted when we dispatch it.',
          'If a plant is out of stock or not up to our quality standards, we will offer a suitable alternative or a full refund.',
          'We may decline or cancel an order, for example if we suspect fraud or cannot deliver to your area, and we will refund any payment in full.',
        ],
      ],
      [
        'Discounts & promotions',
        [
          'Discount codes can be used once per order, cannot be combined unless stated, have no cash value and may have an expiry date or minimum spend.',
          `Sale prices, such as our ${SITE.saleName} promotion, apply only to products marked as on sale and only while the promotion runs.`,
        ],
      ],
      [
        'Delivery',
        [
          `We deliver to the addresses we offer at checkout. ${SITE.shipping.standard.label} costs ${money(SITE.shipping.standard.price)}, and it is free on orders over ${money(SITE.freeShippingThreshold)}. ${SITE.shipping.express.label} costs ${money(SITE.shipping.express.price)}. Delivery times are estimates, and we may hold live plants during extreme heat or cold to protect them. Please unpack your plants as soon as they arrive. Full details are in our Shipping & Returns policy.`,
        ],
      ],
      [
        'Arrival guarantee & returns',
        [
          `Every plant is covered by our ${SITE.guaranteeDays}-day guarantee. If it arrives damaged, or struggles within ${SITE.guaranteeDays} days of delivery despite proper care, send us a photo and we will arrange a replacement or refund.`,
          'Unused pots, planters and accessories can be returned within 30 days in their original condition.',
          'For plant-health reasons, healthy live plants cannot be returned once delivered.',
          'These terms do not affect your legal rights as a consumer.',
        ],
      ],
      [
        'Plant care & pet safety',
        [
          'Our care guides and product notes are general guidance only. Results depend on your light, temperature, watering and care.',
          'Plant-care advice is not professional horticultural or veterinary advice.',
          'Pet-safety labels are based on publicly available sources. Some plants are toxic if eaten, so keep plants out of reach of pets and children, and contact your vet or doctor straight away if one is swallowed.',
        ],
      ],
      [
        'Our content',
        [
          `The text, photos, logos, designs and care guides on this website belong to ${SITE.name} or are used with permission. You may not copy, reproduce or use them for commercial purposes without our written permission.`,
        ],
      ],
      [
        'Using our website',
        [
          'Use our website only for lawful purposes.',
          'Do not try to interfere with the website, its security or other customers’ accounts.',
          'Reviews and messages you send must be honest and must not be offensive or misleading.',
        ],
      ],
      [
        'Our responsibility to you',
        [
          'We take care to describe our plants accurately and to pack them so they arrive healthy. We are responsible for loss or damage that is a foreseeable result of us breaking these terms or failing to use reasonable care. We are not responsible for losses that were not foreseeable, for business losses, or for delays caused by events outside our control, such as extreme weather or courier disruption. Nothing in these terms limits liability that cannot be limited by law.',
        ],
      ],
      [
        'Changes to these terms',
        ['We may update these terms from time to time. The version on this page when you place an order is the one that applies to that order.'],
      ],
      [
        'Contact us',
        [`If you have any questions about these terms or your order, email ${SITE.email} or write to ${SITE.name}, ${SITE.address}.`],
      ],
    ],
  },
};

const LINKS = {
  shipping: { to: '/shipping-returns', icon: Truck, blurb: 'Delivery, arrival guarantee and returns.' },
  privacy: { to: '/privacy-policy', icon: ShieldCheck, blurb: 'How your information is handled.' },
  terms: { to: '/terms', icon: FileText, blurb: 'The rules for using this website.' },
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Policy({ page }) {
  const p = PAGES[page];
  usePageMeta(p.title, p.intro);
  const [active, setActive] = useState(0);
  const ids = p.sections.map(([h]) => slugify(h));

  useEffect(() => {
    setActive(0);
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index))),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const PageIcon = LINKS[page].icon;
  const others = Object.entries(LINKS).filter(([k]) => k !== page);

  return (
    <>
      <PageHero eyebrow="Legal & policies" title={p.title} subtitle={p.intro} crumbs={[{ label: 'Home', to: '/' }, { label: p.title }]} plants={['pothos', 'zz']} />

      <section className="container relative z-10 -mt-16 grid max-w-6xl gap-8 pb-16 md:-mt-24 md:pb-24 lg:grid-cols-[280px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[28px] bg-white/90 p-6 shadow-lift ring-1 ring-white/60 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white">
                <PageIcon size={19} strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">On this page</p>
                <p className="font-serif text-lg font-semibold leading-tight text-forest">{p.sections.length} sections</p>
              </div>
            </div>
            <ol className="mt-5 space-y-1 border-t border-line pt-4">
              {p.sections.map(([h], i) => (
                <li key={h}>
                  <a
                    href={`#${ids[i]}`}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      active === i ? 'bg-mist/70 font-medium text-forest' : 'text-ink/70 hover:bg-card hover:text-forest'
                    }`}
                  >
                    <span className={`mt-px font-serif text-xs italic ${active === i ? 'text-botanical' : 'text-sage'}`}>{String(i + 1).padStart(2, '0')}</span>
                    {h}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Content */}
        <div>
          <div className="space-y-4">
            {p.sections.map(([h, paras], i) => (
              <article
                key={h}
                id={ids[i]}
                data-index={i}
                className={`scroll-mt-28 rounded-[28px] bg-white p-6 ring-1 transition duration-500 md:p-8 ${active === i ? 'shadow-lift ring-sage-soft' : 'shadow-soft ring-line/70'}`}
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-serif text-lg italic transition duration-500 ${
                      active === i ? 'bg-forest text-white' : 'bg-mist text-forest'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <h2 className="text-[22px] font-semibold leading-snug tracking-tight md:text-2xl">{h}</h2>
                    {paras.length > 1 ? (
                      <ul className="mt-4 space-y-3">
                        {paras.map((t) => (
                          <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
                            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mist text-forest">
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{paras[0]}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>


          {/* Contact */}
          <div className="relative isolate mt-8 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-forest-900 p-7 text-white shadow-float sm:flex-row sm:items-center md:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-botanical/50 blur-3xl" />
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-sage-soft ring-1 ring-white/15">
                <MessageCircle size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-serif text-2xl leading-tight text-white">
                  Have a <em className="italic text-sage-soft">question?</em>
                </p>
                <p className="mt-1 text-sm text-white/70">We’re happy to help with anything on this page.</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-mist"
            >
              Contact us <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Related policies */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map(([k, l]) => {
              const Icon = l.icon;
              return (
                <Link
                  key={k}
                  to={l.to}
                  className="group flex items-center gap-4 rounded-[22px] bg-white p-4 pr-5 shadow-soft ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:shadow-lift hover:ring-sage-soft"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest transition group-hover:bg-forest group-hover:text-white">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-base font-semibold text-ink">{PAGES[k].title}</span>
                    <span className="block truncate text-xs text-muted">{l.blurb}</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-forest transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
