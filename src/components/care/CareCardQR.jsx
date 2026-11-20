import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Droplets, PawPrint, Printer, QrCode, Sun } from 'lucide-react';
import { getProduct, getProductById, PET } from '../../data/products';
import { getGuide } from '../../data/careGuides';
import { ProductImage } from '../art/scenes';

function QR({ url, size = 112 }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let live = true;
    QRCode.toDataURL(url, { margin: 1, width: size * 2, color: { dark: '#0B2418', light: '#FFFFFF' } })
      .then((d) => live && setSrc(d))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [url, size]);
  return src ? <img src={src} alt={`QR code linking to ${url}`} width={size} height={size} className="rounded-lg" /> : <span className="block rounded-lg bg-card" style={{ width: size, height: size }} />;
}

/** One printable care card: plant, key care facts and a QR code to its online care guide. */
export function CareCard({ product }) {
  const guide = getGuide(product.careGuide);
  const url = `${window.location.origin}/product/${product.slug}`;
  return (
    <article className="care-card flex gap-4 rounded-[22px] bg-white p-4 ring-1 ring-line/70 print:break-inside-avoid print:shadow-none">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-card">
            <ProductImage product={product} className="h-full w-full" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-semibold text-ink">{product.name}</p>
            <p className="truncate text-xs italic text-muted">{product.botanical}</p>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 text-xs text-ink/80">
          <li className="flex items-center gap-2">
            <Sun size={13} className="text-botanical" /> {product.light.join(', ')} light
          </li>
          <li className="flex items-center gap-2">
            <Droplets size={13} className="text-botanical" /> Water {product.watering.toLowerCase()}
          </li>
          <li className="flex items-center gap-2">
            <PawPrint size={13} className="text-botanical" /> {PET[product.pet].label}
          </li>
        </ul>
        {guide && <p className="mt-2 truncate text-[11px] text-muted">Guide: {guide.title}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <QR url={url} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forest">Scan for care</span>
      </div>
    </article>
  );
}

/** Care cards for every plant in an order, with a print button. */
export default function OrderCareCards({ items }) {
  const plants = [];
  items.forEach((i) => {
    const p = getProduct(i.slug) || getProductById(i.id);
    if (p && p.type === 'plant' && !plants.some((x) => x.id === p.id)) plants.push(p);
  });
  if (!plants.length) return null;
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line/70 md:p-8" aria-labelledby="care-cards">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-botanical">
            <QrCode size={14} /> Digital care cards
          </p>
          <h2 id="care-cards" className="mt-2 font-serif text-2xl text-ink">
            Scan, care, <em className="italic text-botanical">thrive</em>
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted">Every plant arrives with a printed card like these. Scan the QR code any time to open its full care guide.</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest">
          <Printer size={15} /> Print cards
        </button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {plants.map((p) => (
          <CareCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
