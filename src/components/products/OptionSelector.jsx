import { useId } from 'react';
import { Check } from 'lucide-react';
import { money } from '../ui';

/** Card-style radio group used for plant size and pot choice. */
export default function OptionSelector({ legend, options, value, onChange, priceMode = 'absolute' }) {
  const name = useId();
  const cols = options.length >= 3 ? 'grid-cols-3' : options.length === 2 ? 'grid-cols-2' : 'grid-cols-1';
  return (
    <fieldset>
      <legend className="mb-2.5 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70">
        {legend}
        <span className="font-normal normal-case tracking-normal text-muted">{value}</span>
      </legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => {
          const active = o.label === value;
          return (
            <label
              key={o.label}
              className={`relative flex cursor-pointer flex-col rounded-2xl p-3 text-left ring-1 transition focus-within:ring-2 focus-within:ring-botanical/50 ${
                active ? 'bg-forest text-white shadow-soft ring-forest' : 'bg-white text-ink ring-line/80 hover:ring-sage'
              }`}
            >
              <input type="radio" name={name} value={o.label} checked={active} onChange={() => onChange(o.label)} className="sr-only" />
              {active && (
                <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-white/20">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
              <span className="pr-6 text-sm font-semibold leading-tight">{o.label}</span>
              {o.detail && <span className={`mt-1 text-[11px] leading-snug ${active ? 'text-white/70' : 'text-muted'}`}>{o.detail}</span>}
              <span className={`mt-1.5 text-xs font-medium ${active ? 'text-sage-soft' : 'text-forest'}`}>
                {priceMode === 'addon' ? (o.price ? `+${money(o.price)}` : 'Included') : money(o.price)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
