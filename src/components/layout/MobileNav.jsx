import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingBag, User, X } from 'lucide-react';
import { Logo } from '../ui';
import { NAV } from '../../data/site';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const { menuOpen, setMenuOpen } = useUI();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const { pathname, search } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname, search, setMenuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, setMenuOpen]);

  if (!menuOpen) return null;
  const close = () => setMenuOpen(false);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={close} />
      <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm animate-slide-in flex-col bg-warm shadow-lift">
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo className="h-11" />
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-md text-forest hover:bg-mist/60" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-3">
          <ul className="divide-y divide-line">
            {NAV.map((n) =>
              n.menu ? (
                <li key={n.to}>
                  <button className="flex w-full items-center justify-between py-3.5 font-serif text-xl text-forest" aria-expanded={expanded === n.label} onClick={() => setExpanded(expanded === n.label ? null : n.label)}>
                    {n.label} <ChevronDown size={18} className={`transition-transform ${expanded === n.label ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded === n.label && (
                    <ul className="mb-3 grid grid-cols-2 gap-1 pl-1">
                      {n.menu.map((m) => (
                        <li key={m.label}>
                          <Link to={m.to} className="block py-1.5 text-sm text-ink/85">
                            {m.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `block py-3.5 font-serif text-xl ${isActive ? 'text-botanical' : 'text-forest'}`}>
                    {n.label}
                  </NavLink>
                </li>
              ),
            )}
            <li>
              <Link to="/blog" className="block py-3.5 font-serif text-xl text-forest">Blog</Link>
            </li>
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            <Link to={user ? '/account' : '/login'} className="flex flex-col items-center gap-1.5 rounded-lg bg-mist/60 py-3 text-forest">
              <User size={18} /> {user ? 'Account' : 'Sign in'}
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center gap-1.5 rounded-lg bg-mist/60 py-3 text-forest">
              <Heart size={18} /> Wishlist
            </Link>
            <Link to="/cart" className="flex flex-col items-center gap-1.5 rounded-lg bg-mist/60 py-3 text-forest">
              <ShoppingBag size={18} /> Cart
            </Link>
          </div>
          <Link to="/shop" className="btn-primary mt-4 w-full">Shop Now</Link>
        </nav>
      </div>
    </div>
  );
}
