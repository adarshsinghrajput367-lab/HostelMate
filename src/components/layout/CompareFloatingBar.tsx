import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Scale, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function CompareFloatingBar() {
  const { compareIds, listings, clearCompare } = useApp();
  const location = useLocation();

  if (compareIds.length < 2 || location.pathname === '/compare') {
    return null;
  }

  const selectedNames = compareIds
    .map((id) => listings.find((l) => l.id === id)?.name)
    .filter(Boolean);

  return (
    <div
      role="region"
      aria-label="Compare selected listings"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl no-print"
    >
      <div className="bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-300 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold whitespace-nowrap">
              Compare ({compareIds.length}/3)
            </p>
            <p className="text-xs text-slate-300 truncate hidden sm:block">
              {selectedNames.join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            aria-label="Clear compare selection"
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
