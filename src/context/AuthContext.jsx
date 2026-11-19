import { createContext, useCallback, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * DEMO ONLY — there is no authentication backend.
 * Profiles live in this browser's localStorage, passwords are never stored,
 * and "signing in" simply loads the local demo profile. Replace these functions
 * with calls to a real auth API before launch.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('gn_user', null);
  const [addresses, setAddresses] = useLocalStorage('gn_addresses', []);
  const [orders, setOrders] = useLocalStorage('gn_orders', []);

  const register = useCallback(({ firstName, lastName, email }) => setUser({ firstName, lastName, email, joined: new Date().toISOString() }), [setUser]);

  const login = useCallback(
    ({ email }) => {
      setUser((cur) => (cur && cur.email === email ? cur : { firstName: email.split('@')[0], lastName: '', email, joined: new Date().toISOString() }));
    },
    [setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);
  const updateProfile = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), [setUser]);

  const saveAddress = useCallback(
    (addr) =>
      setAddresses((cur) => {
        const id = addr.id || Math.random().toString(36).slice(2, 9);
        const next = cur.some((a) => a.id === id) ? cur.map((a) => (a.id === id ? { ...addr, id } : a)) : [...cur, { ...addr, id }];
        return addr.isDefault ? next.map((a) => ({ ...a, isDefault: a.id === id })) : next;
      }),
    [setAddresses],
  );
  const removeAddress = useCallback((id) => setAddresses((cur) => cur.filter((a) => a.id !== id)), [setAddresses]);

  // Orders contain no payment details — only items, totals and shipping info.
  const addOrder = useCallback((order) => setOrders((cur) => [order, ...cur]), [setOrders]);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile, addresses, saveAddress, removeAddress, orders, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
