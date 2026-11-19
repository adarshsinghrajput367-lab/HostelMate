export type InformationStatus =
  | 'sample'
  | 'operator_provided'
  | 'checked_by_hostelmate';

export type PropertyType = 'Hostel' | 'PG';
export type GenderCategory = 'Boys' | 'Girls' | 'Co-ed';
export type RoomType = 'Single' | 'Double' | 'Triple' | 'Dorm';
export type FoodOption = 'Included' | 'Optional' | 'Not Included';

export type FacilityKey =
  | 'wifi'
  | 'laundry'
  | 'ac'
  | 'hot_water'
  | 'power_backup'
  | 'cctv'
  | 'study_room'
  | 'parking'
  | 'gym';

export interface CollegeDistance {
  college: string;
  distanceKm: number;
  commuteNote: string;
}

export interface Listing {
  id: string;
  name: string;
  type: PropertyType;
  gender: GenderCategory;
  area: string;
  addressHint: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  monthlyRent: number;
  rentMax?: number;
  securityDeposit: number;
  roomTypes: RoomType[];
  foodIncluded: FoodOption;
  foodDetails: string;
  facilities: FacilityKey[];
  nearbyColleges: CollegeDistance[];
  rules: {
    curfew: string;
    visitors: string;
    noticePeriod: string;
    otherRules: string[];
  };
  description: string;
  images: string[];
  contact: {
    personName: string;
    phone: string;
    preferredHours: string;
  };
  informationStatus: InformationStatus;
  informationSource: string;
  lastUpdated: string; // ISO date YYYY-MM-DD
  createdAt: string;
}

export interface ShortlistItem {
  listingId: string;
  note: string;
  addedAt: string;
}

export type AcquisitionChannel =
  | 'College group'
  | 'Instagram'
  | 'Friend'
  | 'Campus ambassador'
  | 'Other';

export type WtpAnswer = 'Yes' | 'Maybe' | 'No';
export type PriceSensitivity = 'Rs 0' | 'Rs 99' | 'Rs 149' | 'Rs 199' | 'Rs 249';

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  collegeOther?: string;
  courseAndYear: string;
  homeCityState: string;
  budgetMin: number;
  budgetMax: number;
  preferredRoomType: RoomType | 'Flexible';
  foodPreference: 'Must include food' | 'Optional / flexible' | 'Self-arranged';
  mustHaveFacilities: FacilityKey[];
  moveInTimeframe: string;
  alreadyFoundAccommodation: 'Yes' | 'No' | 'Partly';
  channel: AcquisitionChannel;
  willingToPayPremium?: WtpAnswer;
  priceSensitivity?: PriceSensitivity;
  consentGiven: boolean;
  createdAt: string;
}

export interface OperatorSubmission {
  id: string;
  propertyName: string;
  type: PropertyType;
  gender: GenderCategory;
  area: string;
  address: string;
  contactPerson: string;
  phone: string;
  monthlyRent: number;
  securityDeposit: number;
  roomTypes: RoomType[];
  foodOption: FoodOption;
  foodDetails?: string;
  facilities: FacilityKey[];
  rulesSummary: string;
  availabilityNote: string;
  willingToPayVisibility?: WtpAnswer;
  operatorPriceRange?: string;
  consentGiven: boolean;
  informationStatus: InformationStatus;
  createdAt: string;
}

export interface FeedbackEntry {
  id: string;
  studentName?: string;
  college?: string;
  taskFindUnderBudget: 'Yes' | 'No';
  taskCompareTwo: 'Yes' | 'No';
  taskShortlistTwo: 'Yes' | 'No';
  timeTakenMinutes?: number;
  usefulnessRating: 1 | 2 | 3 | 4 | 5;
  comparisonUseful: 'Yes' | 'Somewhat' | 'No';
  comment: string;
  createdAt: string;
}

export type ComingSoonFeatureId =
  | 'roommate_matching'
  | 'shared_expense_calculator';

export interface FeatureVote {
  id: string;
  featureId: ComingSoonFeatureId;
  suggestion?: string;
  createdAt: string;
}

export interface ListingFilters {
  search: string;
  budgetMax: number;
  budgetMin: number;
  type: PropertyType | 'All';
  gender: GenderCategory | 'All';
  roomType: RoomType | 'All';
  food: FoodOption | 'All';
  facilities: FacilityKey[];
  college: string;
  maxDistanceKm: number;
  area: string;
  sortBy: 'rent_asc' | 'rent_desc' | 'distance_asc' | 'updated_desc';
}

export interface ExperimentMilestone {
  id: string;
  week: 'W1' | 'W2' | 'W3' | 'W4';
  title: string;
  targetDescription: string;
  completed: boolean;
  notes: string;
}
