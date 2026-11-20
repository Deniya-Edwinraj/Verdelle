import { useEffect, useState } from 'react';
import { CalendarClock, Ruler, X } from 'lucide-react';
import { SITE } from '../../data/site';
import { money } from '../ui';

/** "or 4 interest-free payments of $X" message, shown above the pay-in-4 minimum. */
export function PayIn4({ amount, className = '' }) {
  const { installments, min } = SITE.payIn4;
  if (!amount || amount < min) return null;
  return (
    <p className={`flex items-center gap-2 text-xs text-muted ${className}`}>
      <CalendarClock size={14} className="shrink-0 text-botanical" />
      <span>
        or <strong className="text-ink">{installments} interest-free payments</strong> of <strong className="text-ink">{money(amount / installments)}</strong> at checkout
      </span>
    </p>
  );
}

/** Parses "40–60 cm tall" style details into a [min, max] height in cm. */
function heightOf(detail = '') {
  const m = detail.match(/(\d+)\s*[–-]\s*(\d+)\s*cm tall/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/** Visual size guide: each available size drawn next to a 170 cm person. */
export function SizeGuide({ product }) {
  const [open, setOpen] = useState(false);
  const sizes = product.sizes.map((s) => ({ ...s, h: heightOf(s.detail) })).filter((s) => s.h);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!sizes.length) return null;
  const H = 200; // chart height in cm
  const y = (cm) => 230 - (cm / H) * 210;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-botanical underline-offset-4 hover:underline">
        <Ruler size={13} /> Size guide
      </button>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
          <div className="absolute inset-0 animate-fade-in bg-forest-900/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl animate-fade-up rounded-[28px] bg-warm p-6 shadow-[0_40px_80px_-20px_rgba(11,36,24,0.55)] md:p-8">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-card text-forest transition hover:rotate-90 hover:bg-forest hover:text-white" aria-label="Close size guide">
              <X size={16} />
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-botanical">Size guide</p>
            <h2 id="size-guide-title" className="mt-1 text-[26px] font-medium tracking-tight">
              How big is <em className="font-normal italic text-botanical">{product.name}?</em>
            </h2>
            <p className="mt-1 text-sm text-muted">Heights include the pot and are approximate — every plant is unique.</p>

            <svg viewBox="0 0 520 250" className="mt-6 w-full" role="img" aria-label={`Size comparison of ${product.name} sizes next to a 170 cm person`}>
              {[0, 50, 100, 150, 200].map((cm) => (
                <g key={cm}>
                  <line x1="40" x2="510" y1={y(cm)} y2={y(cm)} stroke="#E1E5DF" strokeDasharray={cm ? '3 4' : '0'} />
                  <text x="32" y={y(cm) + 3} textAnchor="end" fontSize="9" fill="#5F6B63">
                    {cm} cm
                  </text>
                </g>
              ))}
              {/* person */}
              <g fill="#B7C8B5">
                <circle cx="95" cy={y(170) + 11} r="11" />
                <rect x="80" y={y(170) + 25} width="30" height={y(85) - y(170) - 25} rx="12" />
                <rect x="82" y={y(85)} width="11" height={y(0) - y(85)} rx="5" />
                <rect x="97" y={y(85)} width="11" height={y(0) - y(85)} rx="5" />
              </g>
              <text x="95" y={y(0) + 14} textAnchor="middle" fontSize="9" fill="#5F6B63">
                170 cm
              </text>
              {/* plants */}
              {sizes.map((s, i) => {
                const cx = sizes.length === 1 ? 330 : 210 + i * (250 / (sizes.length - 1));
                const top = y(s.h[1]);
                const mid = y((s.h[0] + s.h[1]) / 2);
                const potH = Math.max(14, (y(0) - top) * 0.28);
                const w = 26 + i * 12;
                return (
                  <g key={s.label}>
                    <rect x={cx - w / 2} y={y(0) - potH} width={w} height={potH} rx="4" fill="#C98A62" />
                    <ellipse cx={cx} cy={(top + y(0) - potH) / 2} rx={w * 0.9} ry={(y(0) - potH - top) / 2} fill="#2F6245" opacity=".9" />
                    <line x1={cx + w + 6} x2={cx + w + 6} y1={top} y2={mid} stroke="#8FA88F" strokeDasharray="2 3" />
                    <text x={cx} y={y(0) + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#173F2D">
                      {s.label}
                    </text>
                    <text x={cx} y={top - 6} textAnchor="middle" fontSize="9" fill="#5F6B63">
                      {s.h[0]}–{s.h[1]} cm
                    </text>
                  </g>
                );
              })}
            </svg>

            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {product.sizes.map((s) => (
                <li key={s.label} className="rounded-2xl bg-white p-3 ring-1 ring-line/70">
                  <p className="text-sm font-semibold text-ink">{s.label}</p>
                  <p className="text-xs text-muted">{s.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
