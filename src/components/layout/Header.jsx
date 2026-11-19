import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight, BookOpen, ChevronDown, Droplets, Flower2, Heart, Leaf, Mail, Menu, Moon, PawPrint, Phone, Search, ShoppingBag, Sparkles, Sprout, Sun, TriangleAlert, User,
} from 'lucide-react';
import { Logo, money } from '../ui';
import { NAV, SITE } from '../../data/site';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import MobileNav from './MobileNav';
import SearchOverlay from './SearchOverlay';

const MENU_ICONS = { leaf: Leaf, sparkles: Sparkles, sprout: Sprout, moon: Moon, paw: PawPrint, pot: Flower2, book: BookOpen, drop: Droplets, sun: Sun, alert: TriangleAlert };

function Dropdown({ item, open, setOpen }) {
  const ref = useRef(null);
  const wide = item.menu.length > 4;
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(item.label)} onMouseLeave={() => setOpen(null)}>
      <div className="flex h-10 items-center">
        <NavLink to={item.to} className={({ isActive }) => `relative flex h-10 items-center text-[13.5px] font-medium leading-none transition-colors hover:text-forest ${isActive ? 'text-forest after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded after:bg-forest' : 'text-ink/80'}`}>
          {item.label}
        </NavLink>
        <button
          aria-label={`Show ${item.label} menu`}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen(open ? null : item.label)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(null)}
          className="grid h-10 w-5 place-items-center text-ink/60 hover:text-forest"
        >
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div
        className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 transition-all duration-200 ${wide ? 'w-[540px]' : 'w-[300px]'} ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}
      >
        {/* caret */}
        <span aria-hidden="true" className="absolute left-1/2 top-[7px] h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-botanical" />
        <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <div className="h-1 bg-gradient-to-r from-forest via-botanical to-sage" aria-hidden="true" />
          <div className="px-5 pb-2 pt-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-sage">{item.heading || item.label}</p>
          </div>
          <ul className={`grid gap-1 px-3 pb-3 ${wide ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {item.menu.map((m) => {
              const Icon = MENU_ICONS[m.icon] || Leaf;
              return (
                <li key={m.label}>
                  <Link to={m.to} onClick={() => setOpen(null)} className="group/item flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-mist/50 focus-visible:bg-mist/50">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mist/70 text-forest transition-colors group-hover/item:bg-forest group-hover/item:text-white">
                      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium text-ink group-hover/item:text-forest">{m.label}</span>
                      {m.desc && <span className="block truncate text-xs text-muted">{m.desc}</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            to={item.to}
            onClick={() => setOpen(null)}
            className="group/cta flex items-center justify-between border-t border-line bg-warm px-5 py-3 text-[13px] font-medium text-forest transition-colors hover:bg-forest hover:text-white"
          >
            <span className="font-serif text-[15px]">{item.cta || `View all ${item.label.toLowerCase()}`}</span>
            <ArrowRight size={16} className="transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function Header() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const { setSearchOpen, setMenuOpen } = useUI();
  const [open, setOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => setOpen(null), [pathname, search]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded focus:bg-forest focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="bg-forest text-white">
        <div className="container flex h-9 items-center justify-center gap-4 text-xs sm:justify-between">
          <p className="truncate text-white/90">
            Welcome to {SITE.name} — <span className="hidden md:inline">free delivery on orders over {money(SITE.freeShippingThreshold)}</span>
            <span className="md:hidden">bring nature home</span>
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1.5 text-white/90 transition hover:text-white">
              <Phone size={13} aria-hidden="true" /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 text-white/90 transition hover:text-white">
              <Mail size={13} aria-hidden="true" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>
      <header className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'border-line shadow-[0_6px_20px_-14px_rgba(23,63,45,0.3)]' : 'border-transparent'}`}>
        <div className="container flex h-20 items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-1">
            <button className="-ml-2 grid h-10 w-10 place-items-center rounded-md text-forest hover:bg-mist/60 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <Logo variant="full" className="h-14 sm:h-16" />
          </div>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((n) =>
                n.menu ? (
                  <Dropdown key={n.to} item={n} open={open === n.label} setOpen={setOpen} />
                ) : (
                  <li key={n.to}>
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      className={({ isActive }) =>
                        `relative flex h-10 items-center text-[13.5px] font-medium leading-none transition-colors hover:text-forest ${isActive ? 'text-forest after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded after:bg-forest' : 'text-ink/80'}`
                      }
                    >
                      {n.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-0.5 text-forest sm:gap-1">
            <button onClick={() => setSearchOpen(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist/60" aria-label="Search plants">
              <Search size={19} />
            </button>
            <Link to={user ? '/account' : '/login'} className="hidden h-10 w-10 place-items-center rounded-full hover:bg-mist/60 sm:grid" aria-label={user ? 'My account' : 'Sign in'}>
              <User size={19} />
            </Link>
            <Link to="/wishlist" className="relative hidden h-10 w-10 place-items-center rounded-full hover:bg-mist/60 md:grid" aria-label={`Wishlist, ${ids.length} items`}>
              <Heart size={19} />
              {ids.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-botanical" aria-hidden="true" />}
            </Link>
            <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-mist/60" aria-label={`Cart, ${count} items`}>
              <ShoppingBag size={19} />
              <span className={`absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-forest px-1 text-[10px] font-semibold text-white transition-transform ${count ? 'scale-100' : 'scale-0'}`} aria-hidden="true">
                {count}
              </span>
            </Link>
            <Link to="/shop" className="btn-primary ml-2 hidden h-9 px-4 text-xs sm:inline-flex">
              Shop Now
            </Link>
          </div>
        </div>
      </header>
      <MobileNav />
      <SearchOverlay />
    </>
  );
}
