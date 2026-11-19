import { RotateCcw, Search } from 'lucide-react';
import {
  DEHRADUN_AREAS,
  DEHRADUN_COLLEGES,
  FACILITY_OPTIONS,
  ROOM_TYPES,
} from '../../data/constants';
import {
  FacilityKey,
  FoodOption,
  GenderCategory,
  ListingFilters,
  PropertyType,
  RoomType,
} from '../../types';
import { formatINR } from '../../utils/format';

interface FilterPanelProps {
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
  onReset: () => void;
  activeCount: number;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  activeCount,
}: FilterPanelProps) {
  const update = <K extends keyof ListingFilters>(
    key: K,
    value: ListingFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleFacility = (key: FacilityKey) => {
    const exists = filters.facilities.includes(key);
    update(
      'facilities',
      exists
        ? filters.facilities.filter((f) => f !== key)
        : [...filters.facilities, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + Clear */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <h2 className="font-display text-base font-bold text-slate-900">
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Text Search */}
      <div className="space-y-1.5">
        <label htmlFor="filter-search" className="block text-xs font-semibold text-slate-700">
          Search by name or locality
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="filter-search"
            type="search"
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="e.g. Bidholi, Clement Town..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
          />
        </div>
      </div>

      {/* Max Monthly Budget Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="filter-budget" className="font-semibold text-slate-700">
            Max monthly rent
          </label>
          <span className="font-mono font-semibold text-teal-800 tabular-nums">
            Up to {formatINR(filters.budgetMax)}
          </span>
        </div>
        <input
          id="filter-budget"
          type="range"
          min={4000}
          max={15000}
          step={500}
          value={filters.budgetMax}
          onChange={(e) => update('budgetMax', Number(e.target.value))}
          className="w-full accent-teal-700 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
          <span>₹4,000</span>
          <span>₹15,000</span>
        </div>
      </div>

      {/* Nearby College */}
      <div className="space-y-1.5">
        <label htmlFor="filter-college" className="block text-xs font-semibold text-slate-700">
          Nearby college / university
        </label>
        <select
          id="filter-college"
          value={filters.college}
          onChange={(e) => update('college', e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
        >
          <option value="All">All Dehradun colleges</option>
          {DEHRADUN_COLLEGES.filter((c) => c !== 'Other').map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Max Distance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="filter-distance" className="font-semibold text-slate-700">
            Max distance to college
          </label>
          <span className="font-mono font-semibold text-teal-800 tabular-nums">
            ≤ {filters.maxDistanceKm} km
          </span>
        </div>
        <input
          id="filter-distance"
          type="range"
          min={1}
          max={15}
          step={1}
          value={filters.maxDistanceKm}
          onChange={(e) => update('maxDistanceKm', Number(e.target.value))}
          className="w-full accent-teal-700 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
          <span>1 km</span>
          <span>15 km</span>
        </div>
      </div>

      {/* Area / Locality */}
      <div className="space-y-1.5">
        <label htmlFor="filter-area" className="block text-xs font-semibold text-slate-700">
          Area / locality
        </label>
        <select
          id="filter-area"
          value={filters.area}
          onChange={(e) => update('area', e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
        >
          <option value="All">All areas</option>
          {DEHRADUN_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700">Property type</span>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Hostel', 'PG'] as (PropertyType | 'All')[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update('type', t)}
              className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filters.type === t
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700">Gender category</span>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Boys', 'Girls', 'Co-ed'] as (GenderCategory | 'All')[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update('gender', g)}
              className={`px-1.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filters.gender === g
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Room Occupancy */}
      <div className="space-y-2">
        <label htmlFor="filter-room" className="block text-xs font-semibold text-slate-700">
          Room occupancy
        </label>
        <select
          id="filter-room"
          value={filters.roomType}
          onChange={(e) => update('roomType', e.target.value as RoomType | 'All')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
        >
          <option value="All">Any occupancy</option>
          {ROOM_TYPES.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>

      {/* Food */}
      <div className="space-y-2">
        <label htmlFor="filter-food" className="block text-xs font-semibold text-slate-700">
          Food arrangement
        </label>
        <select
          id="filter-food"
          value={filters.food}
          onChange={(e) => update('food', e.target.value as FoodOption | 'All')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
        >
          <option value="All">Any food option</option>
          <option value="Included">Food Included</option>
          <option value="Optional">Food Optional</option>
          <option value="Not Included">Not Included</option>
        </select>
      </div>

      {/* Facilities */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700">Must-have facilities</span>
        <div className="grid grid-cols-2 gap-2">
          {FACILITY_OPTIONS.map((fac) => {
            const checked = filters.facilities.includes(fac.key);
            return (
              <label
                key={fac.key}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  checked
                    ? 'border-teal-700 bg-teal-50/70 text-teal-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFacility(fac.key)}
                  className="rounded accent-teal-700"
                />
                <span className="truncate">{fac.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
