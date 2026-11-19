import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetails = lazy(() => import('./pages/CollectionDetails'));
const PlantCare = lazy(() => import('./pages/PlantCare'));
const PlantCareDetails = lazy(() => import('./pages/PlantCareDetails'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ShippingReturns = lazy(() => import('./pages/ShippingReturns'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const PhotoCredits = lazy(() => import('./pages/PhotoCredits'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionDetails />} />
        <Route path="plant-care" element={<PlantCare />} />
        <Route path="plant-care/:slug" element={<PlantCareDetails />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetails />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="account" element={<Account tab="overview" />} />
        <Route path="account/orders" element={<Account tab="orders" />} />
        <Route path="account/addresses" element={<Account tab="addresses" />} />
        <Route path="account/profile" element={<Account tab="profile" />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="shipping-returns" element={<ShippingReturns />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="photo-credits" element={<PhotoCredits />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
