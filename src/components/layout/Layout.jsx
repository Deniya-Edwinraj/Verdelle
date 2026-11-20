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

function HashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    return () => clearTimeout(t);
  }, [hash, pathname]);
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
