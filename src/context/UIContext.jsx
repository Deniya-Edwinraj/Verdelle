import { createContext, useCallback, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UIContext = createContext(null);

export const COMPARE_MAX = 3;

export function UIProvider({ children }) {
  const [quickView, setQuickView] = useState(null); // product or null
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null); // { product, size, pot, qty }

  // Compare list (product ids), shared by product cards, product page, compare bar and compare page.
  const [compare, setCompare] = useLocalStorage('gn_compare', []);
  const inCompare = useCallback((id) => compare.includes(id), [compare]);
  /** Returns 'added' | 'removed' | 'full'. */
  const toggleCompare = useCallback(
    (id) => {
      if (compare.includes(id)) {
        setCompare((c) => c.filter((x) => x !== id));
        return 'removed';
      }
      if (compare.length >= COMPARE_MAX) return 'full';
      setCompare((c) => [...c, id]);
      return 'added';
    },
    [compare, setCompare],
  );
  const clearCompare = useCallback(() => setCompare([]), [setCompare]);

  // Cookie consent: null (not chosen yet) | 'accepted' | 'declined'
  const [cookieConsent, setCookieConsent] = useLocalStorage('gn_cookie_consent', null);
  const [cookieOpen, setCookieOpen] = useState(false);

  const openCart = useCallback((added = null) => {
    setLastAdded(added);
    setCartOpen(true);
  }, []);

  return (
    <UIContext.Provider
      value={{
        quickView,
        setQuickView,
        searchOpen,
        setSearchOpen,
        menuOpen,
        setMenuOpen,
        cartOpen,
        setCartOpen,
        openCart,
        lastAdded,
        compare,
        inCompare,
        toggleCompare,
        clearCompare,
        cookieConsent,
        setCookieConsent,
        cookieOpen,
        setCookieOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
