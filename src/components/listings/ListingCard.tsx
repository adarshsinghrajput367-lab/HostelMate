import { Link } from 'react-router-dom';
import { Check, Heart, MapPin, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Listing } from '../../types';
import {
  formatDateShort,
  formatINR,
  getFacilityLabel,
  getNearestCollegeDistance,
} from '../../utils/format';
import { InformationStatusBadge } from '../ui/Badge';
import { SafeImage } from '../ui/SafeImage';
import { FacilityIcon } from './FacilityIcon';

interface ListingCardProps {
  listing: Listing;
  viewMode?: 'grid' | 'list';
  selectedCollege?: string;
}

export function ListingCard({
  listing,
  viewMode = 'grid',
  selectedCollege,
}: ListingCardProps) {
  const { isShortlisted, toggleShortlist, isCompared, toggleCompare } = useApp();
  const shortlisted = isShortlisted(listing.id);
  const compared = isCompared(listing.id);
  const nearest = getNearestCollegeDistance(listing, selectedCollege);

  const isList = viewMode === 'list';

  return (
    <article
      className={`group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden flex ${
        isList ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      {/* Image */}
      <Link
        to={`/listings/${listing.id}`}
        className={`relative block overflow-hidden bg-slate-100 shrink-0 ${
          isList ? 'w-full md:w-72 aspect-[4/3] md:aspect-auto md:min-h-[240px]' : 'aspect-[4/3] w-full'
        }`}
      >
        <SafeImage
          src={listing.images[0]}
          alt={`${listing.name} in ${listing.area}, Dehradun`}
          fallbackLabel={`${listing.name} · ${listing.area}`}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleShortlist(listing.id);
          }}
          aria-label={shortlisted ? `Remove ${listing.name} from shortlist` : `Add ${listing.name} to shortlist`}
          aria-pressed={shortlisted}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-teal-700 ${
            shortlisted
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-white/95 text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          {/* Quiet unboxed metadata kicker */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <span>{listing.type}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{listing.gender}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{listing.area}</span>
            </div>
            <InformationStatusBadge status={listing.informationStatus} compact />
          </div>

          {/* Title & Pricing */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={`/listings/${listing.id}`}
                className="block font-display text-lg font-bold text-slate-900 hover:text-teal-800 transition-colors leading-snug"
              >
                {listing.name}
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                Rooms: {listing.roomTypes.join(', ')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-lg font-bold text-slate-900 tabular-nums">
                {formatINR(listing.monthlyRent)}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </p>
              <p className="text-xs text-slate-500 tabular-nums">
                Deposit {formatINR(listing.securityDeposit)}
              </p>
            </div>
          </div>

          {/* Distance & Food */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            {nearest && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  <strong className="font-semibold text-slate-800 tabular-nums">
                    ~{nearest.distanceKm} km
                  </strong>{' '}
                  from {nearest.college}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Utensils className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
              <span>
                Food:{' '}
                <strong className="font-semibold text-slate-800">
                  {listing.foodIncluded}
                </strong>
              </span>
            </div>
          </div>

          {/* Facilities inline chips (clean, restrained) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
            {listing.facilities.slice(0, isList ? 6 : 4).map((fac) => (
              <span key={fac} className="inline-flex items-center gap-1">
                <FacilityIcon facility={fac} className="w-3.5 h-3.5 text-slate-500" />
                <span>{getFacilityLabel(fac)}</span>
              </span>
            ))}
            {listing.facilities.length > (isList ? 6 : 4) && (
              <span className="text-slate-500">
                +{listing.facilities.length - (isList ? 6 : 4)} more
              </span>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 hover:text-slate-900">
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  compared
                    ? 'bg-teal-700 border-teal-700 text-white'
                    : 'bg-white border-slate-300'
                }`}
              >
                {compared && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <input
                type="checkbox"
                checked={compared}
                onChange={() => toggleCompare(listing.id)}
                className="sr-only"
              />
              <span>Compare</span>
            </label>
            <span className="text-[11px] text-slate-400 hidden sm:inline tabular-nums">
              Updated {formatDateShort(listing.lastUpdated)}
            </span>
          </div>

          <Link
            to={`/listings/${listing.id}`}
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
