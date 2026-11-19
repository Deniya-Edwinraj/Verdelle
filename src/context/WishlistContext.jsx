import { createContext, useCallback, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('gn_wishlist', []);
  const [recent, setRecent] = useLocalStorage('gn_recent', []);

  const has = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id) => {
      const adding = !ids.includes(id);
      setIds((cur) => (adding ? [...cur.filter((x) => x !== id), id] : cur.filter((x) => x !== id)));
      return adding;
    },
    [ids, setIds],
  );
  const remove = useCallback((id) => setIds((cur) => cur.filter((x) => x !== id)), [setIds]);

  const trackView = useCallback((id) => setRecent((cur) => [id, ...cur.filter((x) => x !== id)].slice(0, 8)), [setRecent]);

  return <WishlistContext.Provider value={{ ids, has, toggle, remove, recent, trackView }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
