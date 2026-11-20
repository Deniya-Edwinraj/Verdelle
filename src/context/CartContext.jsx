import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getProductById } from '../data/products';
import { SITE } from '../data/site';
import { GIFT_CARD_ID, giftCardProduct, readRewardCodes } from '../data/services';

const CartContext = createContext(null);

const keyOf = (id, size, pot) => `${id}__${size}__${pot || ''}`;

/** Unit price for a product/size/pot choice — the single source of truth for pricing. */
export function unitPriceFor(product, sizeLabel, potLabel) {
  const size = product.sizes.find((s) => s.label === sizeLabel) || product.sizes[0];
  const pot = product.potOptions.find((p) => p.label === potLabel);
  return {
    size,
    pot,
    price: +(size.price + (pot?.price || 0)).toFixed(2),
    regular: +(size.regular + (pot?.price || 0)).toFixed(2),
  };
}

export function CartProvider({ children }) {
  // Stored shape: [{ key, id, size, pot, qty }] — prices are always re-derived from the catalogue.
  const [raw, setRaw] = useLocalStorage('gn_cart', []);
  const [coupon, setCoupon] = useLocalStorage('gn_coupon', null);

  const items = useMemo(
    () =>
      raw
        .map((it) => {
          const product = it.id === GIFT_CARD_ID ? giftCardProduct(it.amount, it.design) : getProductById(it.id);
          if (!product) return null;
          const { size, pot, price, regular } = unitPriceFor(product, it.size, it.pot);
          return { ...it, size: size.label, pot: pot?.label || null, product, unitPrice: price, regularPrice: regular, lineTotal: +(price * it.qty).toFixed(2) };
        })
        .filter(Boolean),
    [raw],
  );

  const add = useCallback(
    (product, { size, pot, qty = 1 } = {}) => {
      const s = size || product.sizes[0].label;
      const pt = pot || product.potOptions[0]?.label || null;
      const key = keyOf(product.id, s, pt);
      setRaw((cur) => {
        const found = cur.find((x) => x.key === key);
        if (found) return cur.map((x) => (x.key === key ? { ...x, qty: Math.min(10, x.qty + qty) } : x));
        return [...cur, { key, id: product.id, size: s, pot: pt, qty: Math.min(10, qty) }];
      });
    },
    [setRaw],
  );

  /** Gift cards are always their own line (each has its own recipient). */
  const addGiftCard = useCallback(
    ({ amount, design, to, email, message, sendOn }) => {
      const key = `${GIFT_CARD_ID}__${Date.now()}`;
      setRaw((cur) => [...cur, { key, id: GIFT_CARD_ID, size: `$${amount}`, pot: null, qty: 1, amount, design, to, email, message, sendOn }]);
    },
    [setRaw],
  );

  const update = useCallback(
    (key, qty) => setRaw((cur) => (qty <= 0 ? cur.filter((x) => x.key !== key) : cur.map((x) => (x.key === key ? { ...x, qty: Math.min(10, qty) } : x)))),
    [setRaw],
  );
  const remove = useCallback((key) => setRaw((cur) => cur.filter((x) => x.key !== key)), [setRaw]);
  const clear = useCallback(() => {
    setRaw([]);
    setCoupon(null);
  }, [setRaw, setCoupon]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = +items.reduce((n, i) => n + i.lineTotal, 0).toFixed(2);
  const saleSavings = +items.reduce((n, i) => n + (i.regularPrice - i.unitPrice) * i.qty, 0).toFixed(2);

  const reward = coupon && !SITE.coupons[coupon] ? readRewardCodes().find((r) => r.code === coupon && !r.used) : null;
  const couponInfo = coupon ? SITE.coupons[coupon] || (reward ? { type: 'fixed', value: reward.value, label: `$${reward.value} Verdelle Leaves reward` } : null) : null;
  const discount = couponInfo ? +(couponInfo.type === 'percent' ? (subtotal * couponInfo.value) / 100 : Math.min(couponInfo.value, subtotal)).toFixed(2) : 0;

  const applyCoupon = useCallback(
    (code) => {
      const c = code.trim().toUpperCase();
      if (!SITE.coupons[c] && !readRewardCodes().some((r) => r.code === c && !r.used)) return false;
      setCoupon(c);
      return true;
    },
    [setCoupon],
  );

  return (
    <CartContext.Provider value={{ items, count, subtotal, saleSavings, add, addGiftCard, update, remove, clear, coupon, couponInfo, discount, applyCoupon, removeCoupon: () => setCoupon(null) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

export function totals({ subtotal, discount }, method = 'standard', { giftWrap = false } = {}) {
  const after = +(subtotal - discount).toFixed(2);
  const shipping = method === 'express' ? SITE.shipping.express.price : after >= SITE.freeShippingThreshold || after === 0 ? 0 : SITE.shipping.standard.price;
  const gift = giftWrap && after > 0 ? SITE.giftWrap.price : 0;
  return { after, shipping, gift, total: +(after + shipping + gift).toFixed(2) };
}
