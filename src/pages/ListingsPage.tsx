import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { FilterPanel } from '../components/listings/FilterPanel';
import { ListingCard } from '../components/listings/ListingCard';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { useApp } from '../context/AppContext';
import { DEFAULT_FILTERS, SAMPLE_LISTING_LABEL } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ListingFilters, RoomType } from '../types';
import { getNearestCollegeDistance } from '../utils/format';

export function ListingsPage() {
  useDocumentTitle(
    'Browse Hostels & PGs in Dehradun',
    'Filter and compare student hostels and PGs across Bidholi, Premnagar, Clement Town, Rajpur Road, and other Dehradun areas.'
  );

  const { listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<ListingFilters>(() => {
    const collegeParam = searchParams.get('college');
    const areaParam = searchParams.get('area');
    const budgetParam = searchParams.get('budget');
    const roomParam = searchParams.get('room');
    return {
      ...DEFAULT_FILTERS,
      college: collegeParam || 'All',
      area: areaParam || 'All',
      budgetMax: budgetParam ? Math.min(15000, Math.max(4000, Number(budgetParam))) : DEFAULT_FILTERS.budgetMax,
      roomType: (roomParam as RoomType) || 'All',
    };
  });

  // Brief initial skeleton demonstration for smooth perceived load
  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.budgetMax < DEFAULT_FILTERS.budgetMax) count++;
    if (filters.type !== 'All') count++;
    if (filters.gender !== 'All') count++;
    if (filters.roomType !== 'All') count++;
    if (filters.food !== 'All') count++;
    if (filters.college !== 'All') count++;
    if (filters.maxDistanceKm < DEFAULT_FILTERS.maxDistanceKm) count++;
    if (filters.area !== 'All') count++;
    count += filters.facilities.length;
    return count;
  }, [filters]);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  };

  const filteredListings = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const matched = listings.filter((item) => {
      if (q) {
        const hay = `${item.name} ${item.area} ${item.addressHint} ${item.nearbyColleges
          .map((c) => c.college)
          .join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (item.monthlyRent > filters.budgetMax) return false;
      if (filters.type !== 'All' && item.type !== filters.type) return false;
      if (filters.gender !== 'All' && item.gender !== filters.gender) return false;
      if (filters.roomType !== 'All' && !item.roomTypes.includes(filters.roomType)) {
        return false;
      }
      if (filters.food !== 'All' && item.foodIncluded !== filters.food) return false;
      if (filters.area !== 'All' && item.area !== filters.area) return false;

      if (filters.facilities.length > 0) {
        const hasAll = filters.facilities.every((f) => item.facilities.includes(f));
        if (!hasAll) return false;
      }

      if (filters.college !== 'All') {
        const colMatch = item.nearbyColleges.find((c) => c.college === filters.college);
        if (!colMatch) return false;
        if (colMatch.distanceKm > filters.maxDistanceKm) return false;
      } else if (filters.maxDistanceKm < DEFAULT_FILTERS.maxDistanceKm) {
        const nearest = getNearestCollegeDistance(item);
        if (!nearest || nearest.distanceKm > filters.maxDistanceKm) return false;
      }

      return true;
    });

    return [...matched].sort((a, b) => {
      switch (filters.sortBy) {
        case 'rent_asc':
          return a.monthlyRent - b.monthlyRent;
        case 'rent_desc':
          return b.monthlyRent - a.monthlyRent;
        case 'distance_asc': {
          const da = getNearestCollegeDistance(a, filters.college)?.distanceKm ?? 99;
          const db = getNearestCollegeDistance(b, filters.college)?.distanceKm ?? 99;
          return da - db;
        }
        case 'updated_desc':
          return b.lastUpdated.localeCompare(a.lastUpdated);
        default:
          return 0;
      }
    });
  }, [listings, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Hostels & PGs in Dehradun
          </h1>
          <p className="text-sm text-slate-600">
            {SAMPLE_LISTING_LABEL}. Select up to 3 options to compare side by side.
          </p>
        </div>

        {/* Controls: Mobile Filter Trigger + Sort + Grid/List Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
          </button>

          <label className="sr-only" htmlFor="sort-listings">
            Sort listings
          </label>
          <select
            id="sort-listings"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as ListingFilters['sortBy'],
              }))
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
          >
            <option value="rent_asc">Sort: Rent (Low to High)</option>
            <option value="rent_desc">Sort: Rent (High to Low)</option>
            <option value="distance_asc">Sort: Nearest to College</option>
            <option value="updated_desc">Sort: Recently Updated</option>
          </select>

          <div
            role="group"
            aria-label="View layout"
            className="hidden sm:inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              aria-label="List view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            activeCount={activeFilterCount}
          />
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <p className="tabular-nums">
              Showing <strong className="text-slate-900">{filteredListings.length}</strong> of{' '}
              {listings.length} sample listings
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-950"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-1/3 bg-slate-200 rounded" />
                    <div className="h-5 w-3/4 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="h-9 w-full bg-slate-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                No sample listings match these exact filters
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Try increasing your monthly budget range, widening the distance from college, or
                clearing a few facility filters. You can also share your requirements in our
                early-access pilot so we prioritize listings in your area.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset all filters</span>
                </button>
                <Link
                  to="/pilot"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Register your requirements
                </Link>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === 'list'
                  ? 'flex flex-col gap-5'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-6'
              }
            >
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  viewMode={viewMode}
                  selectedCollege={filters.college}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/50 flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filter listings"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <span className="font-display font-bold text-slate-900">Filter Hostels & PGs</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 -mr-2 text-slate-600 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleReset}
                activeCount={activeFilterCount}
              />
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg tabular-nums"
              >
                Show {filteredListings.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
