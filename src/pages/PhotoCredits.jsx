import { Camera, ExternalLink, Images, Scale } from 'lucide-react';
import { PageHero } from '../components/ui';
import { PHOTO_CREDITS } from '../data/assets';
import { usePageMeta } from '../hooks/usePageMeta';

function SectionHead({ eyebrow, lead, accent, body, count }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-botanical">
          <span aria-hidden="true" className="h-px w-10 bg-botanical/60" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[38px]">
          {lead} <em className="font-normal italic text-botanical">{accent}</em>
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{body}</p>
      </div>
      <span className="w-fit shrink-0 rounded-full bg-mist/70 px-4 py-1.5 text-xs font-semibold text-forest">
        {count} {count === 1 ? 'photo' : 'photos'}
      </span>
    </div>
  );
}

export default function PhotoCredits() {
  usePageMeta('Photo Credits', 'Sources and licences for the photography used on this site.');
  const wiki = PHOTO_CREDITS.filter((c) => c.source === 'Wikimedia Commons');
  const unsplash = PHOTO_CREDITS.filter((c) => c.source === 'Unsplash');

  return (
    <>
      <PageHero
        eyebrow="With gratitude"
        title="Photo Credits"
        subtitle="Thank you to the photographers whose work appears on this site."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Photo Credits' }]}
        plants={['fiddle', 'calathea']}
      />

      {/* Summary */}
      <section className="container relative z-10 -mt-16 md:-mt-24">
        <ul className="grid grid-cols-3 divide-x divide-line/80 rounded-[28px] bg-white/90 p-4 shadow-lift ring-1 ring-white/60 backdrop-blur-xl md:p-5">
          {[
            [Images, 'Total photos', PHOTO_CREDITS.length],
            [Scale, 'Wikimedia Commons', wiki.length],
            [Camera, 'Unsplash', unsplash.length],
          ].map(([Icon, label, value]) => (
            <li key={label} className="flex items-center gap-3 px-2 sm:px-5">
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-forest sm:grid">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
                <span className="mt-0.5 block font-serif text-2xl font-semibold text-forest">{value}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Wikimedia */}
      {wiki.length > 0 && (
        <section className="container py-14 md:py-20">
          <SectionHead
            eyebrow="Wikimedia Commons"
            lead="Creative Commons"
            accent="collection"
            body="Used under the Creative Commons licence shown for each image. Follow the link for full licence terms."
            count={wiki.length}
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {wiki.map((c) => (
              <li key={c.url}>
                <a
                  href={c.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-center gap-4 rounded-[22px] bg-white p-3 pr-5 shadow-soft ring-1 ring-line/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-sage-soft"
                >
                  <span className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-card">
                    <img
                      src={c.url}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 break-words text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-forest" title={c.title}>
                      {c.title}
                    </span>
                    {c.artist && <span className="mt-1 block truncate text-xs text-muted">By {c.artist}</span>}
                    <span className="mt-2 inline-block rounded-full bg-mist/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest">{c.license}</span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-forest transition group-hover:bg-forest group-hover:text-white">
                    <ExternalLink size={15} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Unsplash */}
      {unsplash.length > 0 && (
        <section className="relative overflow-hidden bg-mist/40 py-14 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-white/70 blur-3xl" />
          <div className="container relative">
            <SectionHead eyebrow="Unsplash" lead="Gallery of" accent="contributions" body="Used under the Unsplash License. Select any photo to view it on Unsplash." count={unsplash.length} />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
              {unsplash.map((c, i) => (
                <li key={c.url} className={i % 7 === 0 ? 'col-span-2 row-span-2' : ''}>
                  <a
                    href={c.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View photo on Unsplash (opens in a new tab)"
                    className="group relative block h-full overflow-hidden rounded-[20px] shadow-soft ring-1 ring-black/5"
                  >
                    <img
                      src={c.url}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/75 via-forest-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between text-xs font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      View on Unsplash
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur-md">
                        <ExternalLink size={13} />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Closing note */}
      <section className="container py-14 md:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-mist text-forest">
            <Camera size={22} strokeWidth={1.6} />
          </span>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink md:text-[28px]">
            Every image tells a <em className="italic text-botanical">green story</em> — thank you for sharing yours.
          </p>
        </div>
      </section>
    </>
  );
}
