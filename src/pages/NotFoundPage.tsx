import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
      <p className="font-mono text-sm font-semibold text-teal-800">404</p>
      <h1 className="font-display text-3xl font-bold text-slate-900">
        We couldn&apos;t find that page
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        The link may be outdated or mistyped. Head back to the home page or browse sample hostel
        and PG listings in Dehradun.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
        >
          <Search className="w-4 h-4" />
          <span>Browse Listings</span>
        </Link>
      </div>
    </div>
  );
}
