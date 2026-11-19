import { Link } from 'react-router-dom';
import { Lock, Mail, Phone } from 'lucide-react';
import { Logo } from '../ui';
import SocialLinks from './SocialLinks';
import NewsletterForm from '../forms/NewsletterForm';
import { LeafyInteriorScene } from '../art/scenes';
import { SITE } from '../../data/site';

const COLS = [
  {
    title: 'Site Map',
    links: [
      ['Homepage', '/'],
      ['Shop all plants', '/shop'],
      ['Collections', '/collections'],
      ['Plant Care', '/plant-care'],
      ['GreenVibe Blog', '/blog'],
      ['About Us', '/about'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Customer Care',
    links: [
      ['My account', '/account'],
      ['Wishlist', '/wishlist'],
      ['Shipping & Returns', '/shipping-returns'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', '/privacy-policy'],
      ['Terms of Service', '/terms'],
      ['Photo Credits', '/photo-credits'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-900 text-white">
      <LeafyInteriorScene variant="footer" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/85 via-forest-900/55 to-forest-900/30" />
      <div className="container relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-y-8 lg:py-16">
        <div className="lg:row-span-2">
          <Logo light variant="full" className="h-24" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
            Helping you create a greener, calmer space — delivering hand-picked indoor plants with care and expertise.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-white/80">
            <li>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail size={15} aria-hidden="true" /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Phone size={15} aria-hidden="true" /> {SITE.phone}
              </a>
            </li>
          </ul>
          <SocialLinks className="mt-6" light />
        </div>
        {COLS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={i === 0 ? 'lg:row-span-2' : ''}>
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">{c.title}</h2>
            <ul className="space-y-2.5">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/75 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <section aria-labelledby="footer-nl-title" className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm md:col-span-2 lg:self-start">
          <h2 id="footer-nl-title" className="font-serif text-xl text-white">Join our newsletter</h2>
          <p className="mt-1.5 text-sm text-white/75">Care tips, new arrivals and members-only offers — straight to your inbox.</p>
          <div className="mt-4">
            <NewsletterForm variant="footer" />
          </div>
        </section>
      </div>
      <div className="relative border-t border-white/15">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/70 md:flex-row">
          <p>© {new Date().getFullYear()} Verdelle. All rights reserved. Demo storefront.</p>
          <div className="flex flex-col items-center gap-1.5 md:items-end">
            <p className="inline-flex items-center gap-1.5">
              <Lock size={12} /> Secure checkout · Prices in {SITE.currency.code}
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white/55">
              <span>Web solution by Deniya Edwinraj</span>
              <span aria-hidden="true">•</span>
              <a href="mailto:deniya.workspace@gmail.com" className="inline-flex items-center gap-1.5 transition hover:text-white">
                <Mail size={12} aria-hidden="true" /> deniya.workspace@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
