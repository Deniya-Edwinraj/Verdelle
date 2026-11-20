import { Link } from 'react-router-dom';
import { ArrowRight, Check, Gift, Leaf, ShoppingBag, Sparkles, Sprout, Star, TreeDeciduous, UserPlus } from 'lucide-react';
import { REWARDS } from '../data/services';
import { PageHero, money } from '../components/ui';
import { useRewards } from '../hooks/useRewards';
import { usePageMeta } from '../hooks/usePageMeta';

const TIER_ICONS = { seedling: Sprout, sprout: Leaf, evergreen: TreeDeciduous };

export default function Rewards() {
  usePageMeta(REWARDS.name, 'Earn Verdelle Leaves on every order and turn them into discounts, free upgrades and a free plant every year.');
  const { member, balance, tier } = useRewards();

  return (
    <>
      <PageHero
        eyebrow="Rewards programme"
        title={`${REWARDS.name}`}
        subtitle="Earn leaves every time you shop, then turn them into discounts, free upgrades and even a free plant every year."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Rewards' }]}
        plants={['monstera', 'zz']}
      />

      {/* Member strip / join */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <div className="flex flex-col gap-5 rounded-[28px] bg-white/90 p-5 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
          {member ? (
            <>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white">
                  <Leaf size={24} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Your balance · {tier.name}</p>
                  <p className="font-serif text-[32px] font-semibold leading-none text-forest">
                    {balance} <span className="text-base font-normal text-muted">leaves</span>
                  </p>
                </div>
              </div>
              <Link to="/account/rewards" className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
                View & redeem <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-forest">
                  <Gift size={24} />
                </span>
                <div>
                  <p className="font-serif text-2xl text-ink">
                    Join free and get <em className="italic text-botanical">{REWARDS.welcome} leaves</em>
                  </p>
                  <p className="text-sm text-muted">Every Verdelle account is automatically a member.</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
                  <UserPlus size={15} /> Join now
                </Link>
                <Link to="/login" state={{ from: '/account/rewards' }} className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-14 md:py-20">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
          <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
          How it works
        </p>
        <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
          Grow your <em className="font-normal italic text-botanical">rewards</em>
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [UserPlus, 'Join', `Create a free account and get ${REWARDS.welcome} welcome leaves.`],
            [ShoppingBag, 'Earn', `Collect ${REWARDS.perDollar} leaf for every $1 you spend on plants and pots.`],
            [Gift, 'Redeem', `Swap leaves for discounts — from ${money(REWARDS.redeem[0].value)} off at ${REWARDS.redeem[0].leaves} leaves.`],
          ].map(([Icon, t, b], i) => (
            <li key={t} className="relative rounded-[24px] bg-white p-6 shadow-soft ring-1 ring-line/70">
              <span className="absolute right-6 top-6 font-serif text-3xl italic text-sage-soft">0{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-forest">
                <Icon size={20} strokeWidth={1.7} />
              </span>
              <p className="mt-5 text-xl font-semibold tracking-tight">{t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{b}</p>
            </li>
          ))}
        </ol>

        {/* Redeem table */}
        <div className="mt-6 grid gap-3 rounded-[24px] bg-mist/50 p-5 sm:grid-cols-3">
          {REWARDS.redeem.map((r) => (
            <div key={r.leaves} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-line/60">
              <span className="flex items-center gap-2 text-sm text-muted">
                <Leaf size={15} className="text-botanical" /> {r.leaves} leaves
              </span>
              <span className="font-serif text-xl font-semibold text-forest">{money(r.value)} off</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="relative isolate overflow-hidden bg-forest-900 py-14 text-white md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-botanical/45 blur-3xl" />
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft">
              <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
              Membership tiers
              <span aria-hidden="true" className="h-px w-8 bg-sage-soft/60" />
            </p>
            <h2 className="mt-4 text-[32px] font-medium leading-tight tracking-tight text-white md:text-[44px]">
              The more you grow, the more you <em className="font-normal italic text-sage-soft">get</em>
            </h2>
            <p className="mt-3 text-sm text-white/65">Tiers are based on the leaves you’ve earned in total.</p>
          </div>
          <ul className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {REWARDS.tiers.map((t, i) => {
              const Icon = TIER_ICONS[t.key] || Leaf;
              const current = member && tier.key === t.key;
              return (
                <li
                  key={t.key}
                  className={`relative rounded-[28px] p-6 ring-1 backdrop-blur-sm md:p-7 ${i === 2 ? 'bg-gradient-to-br from-white/[0.14] to-white/[0.04] ring-sage-soft/40' : 'bg-white/[0.06] ring-white/10'}`}
                >
                  {current && <span className="absolute right-5 top-5 rounded-full bg-sage-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest-900">Your tier</span>}
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sage-soft">
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <p className="mt-5 font-serif text-[28px] font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/60">{t.min === 0 ? 'From your first order' : `${t.min}+ leaves earned`}</p>
                  <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                        <Check size={15} className="mt-0.5 shrink-0 text-sage-soft" /> {p}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* More ways */}
      <section className="container py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-white p-7 shadow-soft ring-1 ring-line/70 md:flex-row md:items-center md:p-9">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-forest">
              <Sparkles size={20} />
            </span>
            <div>
              <p className="font-serif text-2xl text-ink">
                Start earning <em className="italic text-botanical">today</em>
              </p>
              <p className="mt-1 text-sm text-muted">Every plant, pot and gift card counts towards your leaves.</p>
            </div>
          </div>
          <Link to="/shop" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            <Star size={15} /> Shop plants <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
