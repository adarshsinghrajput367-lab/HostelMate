import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none no-print"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.tone === 'success'
            ? CheckCircle2
            : toast.tone === 'warning'
            ? AlertCircle
            : Info;

        const toneClasses =
          toast.tone === 'success'
            ? 'bg-slate-900 text-white border-slate-800'
            : toast.tone === 'warning'
            ? 'bg-amber-950 text-amber-50 border-amber-800'
            : 'bg-slate-900 text-white border-slate-800';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm transition-all duration-150 ${toneClasses}`}
          >
            <Icon className="w-4 h-4 shrink-0 text-teal-400" aria-hidden="true" />
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
