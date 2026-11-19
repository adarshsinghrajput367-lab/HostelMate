import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  ExternalLink,
  Heart,
  MapPin,
  Phone,
  Printer,
  Scale,
  Utensils,
} from 'lucide-react';
import { ContactProviderModal } from '../components/listings/ContactProviderModal';
import { FacilityIcon } from '../components/listings/FacilityIcon';
import { InformationStatusBadge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { SafeImage } from '../components/ui/SafeImage';
import { useApp } from '../context/AppContext';
import { PRE_DEPOSIT_CHECKLIST, SAMPLE_LISTING_LABEL } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDateShort, formatINR, getFacilityLabel } from '../utils/format';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { listings, isShortlisted, toggleShortlist, isCompared, toggleCompare } = useApp();
  const listing = listings.find((l) => l.id === id);

  useDocumentTitle(
    listing ? `${listing.name} (${listing.area})` : 'Listing Not Found',
    listing
      ? `${listing.type} for ${listing.gender} in ${listing.area}, Dehradun. Sample monthly rent ${formatINR(listing.monthlyRent)}.`
      : undefined
  );

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Listing not found
        </h1>
        <p className="text-sm text-slate-600">
          This listing may have been removed or the URL may be incorrect.
        </p>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all listings</span>
        </Link>
      </div>
    );
  }

  const shortlisted = isShortlisted(listing.id);
  const compared = isCompared(listing.id);
  const firstMonthEstimate = listing.monthlyRent + listing.securityDeposit;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${listing.coordinates.lat}&mlon=${listing.coordinates.lng}#map=15/${listing.coordinates.lat}/${listing.coordinates.lng}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-4 no-print">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dehradun listings</span>
        </Link>
        <span className="text-xs text-slate-500 tabular-nums">
          Last updated: {formatDateShort(listing.lastUpdated)}
        </span>
      </div>

      {/* Top Sample Notice */}
      {listing.informationStatus === 'sample' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs sm:text-sm text-amber-950 font-medium">
          {SAMPLE_LISTING_LABEL}. Details and phone numbers shown below are illustrative placeholders.
        </div>
      )}

      {/* Main Split: Gallery & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery + Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={listing.images[activePhotoIdx] || listing.images[0]}
                alt={`${listing.name} photo ${activePhotoIdx + 1}`}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-teal-700 ring-2 ring-teal-700/20'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${listing.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Metadata & Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span>{listing.type}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.gender}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.area}, Dehradun</span>
              </div>
              <InformationStatusBadge status={listing.informationStatus} />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {listing.name}
              </h1>
              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                <span>{listing.addressHint}</span>
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {listing.description}
            </p>

            {/* Quick Facts Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Room Types</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {listing.roomTypes.join(', ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Food Option</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {listing.foodIncluded}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Information Source</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {listing.informationSource}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {formatDateShort(listing.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Food & Facilities */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <span>Food & Meal Details ({listing.foodIncluded})</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {listing.foodDetails}
              </p>
            </div>

            <div className="pt-5 border-t border-slate-200 space-y-3">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Facilities listed
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.facilities.map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800"
                  >
                    <FacilityIcon facility={fac} className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{getFacilityLabel(fac)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              House rules & terms
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs font-semibold text-slate-500">Curfew timing</dt>
                <dd className="text-slate-900 mt-1">{listing.rules.curfew}</dd>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs font-semibold text-slate-500">Visitor policy</dt>
                <dd className="text-slate-900 mt-1">{listing.rules.visitors}</dd>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <dt className="text-xs font-semibold text-slate-500">Notice period</dt>
                <dd className="text-slate-900 mt-1">{listing.rules.noticePeriod}</dd>
              </div>
            </dl>
            {listing.rules.otherRules.length > 0 && (
              <ul className="space-y-1.5 pt-2 text-sm text-slate-700 list-disc pl-5">
                {listing.rules.otherRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Location & Distance to Colleges */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Location & approximate college distances
              </h2>
              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950"
              >
                <span>Open {listing.area} on OpenStreetMap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              {listing.nearbyColleges.map((col) => (
                <div
                  key={col.college}
                  className="px-4 py-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{col.college}</p>
                    <p className="text-xs text-slate-500">{col.commuteNote}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-teal-800 tabular-nums shrink-0">
                    ~{col.distanceKm} km
                  </span>
                </div>
              ))}
            </div>

            {/* Clean Locality Map Placeholder Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Locality pin: {listing.area}, Dehradun
                </p>
                <p className="text-xs text-slate-600 font-mono tabular-nums">
                  Approx. coordinates: {listing.coordinates.lat.toFixed(4)}° N,{' '}
                  {listing.coordinates.lng.toFixed(4)}° E (area-level sample pin)
                </p>
              </div>
              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>View Locality Map</span>
              </a>
            </div>
          </div>

          {/* Printable Pre-Deposit Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Questions to ask before paying a deposit
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Take this list when calling or visiting {listing.name} in person.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print checklist</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {PRE_DEPOSIT_CHECKLIST.map((item, index) => (
                <div key={item.id} className="py-3.5 flex items-start gap-3">
                  <span className="font-mono text-xs font-semibold text-teal-800 mt-0.5 tabular-nums">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      <span className="text-slate-500 font-normal">[{item.category}] </span>
                      {item.question}
                    </p>
                    <p className="text-xs text-slate-500">{item.whyItMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sticky Pricing & Direct Contact Card */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="space-y-1 pb-4 border-b border-slate-200">
              <p className="text-xs font-medium text-slate-500">Starting monthly rent</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formatINR(listing.monthlyRent)}
                </span>
                <span className="text-sm text-slate-500">/ month</span>
              </div>
              {listing.rentMax && (
                <p className="text-xs text-slate-500 tabular-nums">
                  Up to {formatINR(listing.rentMax)}/mo depending on room sharing
                </p>
              )}
            </div>

            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-600">Security deposit</dt>
                <dd className="font-semibold text-slate-900 tabular-nums">
                  {formatINR(listing.securityDeposit)}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <dt className="font-semibold text-slate-800">Estimated 1st-month total</dt>
                <dd className="font-bold text-teal-800 tabular-nums">
                  {formatINR(firstMonthEstimate)}
                </dd>
              </div>
            </dl>

            <div className="space-y-2.5 pt-2 no-print">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Provider</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleShortlist(listing.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                    shortlisted
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
                  <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(listing.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                    compared
                      ? 'bg-teal-50 text-teal-900 border-teal-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {compared ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Scale className="w-4 h-4" />
                  )}
                  <span>{compared ? 'In Compare' : 'Compare'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Last updated: {formatDateShort(listing.lastUpdated)}</span>
              </p>
              <p>
                Direct contact only—HostelMate does not collect bookings, token money, or rent.
              </p>
            </div>
          </div>

          <DisclaimerBanner compact />
        </aside>
      </div>

      <ContactProviderModal
        listing={contactOpen ? listing : null}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
