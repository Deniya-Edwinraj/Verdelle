import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { EditorialScene } from '../art/scenes';

export function DifficultyTag({ level }) {
  const cls = level === 'Beginner' ? 'bg-mist text-forest' : 'bg-[#F3EBDD] text-[#7A5B2E]';
  return <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{level}</span>;
}

export default function CareCard({ guide }) {
  const beginner = guide.difficulty === 'Beginner';
  return (
    <article className="group relative flex h-full flex-col rounded-[28px] bg-white p-2.5 shadow-soft ring-1 ring-line/70 transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lift">
      {/* Inset image */}
      <Link to={`/plant-care/${guide.slug}`} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden rounded-[20px]">
        <EditorialScene kind={guide.image} label={guide.title} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/35 via-transparent to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-md ${
            beginner ? 'bg-white/85 text-forest' : 'bg-[#F3EBDD]/90 text-[#7A5B2E]'
          }`}
        >
          {guide.difficulty}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-forest-900/45 px-3 py-1 text-[11px] font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
          <Clock size={12} /> {guide.minutes} min read
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-botanical">
          <span aria-hidden="true" className="h-px w-5 bg-botanical/50" />
          {guide.topic}
        </p>
        <h3 className="mt-2.5 text-xl font-semibold leading-snug tracking-tight">
          <Link to={`/plant-care/${guide.slug}`} className="transition-colors hover:text-botanical">
            {guide.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{guide.summary}</p>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <Link to={`/plant-care/${guide.slug}`} className="text-sm font-medium text-forest" aria-label={`Read guide: ${guide.title}`}>
            Read guide
          </Link>
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-full bg-mist text-forest transition duration-300 group-hover:rotate-45 group-hover:bg-forest group-hover:text-white"
          >
            <ArrowUpRight size={18} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </article>
  );
}
