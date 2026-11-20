import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback(
    (message, { type = 'success', action } = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t.slice(-2), { id, message, type, action }]);
      setTimeout(() => dismiss(id), 3200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-36 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-24 sm:items-end sm:pr-6">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-lg bg-forest px-4 py-3 text-sm text-white shadow-lift">
            {t.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-mist" /> : <Info size={18} className="shrink-0 text-mist" />}
            <span className="flex-1">{t.message}</span>
            {t.action}
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="rounded p-0.5 text-white/70 hover:text-white">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
