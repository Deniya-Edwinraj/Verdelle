import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { REWARDS } from '../data/services';

/**
 * Verdelle Leaves balance, tier and redemption for the signed-in member.
 * Leaves are earned from orders (1 per $1) plus a welcome bonus; redeeming creates a one-off code
 * that the cart accepts like any discount code.
 */
export function useRewards() {
  const { user, orders } = useAuth();
  const [codes, setCodes] = useLocalStorage('gn_reward_codes', []);

  const fromOrders = orders.map((o) => ({ id: o.number, date: o.date, leaves: Math.floor(o.total * REWARDS.perDollar), label: `Order ${o.number}` }));
  const history = [
    ...(user ? [{ id: 'welcome', date: user.joined || new Date().toISOString(), leaves: REWARDS.welcome, label: 'Welcome bonus' }] : []),
    ...fromOrders,
    ...codes.map((c) => ({ id: c.code, date: c.date, leaves: -c.leaves, label: `Redeemed for ${c.code}` })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const earned = (user ? REWARDS.welcome : 0) + fromOrders.reduce((s, x) => s + x.leaves, 0);
  const spent = codes.reduce((s, c) => s + c.leaves, 0);
  const balance = Math.max(0, earned - spent);
  const tier = [...REWARDS.tiers].reverse().find((t) => earned >= t.min) || REWARDS.tiers[0];
  const nextTier = REWARDS.tiers.find((t) => t.min > earned) || null;

  const redeem = useCallback(
    (option) => {
      if (balance < option.leaves) return null;
      const code = `LEAF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const entry = { code, value: option.value, leaves: option.leaves, used: false, date: new Date().toISOString() };
      setCodes((cur) => [entry, ...cur]);
      return entry;
    },
    [balance, setCodes],
  );

  return { member: !!user, balance, earned, tier, nextTier, history, codes, redeem };
}

/** Marks a reward code as used once an order has been placed with it. */
export function markRewardUsed(code) {
  try {
    const all = JSON.parse(window.localStorage.getItem('gn_reward_codes') || '[]');
    if (!all.some((c) => c.code === code)) return;
    window.localStorage.setItem('gn_reward_codes', JSON.stringify(all.map((c) => (c.code === code ? { ...c, used: true } : c))));
  } catch {
    /* storage unavailable */
  }
}
