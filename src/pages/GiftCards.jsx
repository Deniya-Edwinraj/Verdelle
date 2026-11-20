import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, Clock, Gift, Mail, Send, ShoppingBag, Sparkles, User } from 'lucide-react';
import { GiftCardArt } from '../components/art/scenes';
import { PageHero, money } from '../components/ui';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { GIFT_CARD_AMOUNTS, GIFT_CARD_DESIGNS, GIFT_CARD_VALIDITY_MONTHS, giftCardProduct } from '../data/services';
import { usePageMeta } from '../hooks/usePageMeta';

const today = () => new Date().toISOString().slice(0, 10);

export default function GiftCards() {
  usePageMeta('Gift Cards', 'Give the gift of green — Verdelle digital gift cards, emailed instantly or on the date you choose.');
  const { addGiftCard } = useCart();
  const { openCart } = useUI();
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [design, setDesign] = useState('forest');
  const [to, setTo] = useState('');
  const [email, setEmail] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [sendOn, setSendOn] = useState(today());
  const [errors, setErrors] = useState({});

  const value = custom ? Number(custom) : amount;

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!value || value < 10 || value > 500) errs.amount = 'Choose an amount between $10 and $500';
    if (to.trim().length < 2) errs.to = 'Add the recipient’s name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address';
    if (sendOn < today()) errs.sendOn = 'Choose today or a future date';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const amt = Math.round(value);
    addGiftCard({ amount: amt, design, to: to.trim(), email: email.trim().toLowerCase(), message: [message.trim(), from.trim() && `— ${from.trim()}`].filter(Boolean).join(' '), sendOn });
    openCart({ product: giftCardProduct(amt, design), size: `$${amt}`, pot: null, qty: 1 });
    setTo('');
    setEmail('');
    setMessage('');
  };

  const fieldCls = (err) =>
    `flex h-12 items-center gap-3 rounded-2xl bg-card/70 px-4 ring-1 transition focus-within:bg-white focus-within:ring-2 ${err ? 'ring-red-700/50' : 'ring-line/70 focus-within:ring-botanical/40'}`;
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70';

  return (
    <>
      <PageHero
        eyebrow="The gift of green"
        title="Verdelle Gift Cards"
        subtitle="Let them choose their perfect plant. Emailed instantly — or on the date you choose."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Gifts', to: '/gifts' }, { label: 'Gift cards' }]}
        plants={['peace-lily', 'calathea']}
      />

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[32px] bg-white/90 p-6 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:p-8">
              <div className="mx-auto max-w-md overflow-hidden rounded-[24px] shadow-float ring-1 ring-black/5 transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02]">
                <GiftCardArt amount={value || 0} design={design} className="aspect-[1.6/1] w-full" />
              </div>
              <div className="mx-auto mt-6 max-w-md rounded-2xl bg-card/60 p-5 ring-1 ring-line/60">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Preview</p>
                <p className="mt-2 font-serif text-lg text-ink">
                  For <em className="italic text-botanical">{to || 'someone special'}</em>
                </p>
                <p className="mt-1 min-h-[2.5rem] text-sm italic leading-relaxed text-ink/70">{message ? `“${message}”` : '“Your message will appear here.”'}</p>
                {from && <p className="mt-1 text-sm text-muted">— {from}</p>}
                <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
                  <Send size={13} className="text-botanical" />
                  {sendOn === today() ? 'Sent today' : `Sent on ${new Date(sendOn + 'T09:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`} to {email || 'their inbox'}
                </p>
              </div>
              <ul className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2 text-center text-[11px] text-ink/70">
                {[
                  [Mail, 'Delivered by email'],
                  [Clock, `Valid ${GIFT_CARD_VALIDITY_MONTHS} months`],
                  [Sparkles, 'Use on any plant'],
                ].map(([Icon, t]) => (
                  <li key={t} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 ring-1 ring-line/60">
                    <Icon size={16} className="text-botanical" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} noValidate className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8 lg:mt-16">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
              <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
              Create your card
            </p>

            {/* Amount */}
            <fieldset className="mt-6">
              <legend className={label}>Amount</legend>
              <div className="grid grid-cols-4 gap-2">
                {GIFT_CARD_AMOUNTS.map((a) => {
                  const on = !custom && amount === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmount(a);
                        setCustom('');
                      }}
                      aria-pressed={on}
                      className={`h-14 rounded-2xl font-serif text-xl font-semibold ring-1 transition ${on ? 'bg-forest text-white shadow-soft ring-forest' : 'bg-white text-forest ring-line hover:ring-sage'}`}
                    >
                      ${a}
                    </button>
                  );
                })}
              </div>
              <div className={`mt-2 ${fieldCls(errors.amount)}`}>
                <span className="text-sm font-semibold text-muted">$</span>
                <input
                  type="number"
                  min={10}
                  max={500}
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Or enter a custom amount ($10–$500)"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                  aria-label="Custom amount"
                />
              </div>
              {errors.amount && <p className="mt-1.5 text-xs text-red-800">{errors.amount}</p>}
            </fieldset>

            {/* Design */}
            <fieldset className="mt-6">
              <legend className={label}>Design</legend>
              <div className="grid grid-cols-3 gap-3">
                {GIFT_CARD_DESIGNS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDesign(d.key)}
                    aria-pressed={design === d.key}
                    className={`overflow-hidden rounded-2xl ring-2 transition ${design === d.key ? 'ring-forest' : 'ring-transparent opacity-80 hover:opacity-100'}`}
                  >
                    <GiftCardArt design={d.key} className="aspect-[1.6/1] w-full" />
                    <span className="block bg-white py-1.5 text-xs font-medium text-ink">{d.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Recipient */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Recipient’s name</span>
                <span className={fieldCls(errors.to)}>
                  <User size={16} className="text-muted" />
                  <input value={to} onChange={(e) => setTo(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Sam" />
                </span>
                {errors.to && <span className="mt-1.5 block text-xs text-red-800">{errors.to}</span>}
              </label>
              <label className="block">
                <span className={label}>Recipient’s email</span>
                <span className={fieldCls(errors.email)}>
                  <Mail size={16} className="text-muted" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="sam@example.com" />
                </span>
                {errors.email && <span className="mt-1.5 block text-xs text-red-800">{errors.email}</span>}
              </label>
              <label className="block">
                <span className={label}>From (optional)</span>
                <span className={fieldCls()}>
                  <Gift size={16} className="text-muted" />
                  <input value={from} onChange={(e) => setFrom(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Your name" />
                </span>
              </label>
              <label className="block">
                <span className={label}>Send on</span>
                <span className={fieldCls(errors.sendOn)}>
                  <CalendarDays size={16} className="text-muted" />
                  <input type="date" min={today()} value={sendOn} onChange={(e) => setSendOn(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" />
                </span>
                {errors.sendOn && <span className="mt-1.5 block text-xs text-red-800">{errors.sendOn}</span>}
              </label>
            </div>
            <label className="mt-4 block">
              <span className={label}>Message (optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                rows={3}
                className="w-full resize-none rounded-2xl bg-card/70 p-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40"
                placeholder="Happy birthday! Pick something green that makes you smile."
              />
              <span className="mt-1 block text-right text-xs text-muted">{message.length}/200</span>
            </label>

            <button className="group mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical hover:shadow-lift">
              <ShoppingBag size={16} /> Add {value ? money(value) : ''} gift card to cart
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <ul className="mt-5 space-y-1.5 text-xs text-muted">
              {['Redeemable on plants, pots and accessories', `Valid for ${GIFT_CARD_VALIDITY_MONTHS} months from purchase`, 'Not redeemable for cash'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={13} className="text-botanical" /> {t}
                </li>
              ))}
            </ul>
          </form>
        </div>

        <div className="relative isolate mt-12 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-[28px] bg-forest-900 p-7 text-white sm:flex-row sm:items-center md:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-botanical/50 blur-3xl" />
          <div>
            <p className="font-serif text-2xl text-white">
              Prefer to send a <em className="italic text-sage-soft">real plant?</em>
            </p>
            <p className="mt-1 text-sm text-white/70">Browse our gift shop by occasion — with gift wrap and a handwritten note.</p>
          </div>
          <Link to="/gifts" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-mist">
            Visit the gift shop <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
