import { SITE } from '../../data/site';
import { useToast } from '../../context/ToastContext';

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </>
  ),
  facebook: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" fill="currentColor" />,
  pinterest: <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.1-1.8 0-2.6l1.1-4.6s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.2 0 .8.3 1.7.7 2.2l-.3 1.4c-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.6-6 3.4 0 6.1 2.5 6.1 5.8 0 3.4-2.2 6.2-5.2 6.2-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A9 9 0 1 0 12 3z" fill="currentColor" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" />
      <path d="M10.2 9.3v5.4l4.6-2.7z" fill="#173F2D" />
    </>
  ),
};
const LABEL = { instagram: 'Instagram', facebook: 'Facebook', pinterest: 'Pinterest', youtube: 'YouTube' };

export default function SocialLinks({ className = '', light = false }) {
  const notify = useToast();
  const cls = `grid h-9 w-9 place-items-center rounded-full border transition ${light ? 'border-white/30 text-white hover:bg-white hover:text-forest' : 'border-line text-forest hover:bg-forest hover:text-white'}`;
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {Object.keys(ICONS).map((k) => (
        <li key={k}>
          {SITE.social[k] ? (
            <a href={SITE.social[k]} target="_blank" rel="noopener noreferrer" aria-label={`Verdelle on ${LABEL[k]}`} className={cls}>
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">{ICONS[k]}</svg>
            </a>
          ) : (
            <button type="button" className={cls} aria-label={`Verdelle on ${LABEL[k]} (link not configured)`} onClick={() => notify(`Our ${LABEL[k]} link will be added soon.`, { type: 'info' })}>
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">{ICONS[k]}</svg>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
