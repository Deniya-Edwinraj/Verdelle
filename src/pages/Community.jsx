import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Check, Heart, ImagePlus, MapPin, Sprout, X } from 'lucide-react';
import { PageHero } from '../components/ui';
import { products, getProductById } from '../data/products';
import { SITE } from '../data/site';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

function shrink(file, max = 900) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

/** MyVerdelle — customer photos shared here or attached to product reviews. */
export default function Community() {
  usePageMeta('MyVerdelle', 'Real plants in real homes — photos shared by the Verdelle community.');
  const notify = useToast();
  const [posts, setPosts] = useLocalStorage('gn_gallery', []);
  const [reviews] = useLocalStorage('gn_reviews', {});
  const [likes, setLikes] = useLocalStorage('gn_gallery_likes', []);
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name: '', city: '', plant: '', caption: '' });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const all = useMemo(() => {
    const fromReviews = Object.entries(reviews).flatMap(([pid, list]) =>
      list.filter((r) => r.photo).map((r) => ({ id: r.id, photo: r.photo, name: r.name, plant: getProductById(pid)?.name || '', caption: r.title || r.body, date: r.date, source: 'review', slug: getProductById(pid)?.slug })),
    );
    return [...posts, ...fromReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [posts, reviews]);
  const plants = ['All', ...Array.from(new Set(all.map((p) => p.plant).filter(Boolean)))];
  const shown = filter === 'All' ? all : all.filter((p) => p.plant === filter);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    try {
      setPhoto(await shrink(f));
      setError('');
    } catch {
      setError('We couldn’t read that image — try another one');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!photo) return setError('Please add a photo of your plant');
    if (form.name.trim().length < 2) return setError('Please add your name');
    setError('');
    setPosts((cur) => [{ id: `g-${Date.now()}`, photo, ...form, name: form.name.trim(), date: new Date().toISOString(), source: 'upload', slug: products.find((p) => p.name === form.plant)?.slug }, ...cur]);
    setOpen(false);
    setPhoto(null);
    setForm({ name: '', city: '', plant: '', caption: '' });
    notify('Thanks for sharing your plant! 🌿');
  };

  const input = 'h-12 w-full rounded-2xl bg-card/70 px-4 text-sm outline-none ring-1 ring-line/70 transition focus:bg-white focus:ring-2 focus:ring-botanical/40';

  return (
    <>
      <PageHero
        eyebrow={`${SITE.instagramHandle} · MyVerdelle`}
        title="Plants in their happy place"
        subtitle="Real plants in real homes, shared by our community. Show us yours and inspire the next plant parent."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'MyVerdelle' }]}
        plants={['monstera', 'pothos']}
      />

      <section className="container relative z-10 -mt-16 pb-16 md:-mt-24 md:pb-24">
        {/* Share bar */}
        <div className="flex flex-col gap-4 rounded-[28px] bg-white/90 p-5 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest text-white">
              <Camera size={21} />
            </span>
            <div>
              <p className="font-serif text-xl text-ink">
                Share your <em className="italic text-botanical">Verdelle plant</em>
              </p>
              <p className="text-sm text-muted">Tag {SITE.instagramHandle} on Instagram or upload a photo here.</p>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
            <ImagePlus size={16} /> Share a photo
          </button>
        </div>

        {/* Filters */}
        {plants.length > 2 && (
          <ul className="no-scrollbar mt-8 flex gap-2 overflow-x-auto" aria-label="Filter by plant">
            {plants.map((p) => (
              <li key={p}>
                <button onClick={() => setFilter(p)} aria-pressed={filter === p} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${filter === p ? 'bg-forest text-white' : 'bg-white text-ink/75 ring-1 ring-line/70 hover:ring-sage'}`}>
                  {p}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Gallery */}
        {shown.length ? (
          <ul className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
            {shown.map((p) => {
              const liked = likes.includes(p.id);
              return (
                <li key={p.id} className="group relative break-inside-avoid overflow-hidden rounded-[22px] bg-card shadow-soft ring-1 ring-line/60">
                  <img src={p.photo} alt={`${p.plant || 'Plant'} shared by ${p.name}`} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent opacity-90" />
                  <button
                    onClick={() => setLikes((cur) => (liked ? cur.filter((x) => x !== p.id) : [...cur, p.id]))}
                    aria-pressed={liked}
                    aria-label={liked ? 'Unlike photo' : 'Like photo'}
                    className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition ${liked ? 'bg-white text-clay' : 'bg-white/30 text-white hover:bg-white/50'}`}
                  >
                    <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    {p.caption && <p className="line-clamp-2 text-sm leading-snug">“{p.caption}”</p>}
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-white/75">
                      <span className="font-semibold text-white">{p.name}</span>
                      {p.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} /> {p.city}
                        </span>
                      )}
                    </p>
                    {p.plant &&
                      (p.slug ? (
                        <Link to={`/product/${p.slug}`} className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md hover:bg-white/25">
                          <Sprout size={11} /> {p.plant}
                        </Link>
                      ) : (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px]">
                          <Sprout size={11} /> {p.plant}
                        </span>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-[28px] border-2 border-dashed border-line bg-white/60 px-6 py-16 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-mist text-forest">
              <Camera size={30} strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-serif text-[28px] text-ink">
              Be the first to <em className="italic text-botanical">share</em>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">Photos you share here — and photos added to product reviews — appear in this gallery.</p>
            <button onClick={() => setOpen(true)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-botanical">
              <ImagePlus size={16} /> Share a photo
            </button>
          </div>
        )}
      </section>

      {/* Upload modal */}
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <div className="absolute inset-0 animate-fade-in bg-forest-900/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} noValidate className="relative w-full max-w-lg animate-fade-up rounded-[28px] bg-warm p-6 shadow-[0_40px_80px_-20px_rgba(11,36,24,0.55)] md:p-8">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-card text-forest transition hover:rotate-90 hover:bg-forest hover:text-white" aria-label="Close">
              <X size={16} />
            </button>
            <p id="share-title" className="font-serif text-2xl text-ink">
              Share your <em className="italic text-botanical">plant</em>
            </p>
            <label className="mt-5 block cursor-pointer">
              <input type="file" accept="image/*" onChange={pick} className="sr-only" />
              {photo ? (
                <img src={photo} alt="Your plant" className="max-h-64 w-full rounded-2xl object-cover ring-1 ring-line" />
              ) : (
                <span className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sage bg-white text-sm font-medium text-forest transition hover:bg-mist/40">
                  <ImagePlus size={24} /> Choose a photo
                </span>
              )}
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className={input} />
              <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="City (optional)" className={input} />
              <select value={form.plant} onChange={(e) => setForm((f) => ({ ...f, plant: e.target.value }))} className={`${input} sm:col-span-2`}>
                <option value="">Which plant? (optional)</option>
                {products.filter((p) => p.type === 'plant').map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
              <input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value.slice(0, 120) }))} placeholder="Caption (optional)" className={`${input} sm:col-span-2`} />
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-800" role="alert">
                {error}
              </p>
            )}
            <label className="mt-4 flex items-start gap-2 text-xs text-muted">
              <Check size={14} className="mt-0.5 shrink-0 text-botanical" /> By sharing, you agree we may feature your photo on our website and social media with credit.
            </label>
            <button className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white transition hover:bg-botanical">
              <Camera size={15} /> Share to MyVerdelle
            </button>
          </form>
        </div>
      )}
    </>
  );
}
