import { Link } from 'react-router-dom';
import { FramedPlant } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-soft">
        <FramedPlant species="snake" pot="terracotta" seed="404" className="aspect-square w-full" />
      </div>
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">This page needs a little more light</h1>
        <p className="mt-4 max-w-md text-muted">We couldn’t find the page you were looking for. It may have been moved — or it never sprouted.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary px-7">Back to home</Link>
          <Link to="/shop" className="btn-outline px-7">Shop plants</Link>
          <Link to="/plant-care" className="btn-ghost px-5">Plant care</Link>
        </div>
      </div>
    </section>
  );
}
