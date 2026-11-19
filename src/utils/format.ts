import { FacilityKey, Listing } from '../types';
import { FACILITY_OPTIONS } from '../data/constants';

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDateShort(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export function getFacilityLabel(key: FacilityKey): string {
  return FACILITY_OPTIONS.find((f) => f.key === key)?.label ?? key;
}

export function getNearestCollegeDistance(
  listing: Listing,
  selectedCollege?: string
): { college: string; distanceKm: number; commuteNote: string } | null {
  if (!listing.nearbyColleges.length) return null;
  if (selectedCollege && selectedCollege !== 'All' && selectedCollege !== 'Other') {
    const exact = listing.nearbyColleges.find((c) => c.college === selectedCollege);
    if (exact) return exact;
  }
  return [...listing.nearbyColleges].sort((a, b) => a.distanceKm - b.distanceKm)[0];
}
