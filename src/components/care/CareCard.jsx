import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { EditorialScene } from '../art/scenes';

export function DifficultyTag({ level }) {
  const cls = level === 'Beginner' ? 'bg-mist text-forest' : 'bg-[#F3EBDD] text-[#7A5B2E]';
  return <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{level}</span>;
}

export default function CareCard({ guide }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-line/70 transition hover:shadow-lift">
      <Link to={`/plant-care/${guide.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
        <EditorialScene kind={guide.image} label={guide.title} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <DifficultyTag level={guide.difficulty} />
          <span>{guide.topic}</span>
          <span className="ml-auto inline-flex items-center gap-1"><Clock size={12} /> {guide.minutes} min</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link to={`/plant-care/${guide.slug}`} className="hover:text-botanical">{guide.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{guide.summary}</p>
        <Link to={`/plant-care/${guide.slug}`} className="mt-4 text-sm font-medium text-forest underline-offset-4 hover:underline" aria-label={`Read guide: ${guide.title}`}>
          Read guide →
        </Link>
      </div>
    </article>
  );
}
