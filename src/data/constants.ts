import { ExperimentMilestone, FacilityKey, ListingFilters, RoomType } from '../types';

export const PILOT_DISCLAIMER =
  'HostelMate is an early-stage pilot. Listing information may change. Please confirm rent, deposit, availability, rules and terms directly with the provider and visit the property before paying anything. HostelMate does not handle bookings or payments.';

export const SAMPLE_LISTING_LABEL =
  'Sample data for prototype demonstration — not a real or verified listing';

export const PRIVACY_DELETE_EMAIL = 'privacy@hostelmate-pilot.example';

export const DEHRADUN_COLLEGES = [
  'UPES (Bidholi / Kandoli)',
  'Graphic Era University',
  'DIT University',
  'Doon University',
  'DBS Global University',
  'Dev Bhoomi Uttarakhand University',
  'Uttaranchal University',
  'Other',
] as const;

export const DEHRADUN_AREAS = [
  'Bidholi',
  'Premnagar',
  'Rajpur Road',
  'Clement Town',
  'Ballupur',
  'Sahastradhara Road',
  'Patel Nagar',
  'Ajabpur',
  'Dalanwala',
  'Pondha',
  'Sudhowala',
  'Karanpur',
] as const;

export const ROOM_TYPES: RoomType[] = ['Single', 'Double', 'Triple', 'Dorm'];

export const FACILITY_OPTIONS: { key: FacilityKey; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'laundry', label: 'Laundry' },
  { key: 'ac', label: 'AC' },
  { key: 'hot_water', label: 'Hot Water' },
  { key: 'power_backup', label: 'Power Backup' },
  { key: 'cctv', label: 'CCTV' },
  { key: 'study_room', label: 'Study Room' },
  { key: 'parking', label: 'Parking' },
  { key: 'gym', label: 'Gym' },
];

export const DEFAULT_FILTERS: ListingFilters = {
  search: '',
  budgetMin: 3500,
  budgetMax: 15000,
  type: 'All',
  gender: 'All',
  roomType: 'All',
  food: 'All',
  facilities: [],
  college: 'All',
  maxDistanceKm: 15,
  area: 'All',
  sortBy: 'rent_asc',
};

export interface ChecklistItemDef {
  id: string;
  category: string;
  question: string;
  whyItMatters: string;
}

export const PRE_DEPOSIT_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'rent-hikes',
    category: 'Rent & Extra Charges',
    question: 'Are electricity, Wi-Fi, water, and maintenance included in the monthly rent, or billed separately? Can rent increase mid-year?',
    whyItMatters: 'Sub-meter AC/geyser bills in Dehradun winters and summers can add ₹800–₹2,000/month.',
  },
  {
    id: 'deposit-refund',
    category: 'Security Deposit',
    question: 'Is the security deposit 100% refundable? Under what conditions are deductions made, and within how many days is it returned after vacating?',
    whyItMatters: 'Get refund terms and timelines written on a receipt or rental agreement before paying.',
  },
  {
    id: 'notice-period',
    category: 'Notice Period & Lock-in',
    question: 'What is the mandatory lock-in period and notice period (e.g., 30 days) before leaving?',
    whyItMatters: 'Leaving early without proper notice is the most common reason students lose their deposit.',
  },
  {
    id: 'food-quality',
    category: 'Food & Mess',
    question: 'Can I see the weekly menu and meal timings? Is food mandatory, and are adjustments made during semester breaks?',
    whyItMatters: 'Confirm breakfast/tiffin timings match your morning college bus or lecture schedule.',
  },
  {
    id: 'water-power',
    category: 'Water, Power & Wi-Fi',
    question: 'Does the power backup run lights, fans, and Wi-Fi routers during cuts? Is 24x7 water and winter geyser hot water reliable?',
    whyItMatters: 'Dehradun winters get cold and hilly areas like Bidholi/Premnagar can see power fluctuations.',
  },
  {
    id: 'safety-access',
    category: 'Safety & House Rules',
    question: 'What are the exact gate closing/curfew timings, visitor rules (including parents), and CCTV / warden arrangements?',
    whyItMatters: 'Ensure rules align with late lab sessions, project work, or occasional parent visits.',
  },
  {
    id: 'agreement-receipt',
    category: 'Documentation',
    question: 'Will I receive a written rent agreement and signed receipt for the deposit and first month’s rent?',
    whyItMatters: 'Never pay cash without a dated receipt specifying the exact deposit amount and landlord signature.',
  },
  {
    id: 'physical-visit',
    category: 'In-Person Check',
    question: 'Have I inspected the exact room being allotted (not just a model room), washroom hygiene, mobile network signal, and commute route?',
    whyItMatters: 'Photos can be outdated; verify room ventilation, dampness, and real commute time to college.',
  },
];

export const INITIAL_EXPERIMENT_MILESTONES: ExperimentMilestone[] = [
  {
    id: 'w1-interviews',
    week: 'W1',
    title: 'Student discovery interviews & pilot launch',
    targetDescription: 'Complete 10–15 outstation student interviews and take the pilot page live.',
    completed: true,
    notes: 'MVP prototype live with standardized comparison flow and sample Dehradun listings.',
  },
  {
    id: 'w2-outreach',
    week: 'W2',
    title: 'Campus outreach & early lead generation',
    targetDescription: 'Publish 3 content pieces, reach 100 students, and collect 20 early-access leads.',
    completed: false,
    notes: 'Focus on UPES, Graphic Era, DIT, and Doon University incoming freshers groups.',
  },
  {
    id: 'w3-demos',
    week: 'W3',
    title: 'Prototype demos & operator conversations',
    targetDescription: 'Run live demos with 10 students and contact 10 local hostel/PG operators.',
    completed: false,
    notes: 'Validate listing accuracy workflow and operator willingness to submit updated terms.',
  },
  {
    id: 'w4-validation',
    week: 'W4',
    title: 'Pilot registrations & structured usability tests',
    targetDescription: 'Reach 30 unique student registrations and complete at least 5–15 usability feedback sessions.',
    completed: false,
    notes: 'Core success metric: ≥10/15 testers shortlist 2+ options and ≥8/15 find comparison useful.',
  },
];
