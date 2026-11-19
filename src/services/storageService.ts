import { INITIAL_EXPERIMENT_MILESTONES } from '../data/constants';
import { SEED_LISTINGS } from '../data/seedListings';
import {
  ComingSoonFeatureId,
  ExperimentMilestone,
  FeatureVote,
  FeedbackEntry,
  Listing,
  OperatorSubmission,
  Registration,
  ShortlistItem,
} from '../types';

const STORAGE_KEYS = {
  SHORTLIST: 'hostelmate_shortlist_v1',
  COMPARE: 'hostelmate_compare_v1',
  REGISTRATIONS: 'hostelmate_registrations_v1',
  OPERATOR_SUBMISSIONS: 'hostelmate_operator_submissions_v1',
  FEEDBACK: 'hostelmate_feedback_v1',
  FEATURE_VOTES: 'hostelmate_feature_votes_v1',
  USER_VOTED_FEATURES: 'hostelmate_user_voted_features_v1',
  CHECKLIST: 'hostelmate_predeposit_checklist_v1',
  EXPERIMENT: 'hostelmate_experiment_milestones_v1',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode write errors cleanly
  }
}

/**
 * Isolated data repository abstraction.
 * In Phase 2, replace these synchronous localStorage methods with async Firebase Firestore
 * or Supabase calls while keeping UI components untouched.
 */
export const dataService = {
  // Listings (seeded sample data)
  getListings(): Listing[] {
    return SEED_LISTINGS;
  },

  getListingById(id: string): Listing | undefined {
    return SEED_LISTINGS.find((l) => l.id === id);
  },

  // Shortlist (scoped per signed-in Google uid, or guest)
  getShortlist(userId?: string | null): ShortlistItem[] {
    const key = userId ? `${STORAGE_KEYS.SHORTLIST}_${userId}` : STORAGE_KEYS.SHORTLIST;
    return safeRead<ShortlistItem[]>(key, []);
  },

  saveShortlist(items: ShortlistItem[], userId?: string | null): void {
    const key = userId ? `${STORAGE_KEYS.SHORTLIST}_${userId}` : STORAGE_KEYS.SHORTLIST;
    safeWrite(key, items);
  },

  // Compare list (max 3 IDs, scoped per signed-in Google uid, or guest)
  getCompareIds(userId?: string | null): string[] {
    const key = userId ? `${STORAGE_KEYS.COMPARE}_${userId}` : STORAGE_KEYS.COMPARE;
    return safeRead<string[]>(key, []).slice(0, 3);
  },

  saveCompareIds(ids: string[], userId?: string | null): void {
    const key = userId ? `${STORAGE_KEYS.COMPARE}_${userId}` : STORAGE_KEYS.COMPARE;
    safeWrite(key, ids.slice(0, 3));
  },

  // Student Pilot Registrations
  getRegistrations(): Registration[] {
    return safeRead<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []);
  },

  hasRegistrationWithEmail(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return this.getRegistrations().some(
      (r) => r.email.trim().toLowerCase() === normalized
    );
  },

  addRegistration(
    entry: Omit<Registration, 'id' | 'createdAt'>
  ): { ok: true; record: Registration } | { ok: false; error: string } {
    if (this.hasRegistrationWithEmail(entry.email)) {
      return {
        ok: false,
        error: 'This email address is already registered for the HostelMate pilot.',
      };
    }
    const record: Registration = {
      ...entry,
      id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const existing = this.getRegistrations();
    safeWrite(STORAGE_KEYS.REGISTRATIONS, [record, ...existing]);
    return { ok: true, record };
  },

  // Operator Submissions
  getOperatorSubmissions(): OperatorSubmission[] {
    return safeRead<OperatorSubmission[]>(STORAGE_KEYS.OPERATOR_SUBMISSIONS, []);
  },

  addOperatorSubmission(
    entry: Omit<OperatorSubmission, 'id' | 'createdAt' | 'informationStatus'>
  ): OperatorSubmission {
    const record: OperatorSubmission = {
      ...entry,
      id: `op_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      informationStatus: 'operator_provided',
      createdAt: new Date().toISOString(),
    };
    const existing = this.getOperatorSubmissions();
    safeWrite(STORAGE_KEYS.OPERATOR_SUBMISSIONS, [record, ...existing]);
    return record;
  },

  // Usability Feedback Entries
  getFeedbackEntries(): FeedbackEntry[] {
    return safeRead<FeedbackEntry[]>(STORAGE_KEYS.FEEDBACK, []);
  },

  addFeedbackEntry(
    entry: Omit<FeedbackEntry, 'id' | 'createdAt'>
  ): FeedbackEntry {
    const record: FeedbackEntry = {
      ...entry,
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const existing = this.getFeedbackEntries();
    safeWrite(STORAGE_KEYS.FEEDBACK, [record, ...existing]);
    return record;
  },

  // Coming Soon Feature Votes
  getFeatureVotes(): FeatureVote[] {
    return safeRead<FeatureVote[]>(STORAGE_KEYS.FEATURE_VOTES, []);
  },

  getUserVotedFeatures(): ComingSoonFeatureId[] {
    return safeRead<ComingSoonFeatureId[]>(STORAGE_KEYS.USER_VOTED_FEATURES, []);
  },

  recordFeatureVote(
    featureId: ComingSoonFeatureId,
    suggestion?: string
  ): FeatureVote {
    const record: FeatureVote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      featureId,
      suggestion: suggestion?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const votes = this.getFeatureVotes();
    safeWrite(STORAGE_KEYS.FEATURE_VOTES, [record, ...votes]);

    const voted = this.getUserVotedFeatures();
    if (!voted.includes(featureId)) {
      safeWrite(STORAGE_KEYS.USER_VOTED_FEATURES, [...voted, featureId]);
    }
    return record;
  },

  // Pre-Deposit Checklist Checked IDs
  getCheckedChecklistIds(): string[] {
    return safeRead<string[]>(STORAGE_KEYS.CHECKLIST, []);
  },

  saveCheckedChecklistIds(ids: string[]): void {
    safeWrite(STORAGE_KEYS.CHECKLIST, ids);
  },

  // 30-day Experiment Tracker Milestones
  getExperimentMilestones(): ExperimentMilestone[] {
    return safeRead<ExperimentMilestone[]>(
      STORAGE_KEYS.EXPERIMENT,
      INITIAL_EXPERIMENT_MILESTONES
    );
  },

  saveExperimentMilestones(milestones: ExperimentMilestone[]): void {
    safeWrite(STORAGE_KEYS.EXPERIMENT, milestones);
  },

  // Clear all local user data (supports privacy/data deletion right on-device)
  clearAllLocalUserData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });
  },
};

export function exportRowsToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | undefined | null)[][]
): void {
  const escapeCell = (val: string | number | boolean | undefined | null) => {
    const str = val === undefined || val === null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
