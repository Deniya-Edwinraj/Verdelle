import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import QuickViewModal from '../products/QuickViewModal';
import CartDrawer from '../cart/CartDrawer';
import CompareBar from '../products/CompareBar';
import NewsletterPopup from '../forms/NewsletterPopup';
import CookieConsent from './CookieConsent';
import ChatWidget from './ChatWidget';
import { LoadingSkeleton, ScrollToTop } from '../ui';

/** Scrolls to a section from `#id` in the URL, or from `state.scrollTo` (keeps the URL clean). */
function HashScroll() {
  const { hash, pathname, state, key } = useLocation();
  const target = state?.scrollTo || (hash && hash.slice(1));
  useEffect(() => {
    if (!target) return undefined;
    let tries = 0;
    let t;
    const go = () => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 20) t = setTimeout(go, 100); // wait for lazy-loaded pages
    };
    t = setTimeout(go, 150);
    return () => clearTimeout(t);
  }, [target, pathname, key]);
  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <HashScroll />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<LoadingSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <QuickViewModal />
      <CartDrawer />
      <CompareBar />
      <NewsletterPopup />
      <CookieConsent />
      <ChatWidget />
    </div>
  );
}
