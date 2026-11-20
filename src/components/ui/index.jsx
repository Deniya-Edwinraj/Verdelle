import { useEffect, useId, useRef, useState, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Info, Minus, Plus, Star, X } from 'lucide-react';
import { money } from '../../utils/format';
import { PageBannerScene } from '../art/scenes';
import logoNav from '../../assets/logo-verdelle-nav.png';
import logoFull from '../../assets/logo-verdelle.png';
import logoMark from '../../assets/logo-verdelle-mark.png';

export { money };

/** The "V" monogram on its own (no wordmark). */
export function LeafMark({ className = 'h-7 w-7', light = false }) {
  return <img src={logoMark} alt="" aria-hidden="true" className={`object-contain ${light ? 'brightness-0 invert' : ''} ${className}`} />;
}

/**
 * Verdelle logo.
 * - variant "nav": monogram + wordmark (header, mobile menu)
 * - variant "full": adds the "Plants • Pots • Plant care" tagline (footer)
 * - light: renders the logo in white for dark backgrounds
 */
export function Logo({ light = false, variant = 'nav', className = 'h-12' }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="Verdelle — home">
      <img
        src={variant === 'full' ? logoFull : logoNav}
        alt="Verdelle"
        width={variant === 'full' ? 559 : 289}
        height={variant === 'full' ? 360 : 200}
        className={`w-auto object-contain ${light ? 'brightness-0 invert' : ''} ${className}`}
      />
    </Link>
  );
}

