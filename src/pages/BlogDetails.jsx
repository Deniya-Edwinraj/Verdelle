import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Facebook, Lightbulb, Link2, Twitter } from 'lucide-react';
import { getPost, blogPosts } from '../data/blogPosts';
import { getProduct } from '../data/products';
import { EditorialScene } from '../components/art/scenes';
import ProductCard from '../components/products/ProductCard';
import { BlogCard } from '../components/home/HomeSections';
import { Breadcrumb } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fmtDate } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

function Block({ b }) {
  if (b.h2) return <h2>{b.h2}</h2>;
  if (b.p) return <p>{b.p}</p>;
  if (b.ul) return <ul>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (b.tip)
    return (
      <aside className="my-6 flex gap-3 rounded-lg bg-mist/60 p-4 text-sm text-forest">
        <Lightbulb size={18} className="mt-0.5 shrink-0" />
        <span><strong>Verdelle tip: </strong>{b.tip}</span>
      </aside>
    );
  return null;
}

export default function BlogDetails() {
  const { slug } = useParams();
  const post = getPost(slug);
  const notify = useToast();
  usePageMeta(post?.title, post?.excerpt);
  if (!post) return <NotFound />;
  const url = window.location.href;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      notify('Article link copied');
    } catch {
      notify('Could not copy the link', { type: 'info' });
    }
  };
  const related = blogPosts.filter((p) => p.slug !== slug).sort((a, b) => Number(b.tag === post.tag) - Number(a.tag === post.tag)).slice(0, 3);
  const shop = post.related.map(getProduct).filter(Boolean).slice(0, 2);
  const share = 'grid h-9 w-9 place-items-center rounded-full border border-line text-forest hover:bg-mist/60';

  return (
    <article>
      <header className="bg-mist/40">
        <div className="container max-w-4xl py-10 md:py-14">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]} />
          <p className="eyebrow mt-8">{post.tag}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-[52px]">{post.title}</h1>
          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
          <p className="mt-5 text-sm text-muted">By {post.author} · {fmtDate(post.date)} · {post.readingTime} min read</p>
        </div>
      </header>
      <div className="container max-w-5xl pt-8">
        <div className="overflow-hidden rounded-2xl">
          <EditorialScene kind={post.image} label={post.title} className="aspect-[16/7] w-full" />
        </div>
      </div>
      <div className="container grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_230px]">
        <div className="prose-gn max-w-2xl text-[16.5px]">
          {post.body.map((b, i) => (
            <Block key={i} b={b} />
          ))}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <span className="text-sm font-medium">Share</span>
            <a className={share} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X / Twitter"><Twitter size={16} /></a>
            <a className={share} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><Facebook size={16} /></a>
            <button onClick={copy} className={share} aria-label="Copy link"><Link2 size={16} /></button>
          </div>
          <Link to="/blog" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline">
            <ArrowLeft size={15} /> Back to the blog
          </Link>
        </div>
        {shop.length > 0 && (
          <aside aria-label="Plants in this article">
            <div className="sticky top-24">
              <p className="mb-3 text-sm font-semibold">Shop this story</p>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                {shop.map((p) => (
                  <li key={p.id}><ProductCard product={p} /></li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
      <section className="section border-t border-line bg-card/50">
        <div className="container">
          <h2 className="mb-8 text-3xl font-semibold">Related articles</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}><BlogCard post={p} /></li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
