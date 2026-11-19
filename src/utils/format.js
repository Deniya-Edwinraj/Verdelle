import { SITE } from '../data/site';

const fmt = new Intl.NumberFormat(SITE.currency.locale, { style: 'currency', currency: SITE.currency.code });

/** Formats an amount in the single configured store currency. */
export const money = (n) => fmt.format(n);

export const fmtDate = (d, opts = { month: 'long', day: 'numeric', year: 'numeric' }) => new Date(d).toLocaleDateString(SITE.currency.locale, opts);
