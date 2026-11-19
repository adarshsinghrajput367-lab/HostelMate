import { Link } from 'react-router-dom';
import { Check, Heart, Phone, X } from 'lucide-react';
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

interface CompareTableProps {
  items: Listing[];
  selectedCollege: string;
  onContact: (listing: Listing) => void;
}

export function CompareTable({
  items,
  selectedCollege,
  onContact,
}: CompareTableProps) {
  const { removeCompare, isShortlisted, toggleShortlist } = useApp();

  if (!items.length) return null;

  const lowestRent = Math.min(...items.map((i) => i.monthlyRent));
  const lowestFirstMonth = Math.min(
    ...items.map((i) => i.monthlyRent + i.securityDeposit)
  );
  const maxFacilities = Math.max(...items.map((i) => i.facilities.length));

  const distances = items.map(
    (item) => getNearestCollegeDistance(item, selectedCollege)?.distanceKm ?? Infinity
  );
  const nearestDistance = Math.min(...distances);

  const highlightCell = 'bg-teal-50/60 text-teal-950 font-semibold';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-slate-50 px-5 py-4 w-48 text-xs font-semibold text-slate-600 align-bottom border-r border-slate-200"
              >
                Comparison Factor
              </th>
              {items.map((item) => {
                const saved = isShortlisted(item.id);
                return (
                  <th
                    key={item.id}
                    scope="col"
                    className="px-5 py-4 align-top min-w-[230px]"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                        <SafeImage
                          src={item.images[0]}
                          alt={`${item.name} in ${item.area}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeCompare(item.id)}
                          aria-label={`Remove ${item.name} from comparison`}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-sm transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {item.type} · {item.gender} · {item.area}
                        </p>
                        <Link
                          to={`/listings/${item.id}`}
                          className="font-display text-base font-bold text-slate-900 hover:text-teal-800 transition-colors block mt-0.5"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleShortlist(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            saved
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                          <span>{saved ? 'Shortlisted' : 'Shortlist'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onContact(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {/* Monthly Rent */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Monthly Rent
              </th>
              {items.map((item) => {
                const isBest = items.length > 1 && item.monthlyRent === lowestRent;
                return (
                  <td
                    key={item.id}
                    className={`px-5 py-4 tabular-nums ${isBest ? highlightCell : 'text-slate-900'}`}
                  >
                    <div className="text-base font-bold">{formatINR(item.monthlyRent)} / mo</div>
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 mt-0.5">
                        <Check className="w-3 h-3" /> Lowest rent
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Security Deposit */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Security Deposit
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4 text-slate-800 tabular-nums">
                  {formatINR(item.securityDeposit)}
                </td>
              ))}
            </tr>

            {/* Estimated First-Month Cost */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Estimated 1st-Month Cost
                <span className="block font-normal text-[11px] text-slate-500 mt-0.5">
                  Rent + security deposit
                </span>
              </th>
              {items.map((item) => {
                const total = item.monthlyRent + item.securityDeposit;
                const isBest = items.length > 1 && total === lowestFirstMonth;
                return (
                  <td
                    key={item.id}
                    className={`px-5 py-4 tabular-nums ${isBest ? highlightCell : 'text-slate-900'}`}
                  >
                    <div className="font-semibold">{formatINR(total)}</div>
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 mt-0.5">
                        <Check className="w-3 h-3" /> Lowest move-in outlay
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Distance to Selected College */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Distance to College
              </th>
              {items.map((item, idx) => {
                const dist = getNearestCollegeDistance(item, selectedCollege);
                const isBest =
                  items.length > 1 &&
                  distances[idx] === nearestDistance &&
                  Number.isFinite(nearestDistance);
                return (
                  <td
                    key={item.id}
                    className={`px-5 py-4 ${isBest ? highlightCell : 'text-slate-800'}`}
                  >
                    {dist ? (
                      <div>
                        <div className="tabular-nums font-semibold">
                          ~{dist.distanceKm} km · {dist.college}
                        </div>
                        <div className="text-xs text-slate-600 font-normal mt-0.5">
                          {dist.commuteNote}
                        </div>
                        {isBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 mt-1">
                            <Check className="w-3 h-3" /> Nearest option
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">Not listed</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Food */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Food / Mess
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4 text-slate-800 align-top">
                  <div className="font-semibold text-slate-900">{item.foodIncluded}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.foodDetails}
                  </p>
                </td>
              ))}
            </tr>

            {/* Room Types */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Room Types
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4 text-slate-800">
                  {item.roomTypes.join(', ')}
                </td>
              ))}
            </tr>

            {/* Facilities */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Facilities
              </th>
              {items.map((item) => {
                const isBest =
                  items.length > 1 && item.facilities.length === maxFacilities;
                return (
                  <td
                    key={item.id}
                    className={`px-5 py-4 align-top ${isBest ? 'bg-teal-50/40' : ''}`}
                  >
                    <div className="text-xs font-semibold text-slate-800 mb-1.5 tabular-nums">
                      {item.facilities.length} listed
                      {isBest && (
                        <span className="text-teal-800 font-medium ml-1.5">
                          · Most facilities
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.facilities.map(getFacilityLabel).join(', ')}
                    </p>
                  </td>
                );
              })}
            </tr>

            {/* House Rules */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                House Rules & Notice
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4 text-xs text-slate-700 space-y-1.5 align-top">
                  <p>
                    <strong className="text-slate-900">Curfew:</strong> {item.rules.curfew}
                  </p>
                  <p>
                    <strong className="text-slate-900">Visitors:</strong> {item.rules.visitors}
                  </p>
                  <p>
                    <strong className="text-slate-900">Notice:</strong> {item.rules.noticePeriod}
                  </p>
                </td>
              ))}
            </tr>

            {/* Last Updated */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Last Updated
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4 text-xs text-slate-700 tabular-nums">
                  {formatDateShort(item.lastUpdated)}
                </td>
              ))}
            </tr>

            {/* Information Status */}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold text-slate-700 border-r border-slate-200"
              >
                Information Status
              </th>
              {items.map((item) => (
                <td key={item.id} className="px-5 py-4">
                  <InformationStatusBadge status={item.informationStatus} />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.informationSource}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