export function RatingStars({ rating, count, size = 14, showValue = false, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-line" fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="text-[#E2A93B]" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-ink">{rating.toFixed(1)}</span>}
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}


export function Price({ price, original, className = '' }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-semibold text-ink">{money(price)}</span>
      {original && <span className="text-sm text-muted line-through">{money(original)}</span>}
    </span>
  );
}

export function SectionHeading({ title, eyebrow, action, align = 'center', className = '' }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end gap-4 ${align === 'center' && !action ? 'justify-center text-center' : 'justify-between'} ${className}`}>
      <div className={align === 'center' && !action ? 'mx-auto' : ''}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-[28px] md:text-[32px]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Breadcrumb({ items, light = false }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${light ? 'text-white/75' : 'text-muted'}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {it.to && i < items.length - 1 ? (
              <Link to={it.to} className={light ? 'hover:text-white hover:underline' : 'hover:text-forest hover:underline'}>
                {it.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className={light ? 'text-white' : 'text-ink'}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function QuantitySelector({ value, onChange, min = 1, max = 10, size = 'md', label = 'Quantity' }) {
  const h = size === 'sm' ? 'h-9' : 'h-11';
  return (
    <div className={`inline-flex ${h} items-center rounded-md border border-line bg-white`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid h-full w-9 place-items-center text-forest hover:bg-mist/60 disabled:opacity-40" aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid h-full w-9 place-items-center text-forest hover:bg-mist/60 disabled:opacity-40" aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'max-w-3xl' }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className={`relative max-h-[92vh] w-full ${size} animate-fade-up overflow-y-auto rounded-t-2xl bg-warm shadow-lift outline-none sm:rounded-2xl`}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink hover:bg-mist/60" aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3 className="font-sans text-base">
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-ink hover:text-forest"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {it.title}
                <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <div id={`${base}-${i}`} hidden={!isOpen} className="pb-5 text-sm leading-relaxed text-ink/80">
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      {Icon && (
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-card text-forest">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      <h2 className="mb-2 text-2xl">{title}</h2>
      {body && <p className="mb-6 text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="container py-16" aria-busy="true" aria-label="Loading page">
      <div className="mb-8 h-8 w-1/3 animate-pulse rounded bg-card" />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square animate-pulse rounded-card bg-card" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-card" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-card" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export const Field = forwardRef(function Field({ label, error, as = 'input', className = '', id, hint, ...props }, ref) {
  const auto = useId();
  const fid = id || auto;
  const Comp = as;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fid} className="label">
          {label}
        </label>
      )}
      <Comp
        id={fid}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
        className={`field ${error ? 'field-error' : ''} ${as === 'textarea' ? 'min-h-[140px] resize-y' : ''}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fid}-err`} className="mt-1 text-xs text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export function DemoNotice({ children, className = '' }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border border-sage-soft bg-mist/60 px-4 py-3 text-xs leading-relaxed text-forest ${className}`} role="note">
      <Info size={16} className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, crumbs, eyebrow }) {
  return (
    <section className="border-b border-line/70 bg-mist/50">
      <div className="container py-10 md:py-14">
        {crumbs && <Breadcrumb items={crumbs} />}
        {eyebrow && <p className="eyebrow mt-6">{eyebrow}</p>}
        <h1 className={`text-4xl md:text-5xl ${eyebrow ? 'mt-2' : 'mt-5'}`}>{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-[15px] text-muted">{subtitle}</p>}
      </div>
    </section>
  );
}

/** Splits a title so its final word can be set in an italic accent. */
function splitTitle(title) {
  if (typeof title !== 'string') return [title, null];
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title, null];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

/** Botanical photo hero used at the top of inner pages. */
export function PageHero({ title, subtitle, crumbs, eyebrow, plants, children }) {
  const [lead, accent] = splitTitle(title);
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-white">
      {/* Photo with a slow, subtle zoom */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 motion-safe:animate-slow-zoom">
        <PageBannerScene plants={plants} className="absolute inset-0 h-full w-full" />
      </div>
      {/* Layered tint: deep forest on the left, soft vignette top and bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, rgba(11,36,24,.92) 0%, rgba(11,36,24,.72) 38%, rgba(11,36,24,.25) 70%, rgba(11,36,24,.05) 100%), linear-gradient(180deg, rgba(11,36,24,.35) 0%, rgba(11,36,24,0) 30%, rgba(11,36,24,0) 70%, rgba(11,36,24,.45) 100%)',
        }}
      />
      {/* Soft sage glow behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-botanical/40 blur-3xl" />

      <div className="container relative flex min-h-[340px] flex-col justify-center pb-24 pt-12 md:min-h-[460px] md:pb-32 md:pt-16">
        {crumbs && (
          <div className="motion-safe:animate-fade-in">
            <div className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 backdrop-blur-md">
              <Breadcrumb items={crumbs} light />
            </div>
          </div>
        )}

        {eyebrow && (
          <p className="mt-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft motion-safe:animate-fade-up">
            <span aria-hidden="true" className="h-px w-10 bg-sage-soft/70" />
            {eyebrow}
          </p>
        )}

        <h1
          className={`max-w-2xl text-[40px] font-medium leading-[1.08] tracking-tight text-white motion-safe:animate-fade-up md:text-[64px] ${eyebrow ? 'mt-4' : 'mt-8'}`}
          style={{ animationDelay: '80ms' }}
        >
          {lead}
          {accent && (
            <>
              {' '}
              <em className="font-normal italic text-sage-soft">{accent}</em>
            </>
          )}
        </h1>

        {subtitle && (
          <p
            className="mt-6 max-w-lg border-l border-white/25 pl-5 text-[15px] leading-relaxed text-white/80 motion-safe:animate-fade-up md:text-base"
            style={{ animationDelay: '160ms' }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="motion-safe:animate-fade-up" style={{ animationDelay: '220ms' }}>
            {children}
          </div>
        )}
      </div>

      {/* Curved transition into the page */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-10 w-full text-warm md:h-16"
      >
        <path fill="currentColor" d="M0 80V40C240 8 480 0 720 0s480 8 720 40v40H0Z" />
      </svg>
    </section>
  );
}

export function PetBadge({ status, className = '' }) {
  const map = {
    safe: 'bg-mist text-forest',
    toxic: 'bg-[#F6E7DF] text-[#8A3B1E]',
    unknown: 'bg-card text-muted',
    na: 'bg-card text-muted',
  };
  const label = { safe: 'Pet-friendly', toxic: 'Toxic to pets', unknown: 'Pet safety: check before purchasing', na: 'Planter' }[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]} ${className}`}>{label}</span>;
}
