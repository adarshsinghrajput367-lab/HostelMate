import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Scale, Trash2 } from 'lucide-react';
import { CompareTable } from '../components/listings/CompareTable';
import { ContactProviderModal } from '../components/listings/ContactProviderModal';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { useApp } from '../context/AppContext';
import { DEHRADUN_COLLEGES } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Listing } from '../types';
import { formatINR } from '../utils/format';

export function ComparePage() {
  useDocumentTitle(
    'Compare Hostels & PGs Side by Side',
    'Compare up to 3 Dehradun hostels or PGs across rent, deposit, first-month cost, food, rules, facilities, and college distance.'
  );

  const { listings, compareIds, toggleCompare, clearCompare } = useApp();
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [contactListing, setContactListing] = useState<Listing | null>(null);

  const comparedListings = compareIds
    .map((id) => listings.find((l) => l.id === id))
    .filter((l): l is Listing => Boolean(l));

  const availableToAdd = listings.filter((l) => !compareIds.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Compare Side by Side
          </h1>
          <p className="text-sm text-slate-600">
            Compare up to 3 hostels or PGs across monthly rent, first-month outlay, food, rules,
            and college distance.
          </p>
        </div>

        {comparedListings.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="compare-college"
                className="text-xs font-semibold text-slate-600 whitespace-nowrap"
              >
                Measure distance to:
              </label>
              <select
                id="compare-college"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-teal-700 focus:outline-none"
              >
                <option value="All">Nearest listed college</option>
                {DEHRADUN_COLLEGES.filter((c) => c !== 'Other').map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {comparedListings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            No listings selected for comparison yet
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Check the &ldquo;Compare&rdquo; box on 2 or 3 hostel/PG cards while browsing, or pick
            sample listings below to test the side-by-side comparison table immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/listings"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <span>Browse Hostels & PGs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <CompareTable
            items={comparedListings}
            selectedCollege={selectedCollege}
            onContact={(l) => setContactListing(l)}
          />
          <p className="text-xs text-slate-500">
            Tip: On mobile screens, scroll the comparison table horizontally—the first column stays
            pinned for easy reading.
          </p>
        </>
      )}

      {/* Quick Add Strip when < 3 listings */}
      {comparedListings.length < 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Add {comparedListings.length === 0 ? 'listings' : 'another listing'} to compare (
              {comparedListings.length}/3)
            </h2>
            <Link to="/listings" className="text-xs font-semibold text-teal-800 hover:underline">
              Browse all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableToAdd.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCompare(item.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-700 hover:bg-teal-50/30 text-left transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {item.area} · {formatINR(item.monthlyRent)}/mo · {item.gender}
                  </p>
                </div>
                <span className="w-7 h-7 rounded-md bg-slate-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <DisclaimerBanner compact />

      <ContactProviderModal
        listing={contactListing}
        onClose={() => setContactListing(null)}
      />
    </div>
  );
}
