import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { blogPosts, BLOG_TAGS } from '../data/blogPosts';
import { EditorialScene } from '../components/art/scenes';
import { BlogCard } from '../components/home/HomeSections';
import { EmptyState, PageHero } from '../components/ui';
import { fmtDate } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Blog() {
  usePageMeta('GreenVibe Blog', 'Plant picks, care tips and styling ideas from the GreenVibe blog by Verdelle.');
  const [tag, setTag] = useState('All');
  const [q, setQ] = useState('');
  const featured = blogPosts.find((p) => p.featured);
  const list = useMemo(() => blogPosts.filter((p) => (tag === 'All' || p.tag === tag) && (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase()))), [tag, q]);
  const showFeatured = tag === 'All' && !q;

  return (
    <>
      <PageHero eyebrow="GreenVibe Blog" title="Stories for plant people" subtitle="Expert tips, plant picks and a little daily inspiration." crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} plants={['boston-fern', 'syngonium']} />
      {showFeatured && featured && (
        <section className="container pt-12">
          <Link to={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-line/70 transition hover:shadow-lift md:grid-cols-2">
            <div className="overflow-hidden">
              <EditorialScene kind={featured.image} label={featured.title} className="aspect-[16/11] h-full w-full transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="eyebrow">Featured · {featured.tag}</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{featured.title}</h2>
              <p className="mt-3 text-muted">{featured.excerpt}</p>
              <p className="mt-5 text-xs text-muted">{fmtDate(featured.date)} · {featured.readingTime} min read</p>
            </div>
          </Link>
        </section>
      )}
      <section className="container py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Blog tags">
            {BLOG_TAGS.map((t) => (
              <li key={t}>
                <button onClick={() => setTag(t)} aria-pressed={tag === t} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${tag === t ? 'bg-forest text-white' : 'bg-card hover:bg-mist'}`}>
                  {t}
                </button>
              </li>
            ))}
          </ul>
          <label className="relative block md:w-72">
            <span className="sr-only">Search articles</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="field pl-9" />
          </label>
        </div>
        {list.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={SearchX} title="No articles found" body="Try another tag or search term." action={<button className="btn-primary" onClick={() => { setQ(''); setTag('All'); }}>Show all articles</button>} />
        )}
      </section>
    </>
  );
}
