import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Copy,
  Heart,
  Phone,
  Scale,
  Share2,
  Trash2,
} from 'lucide-react';
import { ContactProviderModal } from '../components/listings/ContactProviderModal';
import { InformationStatusBadge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { Modal } from '../components/ui/Modal';
import { SafeImage } from '../components/ui/SafeImage';
import { useApp } from '../context/AppContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Listing } from '../types';
import { formatINR, getNearestCollegeDistance } from '../utils/format';

export function ShortlistPage() {
  useDocumentTitle(
    'My Shortlist',
    'Review your saved Dehradun hostels and PGs, add personal notes, compare options, and share your shortlist with parents.'
  );

  const navigate = useNavigate();
  const {
    listings,
    shortlist,
    toggleShortlist,
    updateShortlistNote,
    setCompareIdsDirect,
    showToast,
  } = useApp();

  const [shareOpen, setShareOpen] = useState(false);
  const [contactListing, setContactListing] = useState<Listing | null>(null);

  const savedEntries = shortlist
    .map((item) => {
      const listing = listings.find((l) => l.id === item.listingId);
      return listing ? { ...item, listing } : null;
    })
    .filter((x): x is { listingId: string; note: string; addedAt: string; listing: Listing } =>
      Boolean(x)
    );

  const buildShareSummary = () => {
    const lines = [
      'HostelMate Dehradun — My Shortlisted Options (Pilot Sample Data)',
      '--------------------------------------------------',
      ...savedEntries.map((entry, idx) => {
        const nearest = getNearestCollegeDistance(entry.listing);
        const parts = [
          `${idx + 1}. ${entry.listing.name} (${entry.listing.type}, ${entry.listing.gender})`,
          `   Area: ${entry.listing.area} | Rent: ${formatINR(entry.listing.monthlyRent)}/mo | Deposit: ${formatINR(entry.listing.securityDeposit)}`,
          `   Food: ${entry.listing.foodIncluded} | Rooms: ${entry.listing.roomTypes.join(', ')}`,
          nearest ? `   Distance: ~${nearest.distanceKm} km from ${nearest.college}` : '',
          entry.note.trim() ? `   My note: ${entry.note.trim()}` : '',
        ].filter(Boolean);
        return parts.join('\n');
      }),
      '',
      'Note: Please confirm rent, deposit, availability, and rules directly with the provider before paying anything.',
    ];
    return lines.join('\n');
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(buildShareSummary());
      showToast('Shortlist summary copied—ready to paste on WhatsApp!', 'success');
    } catch {
      showToast('Could not access clipboard automatically. Please copy from the box.', 'warning');
    }
  };

  const handleQuickCompare = () => {
    const ids = savedEntries.slice(0, 3).map((e) => e.listingId);
    setCompareIdsDirect(ids);
    navigate('/compare');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            My Shortlist ({savedEntries.length})
          </h1>
          <p className="text-sm text-slate-600">
            Keep track of promising hostels and PGs, jot down questions from phone calls, and share
            your list with family.
          </p>
        </div>

        {savedEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {savedEntries.length >= 2 && (
              <button
                type="button"
                onClick={handleQuickCompare}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Compare top {Math.min(savedEntries.length, 3)}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share my shortlist</span>
            </button>
          </div>
        )}
      </div>

      {savedEntries.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Your shortlist is empty
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Tap the heart icon on any Dehradun hostel or PG while browsing to save it here with
            your own notes.
          </p>
          <div className="pt-2">
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
        <div className="space-y-5">
          {savedEntries.map(({ listing, note }) => {
            const nearest = getNearestCollegeDistance(listing);
            return (
              <article
                key={listing.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12"
              >
                <Link
                  to={`/listings/${listing.id}`}
                  className="md:col-span-3 aspect-[4/3] md:aspect-auto bg-slate-100 block"
                >
                  <SafeImage
                    src={listing.images[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="md:col-span-9 p-5 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{listing.type}</span>
                        <span>·</span>
                        <span>{listing.gender}</span>
                        <span>·</span>
                        <span>{listing.area}</span>
                        <InformationStatusBadge status={listing.informationStatus} compact />
                      </div>
                      <Link
                        to={`/listings/${listing.id}`}
                        className="font-display text-lg font-bold text-slate-900 hover:text-teal-800 transition-colors block"
                      >
                        {listing.name}
                      </Link>
                      <p className="text-xs text-slate-600">
                        Food: {listing.foodIncluded} · Rooms: {listing.roomTypes.join(', ')}
                        {nearest && ` · ~${nearest.distanceKm} km from ${nearest.college}`}
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <p className="font-display text-xl font-bold text-slate-900 tabular-nums">
                        {formatINR(listing.monthlyRent)}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        Deposit {formatINR(listing.securityDeposit)}
                      </p>
                    </div>
                  </div>

                  {/* Personal Note Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`note-${listing.id}`}
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Personal note (saved automatically in your browser)
                    </label>
                    <textarea
                      id={`note-${listing.id}`}
                      rows={2}
                      value={note}
                      onChange={(e) => updateShortlistNote(listing.id, e.target.value)}
                      placeholder="e.g. Asked about winter geyser timings, schedule visit with parents on Sunday..."
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleShortlist(listing.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from shortlist</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setContactListing(listing)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contact</span>
                      </button>
                      <Link
                        to={`/listings/${listing.id}`}
                        className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <DisclaimerBanner compact />

      {/* Share Shortlist Modal */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share your shortlist"
        description="Copy this formatted summary to send to parents or friends on WhatsApp."
      >
        <div className="space-y-4">
          <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 max-h-72 overflow-y-auto leading-relaxed">
            {buildShareSummary()}
          </pre>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
            >
              <Copy className="w-4 h-4" />
              <span>Copy text summary</span>
            </button>
          </div>
        </div>
      </Modal>

      <ContactProviderModal
        listing={contactListing}
        onClose={() => setContactListing(null)}
      />
    </div>
  );
}
