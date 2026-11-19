import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products, label = 'Products' }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [products]);
  const scroll = (d) => ref.current.scrollBy({ left: d * ref.current.clientWidth * 0.9, behavior: 'smooth' });

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <button onClick={() => scroll(-1)} disabled={edges.start} aria-label="Previous" className="absolute -left-3 top-[36%] z-10 hidden h-10 w-10 place-items-center rounded-full border border-line bg-white text-forest shadow-soft disabled:opacity-0 md:grid lg:-left-5">
        <ChevronLeft size={18} />
      </button>
      <div ref={ref} onScroll={update} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:gap-5 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[64%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} disabled={edges.end} aria-label="Next" className="absolute -right-3 top-[36%] z-10 hidden h-10 w-10 place-items-center rounded-full border border-line bg-white text-forest shadow-soft disabled:opacity-0 md:grid lg:-right-5">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
