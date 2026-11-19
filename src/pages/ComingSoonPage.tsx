import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Check, ThumbsUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService } from '../services/storageService';
import { ComingSoonFeatureId } from '../types';

interface FeatureCardDef {
  id: ComingSoonFeatureId;
  title: string;
  summary: string;
  plannedScope: string[];
  icon: typeof Users;
}

const FEATURES: FeatureCardDef[] = [
  {
    id: 'roommate_matching',
    title: 'Roommate Preference Matching',
    summary:
      'Connect with fellow students joining Dehradun colleges who share similar sleep schedules, study habits, cleanliness preferences, and monthly rent budgets before signing a twin or triple room.',
    plannedScope: [
      'Filter by target college, gender, and budget band',
      'Simple compatibility preferences (quiet hours, smoking/veg preferences, study routine)',
      'Opt-in contact sharing only when both students agree',
    ],
    icon: Users,
  },
  {
    id: 'shared_expense_calculator',
    title: 'Shared Expense Calculator',
    summary:
      'A lightweight roommate ledger to split monthly electricity sub-meter bills, Wi-Fi recharges, drinking water jars, and household supplies fairly without awkward reminders.',
    plannedScope: [
      'Split recurring room utilities equally or by custom shares',
      'Monthly summary exportable to WhatsApp',
      'Designed specifically for PG and shared flat living in Dehradun',
    ],
    icon: Calculator,
  },
];

export function ComingSoonPage() {
  useDocumentTitle(
    'Coming Soon Lab',
    'Vote on upcoming student features like Roommate Preference Matching and Shared Expense Calculator.'
  );

  const { showToast } = useApp();
  const [votedIds, setVotedIds] = useState<ComingSoonFeatureId[]>(() =>
    dataService.getUserVotedFeatures()
  );
  const [suggestions, setSuggestions] = useState<Record<ComingSoonFeatureId, string>>({
    roommate_matching: '',
    shared_expense_calculator: '',
  });
  const [submittedNoteFor, setSubmittedNoteFor] = useState<
    Record<ComingSoonFeatureId, boolean>
  >({
    roommate_matching: false,
    shared_expense_calculator: false,
  });

  const handleVote = (featureId: ComingSoonFeatureId, title: string) => {
    if (votedIds.includes(featureId)) {
      showToast(`You already recorded interest for ${title}.`, 'info');
      return;
    }
    dataService.recordFeatureVote(featureId);
    setVotedIds((prev) => [...prev, featureId]);
    showToast(`Recorded your interest in "${title}". Thank you!`, 'success');
  };

  const handleSuggestionSubmit = (
    e: React.FormEvent,
    featureId: ComingSoonFeatureId,
    title: string
  ) => {
    e.preventDefault();
    const text = suggestions[featureId].trim();
    if (!text) return;
    dataService.recordFeatureVote(featureId, text);
    if (!votedIds.includes(featureId)) {
      setVotedIds((prev) => [...prev, featureId]);
    }
    setSuggestions((prev) => ({ ...prev, [featureId]: '' }));
    setSubmittedNoteFor((prev) => ({ ...prev, [featureId]: true }));
    showToast(`Suggestion saved for "${title}".`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold text-amber-800">
          Demand validation · Excluded from Version 1
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900 text-balance">
          Coming Soon Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We are keeping the Version 1 pilot strictly focused on hostel and PG discovery and
          comparison. Before building additional tools, we want honest feedback on whether these
          ideas would genuinely help students moving to Dehradun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          const voted = votedIds.includes(feature.id);

          return (
            <div
              key={feature.id}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Under consideration
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.summary}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                  {feature.plannedScope.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div>
                  <button
                    type="button"
                    onClick={() => handleVote(feature.id, feature.title)}
                    aria-pressed={voted}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                      voted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-teal-700 text-white hover:bg-teal-800'
                    }`}
                  >
                    {voted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Interest recorded</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4" />
                        <span>I&apos;d use this</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Optional Suggestion Form */}
              <form
                onSubmit={(e) =>
                  handleSuggestionSubmit(e, feature.id, feature.title)
                }
                className="pt-5 border-t border-slate-200 space-y-2.5"
              >
                <label
                  htmlFor={`suggest-${feature.id}`}
                  className="block text-xs font-semibold text-slate-700"
                >
                  What would make this useful for you? (optional)
                </label>
                <textarea
                  id={`suggest-${feature.id}`}
                  rows={2}
                  value={suggestions[feature.id]}
                  onChange={(e) =>
                    setSuggestions((prev) => ({
                      ...prev,
                      [feature.id]: e.target.value,
                    }))
                  }
                  placeholder="Share a specific pain point or must-have detail..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                />
                <div className="flex items-center justify-between gap-2">
                  {submittedNoteFor[feature.id] ? (
                    <span className="text-xs text-emerald-700 font-medium">
                      Thanks—note saved for our pilot review.
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Stored locally for pilot research
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={!suggestions[feature.id].trim()}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
                  >
                    Send note
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-slate-900">
            Need a simple cost calculator right now?
          </h3>
          <p className="text-sm text-slate-600">
            Try our individual Monthly Budget Estimator and Pre-Deposit Checklist available today.
          </p>
        </div>
        <Link
          to="/tools"
          className="px-4 py-2 text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg whitespace-nowrap"
        >
          Open Student Tools
        </Link>
      </div>
    </div>
  );
}
