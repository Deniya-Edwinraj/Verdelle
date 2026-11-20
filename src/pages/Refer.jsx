import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Copy, Gift, Leaf, Mail, Share2, ShoppingBag, UserPlus, Users } from 'lucide-react';
import { PageHero } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { REWARDS } from '../data/services';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const FRIEND_CODE = 'FRIEND10';
const REFERRER_LEAVES = 100;

/** A short, stable referral code for a member, e.g. ALEX-4821. */
export function referralCode(user) {
  if (!user) return null;
  let h = 0;
  for (const c of user.email) h = (h * 31 + c.charCodeAt(0)) % 9000;
  return `${(user.firstName || 'FRIEND').replace(/[^a-z]/gi, '').slice(0, 6).toUpperCase() || 'FRIEND'}-${1000 + h}`;
}

export default function Refer() {
  usePageMeta('Refer a Friend', `Give friends $10 off their first Verdelle order and earn ${REFERRER_LEAVES} leaves when they shop.`);
  const { user } = useAuth();
  const cart = useCart();
  const notify = useToast();
  const [params] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const ref = params.get('ref');
  const code = referralCode(user);
  const link = code ? `${window.location.origin}/refer?ref=${code}` : '';
  const offer = SITE.coupons[FRIEND_CODE];
  const shareText = `I love my plants from ${SITE.name} 🌿 Here’s $10 off your first order:`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: `${SITE.name} — $10 off`, text: shareText, url: link });
      else copy();
    } catch {
      /* cancelled */
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Refer a friend"
        title="Share the plant love"
        subtitle={`Give your friends ${offer ? `$${offer.value}` : '$10'} off their first order — and earn ${REFERRER_LEAVES} ${REWARDS.name} when they shop.`}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Refer a friend' }]}
        plants={['pothos', 'peace-lily']}
      />

      <section className="container relative z-10 -mt-16 max-w-4xl pb-16 md:-mt-24 md:pb-24">
        {/* Friend landing */}
        {ref && (
          <div className="relative isolate mb-6 overflow-hidden rounded-[28px] bg-forest-900 p-6 text-white shadow-float md:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-botanical/50 blur-3xl" />
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-sage-soft">
                  <Gift size={24} />
                </span>
                <div>
                  <p className="font-serif text-2xl text-white">
                    A friend sent you <em className="italic text-sage-soft">$10 off</em>
                  </p>
                  <p className="text-sm text-white/70">Use code {FRIEND_CODE} on your first order.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  cart.applyCoupon(FRIEND_CODE);
                  notify('$10 off applied to your cart');
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-mist"
              >
                <Check size={15} /> Apply to my cart
              </button>
            </div>
          </div>
        )}

        {/* Share card */}
        <div className="rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-line/70 md:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Gift, 'They get', `$${offer?.value || 10} off`, 'their first order over $40'],
              [Leaf, 'You get', `${REFERRER_LEAVES} leaves`, `worth $5 in ${REWARDS.name}`],
            ].map(([Icon, k, v, b]) => (
              <div key={k} className="flex items-center gap-4 rounded-[22px] bg-mist/50 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-white">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">{k}</span>
                  <span className="block font-serif text-[26px] font-semibold leading-tight text-forest">{v}</span>
                  <span className="block text-xs text-muted">{b}</span>
                </span>
              </div>
            ))}
          </div>

          {user ? (
            <div className="mt-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">Your personal link</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-12 min-w-0 flex-1 items-center rounded-full bg-card/70 px-5 ring-1 ring-line/70">
                  <span className="truncate text-sm text-ink">{link}</span>
                </div>
                <button onClick={copy} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-botanical">
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${link}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <Share2 size={14} /> WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`$10 off at ${SITE.name}`)}&body=${encodeURIComponent(`${shareText} ${link}`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest"
                >
                  <Mail size={14} /> Email
                </a>
                <button onClick={share} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest">
                  <Share2 size={14} /> More options
                </button>
              </div>
              <p className="mt-6 flex items-center gap-2 rounded-2xl bg-card/60 px-4 py-3 text-sm text-muted">
                <Users size={15} className="text-botanical" /> Your code <strong className="text-ink">{code}</strong> — leaves are added once a friend’s first order ships.
              </p>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-[22px] border-2 border-dashed border-line p-8 text-center">
              <p className="font-serif text-2xl text-ink">
                Sign in to get your <em className="italic text-botanical">referral link</em>
              </p>
              <p className="mt-1 text-sm text-muted">It only takes a minute — and you’ll get {REWARDS.welcome} welcome leaves too.</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
                  <UserPlus size={15} /> Create account
                </Link>
                <Link to="/login" state={{ from: '/refer' }} className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest">
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            [Share2, 'Share your link', 'Send it by WhatsApp, email or anywhere you like.'],
            [ShoppingBag, 'They save $10', 'Your friend gets $10 off their first order over $40.'],
            [Leaf, `You earn ${REFERRER_LEAVES} leaves`, 'Added to your rewards when their order ships.'],
          ].map(([Icon, t, b], i) => (
            <li key={t} className="relative rounded-[22px] bg-white p-5 shadow-soft ring-1 ring-line/70">
              <span className="absolute right-5 top-5 font-serif text-2xl italic text-sage-soft">0{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={18} />
              </span>
              <p className="mt-4 font-semibold text-ink">{t}</p>
              <p className="mt-1 text-sm text-muted">{b}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-xs text-muted">
          Friend discount valid on first orders over $40. See our{' '}
          <Link to="/terms" className="underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/rewards" className="underline">
            rewards programme
          </Link>
          .
        </p>
        <div className="mt-8 text-center">
          <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold text-forest">
            Keep shopping <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
