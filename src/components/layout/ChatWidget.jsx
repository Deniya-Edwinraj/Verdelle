import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, PackageSearch, Stethoscope, X } from 'lucide-react';
import { SITE } from '../../data/site';
import { useUI } from '../../context/UIContext';

const HIDDEN_ON = ['/checkout'];
const QUICK = ['Which plant suits a dark room?', 'Is this plant safe for my cat?', 'My leaves are turning yellow', 'Where is my order?'];

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2 22l5.1-1.53A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.03.9.92-2.95-.2-.31a8.2 8.2 0 1 1 6.8 3.69Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02c0 1.19.87 2.34.99 2.5.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

/** Floating "Ask a plant expert" button with WhatsApp, Plant Doctor and email options. */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { cartOpen } = useUI();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (HIDDEN_ON.includes(pathname) || cartOpen) return null;
  const wa = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <div className="fixed bottom-20 right-4 z-[65] flex flex-col items-end sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2rem))] animate-fade-up overflow-hidden rounded-[26px] bg-warm shadow-[0_30px_60px_-18px_rgba(11,36,24,0.5)] ring-1 ring-line/70" role="dialog" aria-label="Ask a plant expert">
          <div className="relative isolate overflow-hidden bg-forest-900 p-5 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 -z-10 h-40 w-40 rounded-full bg-botanical/60 blur-2xl" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sage-soft to-sage font-serif text-lg font-semibold text-forest-900">
                  V
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#4ADE80] ring-2 ring-forest-900" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-serif text-lg leading-tight">Ask a plant expert</p>
                  <p className="text-xs text-white/65">{SITE.hours}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Close chat">
                <X size={15} />
              </button>
            </div>
            <p className="mt-4 rounded-2xl rounded-tl-sm bg-white/10 p-3 text-sm leading-relaxed text-white/90">Hi there 🌿 How can we help your plants today? Pick a question or message us directly.</p>
          </div>

          <div className="p-4">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Quick questions</p>
            <ul className="flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <li key={q}>
                  <a href={wa(q)} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-white px-3 py-1.5 text-xs text-ink/80 ring-1 ring-line/70 transition hover:bg-forest hover:text-white hover:ring-forest">
                    {q}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2">
              <a href={wa('Hi Verdelle! I have a question about my plants.')} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl bg-[#25D366] p-3 text-white transition hover:brightness-95">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
                  <WhatsAppIcon />
                </span>
                <span className="flex-1 text-sm font-semibold">Chat on WhatsApp</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
              {[
                [Stethoscope, 'Diagnose a plant problem', '/plant-doctor'],
                [PackageSearch, 'Track an order', '/track-order'],
              ].map(([Icon, t, to]) => (
                <Link key={to} to={to} className="group flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line/70 transition hover:ring-sage">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-forest">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink">{t}</span>
                  <ArrowRight size={15} className="text-forest transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
              <a href={`mailto:${SITE.email}`} className="flex items-center justify-center gap-2 pt-1 text-xs font-medium text-muted hover:text-forest">
                <Mail size={13} /> or email {SITE.email}
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Ask a plant expert'}
        className="group flex h-14 items-center gap-2 rounded-full bg-forest pl-4 pr-5 text-white shadow-float ring-4 ring-white/70 transition hover:-translate-y-0.5 hover:bg-botanical"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden text-sm font-semibold sm:inline">{open ? 'Close' : 'Ask an expert'}</span>
      </button>
    </div>
  );
}
