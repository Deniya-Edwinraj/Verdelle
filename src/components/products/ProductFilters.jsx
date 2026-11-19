import { PLANT_TYPES, LIGHT, WATERING, DIFFICULTY, SIZES } from '../../data/products';
import { money } from '../ui';

export const MAX_PRICE = 140;
export const EMPTY_FILTERS = { types: [], maxPrice: MAX_PRICE, sizes: [], light: [], watering: [], difficulty: [], petSafe: false, inStock: false };

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="float-left mb-3 w-full text-sm font-semibold text-ink">{title}</legend>
      <div className="clear-both" />
      {children}
    </fieldset>
  );
}

function Check({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink/85 hover:text-forest">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-line" />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs text-muted">{count}</span>}
    </label>
  );
}

export default function ProductFilters({ filters, setFilters, counts }) {
  const toggle = (key, val) => setFilters((f) => ({ ...f, [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] }));
  const multi = (title, key, opts) => (
    <Group title={title}>
      {opts.map((o) => (
        <Check key={o} label={o} checked={filters[key].includes(o)} onChange={() => toggle(key, o)} count={key === 'types' ? counts?.[o] : undefined} />
      ))}
    </Group>
  );

  return (
    <div>
      <Group title="Quick filters">
        <Check label="Pet-friendly only" checked={filters.petSafe} onChange={() => setFilters((f) => ({ ...f, petSafe: !f.petSafe }))} />
        <Check label="In stock only" checked={filters.inStock} onChange={() => setFilters((f) => ({ ...f, inStock: !f.inStock }))} />
      </Group>
      {multi('Category', 'types', PLANT_TYPES)}
      <Group title="Price">
        <label htmlFor="price-range" className="mb-2 flex justify-between text-sm text-muted">
          <span>Up to</span>
          <span className="font-medium text-ink">{money(filters.maxPrice)}</span>
        </label>
        <input id="price-range" type="range" min={15} max={MAX_PRICE} step={5} value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value }))} className="w-full" />
      </Group>
      {multi('Size', 'sizes', SIZES)}
      {multi('Light', 'light', LIGHT)}
      {multi('Watering', 'watering', WATERING)}
      {multi('Ease of care', 'difficulty', DIFFICULTY)}
    </div>
  );
}

export function applyFilters(list, f) {
  return list.filter(
    (p) =>
      (!f.types.length || f.types.includes(p.plantType)) &&
      p.price <= f.maxPrice &&
      (!f.sizes.length || p.sizes.some((s) => f.sizes.includes(s.label))) &&
      (!f.light.length || f.light.some((l) => p.light.includes(l))) &&
      (!f.watering.length || f.watering.includes(p.watering)) &&
      (!f.difficulty.length || f.difficulty.includes(p.difficulty)) &&
      (!f.petSafe || p.pet === 'safe') &&
      (!f.inStock || p.stock !== 'out-of-stock'),
  );
}

export const activeCount = (f) =>
  f.types.length + f.sizes.length + f.light.length + f.watering.length + f.difficulty.length + (f.maxPrice < MAX_PRICE ? 1 : 0) + (f.petSafe ? 1 : 0) + (f.inStock ? 1 : 0);
