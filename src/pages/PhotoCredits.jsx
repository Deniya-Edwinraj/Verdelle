import { PageHeader } from '../components/ui';
import { PHOTO_CREDITS } from '../data/assets';
import { usePageMeta } from '../hooks/usePageMeta';

export default function PhotoCredits() {
  usePageMeta('Photo Credits', 'Sources and licences for the photography used on this site.');
  const wiki = PHOTO_CREDITS.filter((c) => c.source === 'Wikimedia Commons');
  const unsplash = PHOTO_CREDITS.filter((c) => c.source === 'Unsplash');
  return (
    <>
      <PageHeader title="Photo Credits" subtitle="Thank you to the photographers whose work appears on this site." crumbs={[{ label: 'Home', to: '/' }, { label: 'Photo Credits' }]} />
      <section className="container max-w-3xl pb-20">
        <h2 className="mt-4 text-2xl">Wikimedia Commons</h2>
        <p className="mt-2 text-sm text-muted">Used under the Creative Commons licence shown for each image. Follow the link for full licence terms.</p>
        <ul className="mt-5 grid gap-3">
          {wiki.map((c) => (
            <li key={c.url} className="flex gap-4 rounded-xl border border-line p-3 text-sm">
              <img src={c.url} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-16 w-16 shrink-0 rounded-md object-cover" />
              <div className="min-w-0">
                <a href={c.page} target="_blank" rel="noopener noreferrer" className="break-words font-medium text-forest underline">{c.title}</a>
                <p className="text-muted">{c.artist ? `By ${c.artist} · ` : ''}{c.license}</p>
              </div>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-2xl">Unsplash</h2>
        <p className="mt-2 text-sm text-muted">Used under the Unsplash License.</p>
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {unsplash.map((c) => (
            <li key={c.url}>
              <a href={c.page} target="_blank" rel="noopener noreferrer" aria-label="View photo on Unsplash">
                <img src={c.url} alt="" loading="lazy" referrerPolicy="no-referrer" className="aspect-square w-full rounded-md object-cover" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
