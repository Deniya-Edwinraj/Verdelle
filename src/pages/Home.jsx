import { usePageMeta } from '../hooks/usePageMeta';
import { Hero, BenefitsAroundPlant, CollectionFeatureBanner, FavoritePlants, SaleBanner, Testimonials, Newsletter, BlogPreview } from '../components/home/HomeSections';
import ARShowcase from '../components/home/ARShowcase';

export default function Home() {
  usePageMeta(null, 'Verdelle — discover beautiful indoor plants, pots and plant-care supplies, delivered with care.');
  return (
    <>
      <Hero />
      <BenefitsAroundPlant />
      <CollectionFeatureBanner />
      <FavoritePlants />
      <ARShowcase />
      <SaleBanner />
      <Testimonials />
      <Newsletter />
      <BlogPreview />
    </>
  );
}
