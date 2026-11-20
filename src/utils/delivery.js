// Delivery-date helpers. Orders placed before the cut-off on a business day are dispatched the same day.
export const CUTOFF_HOUR = 14; // 2pm local time

const isBusinessDay = (d) => d.getDay() !== 0 && d.getDay() !== 6;

export function addBusinessDays(date, n) {
  const d = new Date(date);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d)) left -= 1;
  }
  return d;
}

/** The moment the order would be dispatched if placed at `now`. */
export function dispatchDate(now = new Date()) {
  const d = new Date(now);
  if (isBusinessDay(d) && d.getHours() < CUTOFF_HOUR) return d;
  d.setHours(9, 0, 0, 0);
  do d.setDate(d.getDate() + 1);
  while (!isBusinessDay(d));
  return d;
}

/** Time left until today's cut-off, or null if dispatch is not today. */
export function timeToCutoff(now = new Date()) {
  if (!isBusinessDay(now) || now.getHours() >= CUTOFF_HOUR) return null;
  const cutoff = new Date(now);
  cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);
  const ms = cutoff - now;
  return { h: Math.floor(ms / 3600000), m: Math.floor((ms % 3600000) / 60000) };
}

/** Delivery window for a shipping method, e.g. standard = 3–5 business days, express = 1–2. */
export function deliveryWindow(method = 'standard', now = new Date()) {
  const [min, max] = method === 'express' ? [1, 2] : [3, 5];
  const from = dispatchDate(now);
  return { from: addBusinessDays(from, min), to: addBusinessDays(from, max) };
}

export const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
