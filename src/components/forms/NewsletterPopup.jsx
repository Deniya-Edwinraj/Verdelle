import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Check, Copy, Gift, Mail, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { SITE } from '../../data/site';
import { FramedPlant } from '../art/scenes';

const CODE = 'WELCOME5';
const DELAY_MS = 12000;
const HIDDEN_ON = ['/checkout', '/order-success', '/login', '/register'];

/** First-visit newsletter pop-up offering the WELCOME5 code. Shown once per browser. */
export default function NewsletterPopup() {
  const [seen, setSeen] = useLocalStorage('gn_popup_seen', false);
  const [subs, setSubs] = useLocalStorage('gn_newsletter', []);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const { pathname } = useLocation();
  const cart = useCart();
  const { cookieConsent, cookieOpen } = useUI();
  const offer = SITE.coupons[CODE];

  useEffect(() => {
    // Wait until the visitor has answered the cookie notice, so the two never stack.
    if (seen || !offer || !cookieConsent || cookieOpen) return undefined;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [seen, offer, cookieConsent, cookieOpen]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && dismiss();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open || HIDDEN_ON.includes(pathname)) return null;

  function dismiss() {
    setOpen(false);
    setSeen(true);
  }

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError('Please enter a valid email address');
    setError('');
    if (!subs.includes(v)) setSubs([...subs, v]);
    setDone(true);
    setSeen(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="nl-popup-title">
      <div className="absolute inset-0 animate-fade-in bg-forest-900/45 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative grid w-full max-w-3xl animate-fade-up overflow-hidden rounded-[32px] bg-warm shadow-[0_40px_80px_-20px_rgba(11,36,24,0.6)] md:grid-cols-[1fr_1.1fr]">
        {/* Visual */}
        <div className="relative hidden min-h-[420px] md:block">
          <FramedPlant species="monstera" pot="basket" seed="nl-popup" className="absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/10 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/15 p-4 text-white ring-1 ring-white/25 backdrop-blur-md">
            <p className="font-serif text-4xl font-semibold leading-none">{offer.type === 'percent' ? `${offer.value}%` : `$${offer.value}`} off</p>
            <p className="mt-1 text-xs text-white/80">your first order</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-7 sm:p-10">
          <button onClick={dismiss} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-card text-forest transition hover:rotate-90 hover:bg-forest hover:text-white" aria-label="Close">
            <X size={16} />
          </button>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-forest">
            <Gift size={22} strokeWidth={1.6} />
          </span>

          {!done ? (
            <>
              <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
                <span aria-hidden="true" className="h-px w-8 bg-botanical/60" />
                Welcome to {SITE.name}
              </p>
              <h2 id="nl-popup-title" className="mt-3 text-[30px] font-medium leading-[1.1] tracking-tight md:text-[34px]">
                A little gift for your <em className="font-normal italic text-botanical">first plant</em>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">Join our newsletter for {offer.label.toLowerCase()}, plus seasonal care tips and first look at new arrivals.</p>
              <form onSubmit={submit} noValidate className="mt-6">
                <label htmlFor="nl-popup-email" className="sr-only">
                  Email address
                </label>
                <div className={`flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 ring-1 transition focus-within:ring-2 ${error ? 'ring-red-700/50' : 'ring-line focus-within:ring-botanical/40'}`}>
                  <Mail size={16} className="shrink-0 text-muted" aria-hidden="true" />
                  <input
                    id="nl-popup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    autoComplete="email"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'nl-popup-err' : undefined}
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                  <button className="group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-botanical">
                    Get code <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
                {error && (
                  <p id="nl-popup-err" className="mt-2 pl-4 text-xs text-red-800" role="alert">
                    {error}
                  </p>
                )}
              </form>
              <button onClick={dismiss} className="mt-4 text-xs text-muted underline-offset-4 hover:text-forest hover:underline">
                No thanks, I’ll pay full price
              </button>
            </>
          ) : (
            <>
              <h2 id="nl-popup-title" className="mt-6 text-[30px] font-medium leading-[1.1] tracking-tight">
                You’re <em className="font-normal italic text-botanical">in!</em>
              </h2>
              <p className="mt-3 text-sm text-muted">Here’s your code for {offer.label.toLowerCase()}.</p>
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-sage bg-white px-5 py-4">
                <span className="font-serif text-2xl font-semibold tracking-[0.15em] text-forest">{CODE}</span>
                <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3.5 py-2 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white">
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <button
                onClick={() => {
                  cart.applyCoupon(CODE);
                  setOpen(false);
                }}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white transition hover:bg-botanical"
              >
                Apply to my cart & keep shopping
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
