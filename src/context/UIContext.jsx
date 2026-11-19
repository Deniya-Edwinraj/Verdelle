import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [quickView, setQuickView] = useState(null); // product or null
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <UIContext.Provider value={{ quickView, setQuickView, searchOpen, setSearchOpen, menuOpen, setMenuOpen }}>{children}</UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
