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
const PlantFinder = lazy(() => import('./pages/PlantFinder'));
const Compare = lazy(() => import('./pages/Compare'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const PlantDoctor = lazy(() => import('./pages/PlantDoctor'));
const Subscription = lazy(() => import('./pages/Subscription'));
const GiftCards = lazy(() => import('./pages/GiftCards'));
const Gifts = lazy(() => import('./pages/Gifts'));
const PlantStyling = lazy(() => import('./pages/PlantStyling'));
const CareCourse = lazy(() => import('./pages/CareCourse'));
const Rewards = lazy(() => import('./pages/Rewards'));
const OfficePlants = lazy(() => import('./pages/OfficePlants'));
const Refer = lazy(() => import('./pages/Refer'));
const Community = lazy(() => import('./pages/Community'));

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
        <Route path="plant-finder" element={<PlantFinder />} />
        <Route path="compare" element={<Compare />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="plant-doctor" element={<PlantDoctor />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="gift-cards" element={<GiftCards />} />
        <Route path="gifts" element={<Gifts />} />
        <Route path="plant-styling" element={<PlantStyling />} />
        <Route path="care-course" element={<CareCourse />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="office-plants" element={<OfficePlants />} />
        <Route path="refer" element={<Refer />} />
        <Route path="community" element={<Community />} />
        <Route path="account/occasions" element={<Account tab="occasions" />} />
        <Route path="account/rewards" element={<Account tab="rewards" />} />
        <Route path="account/subscriptions" element={<Account tab="subscriptions" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
