import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Cookie } from 'lucide-react';
import { useUI } from '../../context/UIContext';

/**
 * Cookie consent card, pinned to the bottom-left corner. Appears on every page load until the
 * visitor chooses "I agree" or "No thanks"; can be reopened from "Cookie settings" in the footer.
 * The choice is stored in localStorage as `gn_cookie_consent` ('accepted' | 'declined').
 * Only load analytics or marketing scripts when the value is 'accepted'.
 */
export default function CookieConsent() {
  const { cookieConsent, setCookieConsent, cookieOpen, setCookieOpen } = useUI();
  const agreeRef = useRef(null);
  const visible = cookieConsent === null || cookieOpen;

  useEffect(() => {
    if (!cookieOpen) return undefined;
    const t = setTimeout(() => agreeRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, [cookieOpen]);

  if (!visible) return null;

  const choose = (value) => {
    setCookieConsent(value);
    setCookieOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      className="fixed bottom-3 left-3 right-3 z-[90] animate-fade-up sm:bottom-6 sm:left-6 sm:right-auto sm:w-[400px]"
      style={{ animationDelay: '250ms' }}
    >
      <div className="relative overflow-hidden rounded-[26px] bg-warm shadow-[0_30px_60px_-18px_rgba(11,36,24,0.5)] ring-1 ring-line/70">
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-mist blur-3xl" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-white shadow-soft">
              <Cookie size={22} strokeWidth={1.6} />
              <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sage-soft ring-2 ring-warm" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-botanical">Your privacy</p>
              <h2 id="cookie-title" className="mt-0.5 text-[22px] font-medium leading-tight tracking-tight">
                We value your <em className="font-normal italic text-botanical">privacy</em>
              </h2>
            </div>
          </div>

          <p id="cookie-body" className="mt-3 text-[13px] leading-relaxed text-ink/75">
            We use cookies to keep your cart and wishlist working and, with your permission, to understand how our site is used so we can make it better.{' '}
            <Link to="/privacy-policy" onClick={() => setCookieOpen(false)} className="font-medium text-botanical underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => choose('declined')}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-white text-sm font-semibold text-forest transition hover:border-forest"
            >
              No thanks
            </button>
            <button
              ref={agreeRef}
              type="button"
              onClick={() => choose('accepted')}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:bg-botanical hover:shadow-lift"
            >
              <Check size={15} className="transition-transform group-hover:scale-110" /> I agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
