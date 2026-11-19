import { useId } from 'react';
import { money } from '../ui';

/** Radio-group pill selector used for plant size and pot choice. */
export default function OptionSelector({ legend, options, value, onChange, priceMode = 'absolute' }) {
  const name = useId();
  const current = options.find((o) => o.label === value);
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">
        {legend}: <span className="font-normal text-muted">{value}{current?.detail ? ` · ${current.detail}` : ''}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.label === value;
          return (
            <label
              key={o.label}
              className={`cursor-pointer rounded-md border px-3.5 py-2 text-sm transition focus-within:ring-2 focus-within:ring-botanical/40 ${active ? 'border-forest bg-forest text-white' : 'border-line bg-white text-ink hover:border-forest'}`}
            >
              <input type="radio" name={name} value={o.label} checked={active} onChange={() => onChange(o.label)} className="sr-only" />
              {o.label}
              <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-muted'}`}>
                {priceMode === 'addon' ? (o.price ? `+${money(o.price)}` : 'included') : money(o.price)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
