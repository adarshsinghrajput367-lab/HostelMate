import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CheckSquare,
  Download,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { GoogleSignInButton } from '../components/ui/GoogleSignInButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService, exportRowsToCsv } from '../services/storageService';
import {
  AcquisitionChannel,
  ExperimentMilestone,
  FeatureVote,
  FeedbackEntry,
  OperatorSubmission,
  Registration,
} from '../types';
import { formatDateShort, formatINR } from '../utils/format';

const DEMO_PASSCODE = 'hostelmate2026';
const AUTHORIZED_ADMIN_EMAILS = ['adarshsinghrajput367@gmail.com'];

const ALL_CHANNELS: AcquisitionChannel[] = [
  'College group',
  'Instagram',
  'Friend',
  'Campus ambassador',
  'Other',
];

export function AdminPage() {
  useDocumentTitle('Admin Dashboard (Demo)', 'HostelMate pilot metrics, lead tracker, and CSV exports.');

  const { showToast } = useApp();
  const { user, signingIn, authError: googleAuthError, signInWithGoogle } = useAuth();
  const isVerifiedGoogleAdmin = Boolean(
    user?.email &&
      user.emailVerified &&
      AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase())
  );
  const [unlockedByPasscode, setUnlockedByPasscode] = useState(false);
  const unlocked = isVerifiedGoogleAdmin || unlockedByPasscode;
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Data state loaded from storageService
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    dataService.getRegistrations()
  );
  const [operators, setOperators] = useState<OperatorSubmission[]>(() =>
    dataService.getOperatorSubmissions()
  );
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(() =>
    dataService.getFeedbackEntries()
  );
  const [votes, setVotes] = useState<FeatureVote[]>(() =>
    dataService.getFeatureVotes()
  );
  const [milestones, setMilestones] = useState<ExperimentMilestone[]>(() =>
    dataService.getExperimentMilestones()
  );

  // Table Filters
  const [activeTab, setActiveTab] = useState<
    'registrations' | 'operators' | 'feedback' | 'votes'
  >('registrations');
  const [regSearch, setRegSearch] = useState('');
  const [regChannelFilter, setRegChannelFilter] = useState<string>('All');
  const [opSearch, setOpSearch] = useState('');
  const [fbSearch, setFbSearch] = useState('');

  const refreshData = () => {
    setRegistrations(dataService.getRegistrations());
    setOperators(dataService.getOperatorSubmissions());
    setFeedbacks(dataService.getFeedbackEntries());
    setVotes(dataService.getFeatureVotes());
    setMilestones(dataService.getExperimentMilestones());
    showToast('Refreshed pilot data from local storage.', 'info');
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEMO_PASSCODE) {
      setUnlockedByPasscode(true);
      setAuthError('');
      refreshData();
    } else {
      setAuthError('Incorrect demo passcode. Use "hostelmate2026" for this local demo.');
    }
  };

  // KPI computations
  const qualifiedLeads = useMemo(
    () =>
      registrations.filter(
        (r) =>
          r.alreadyFoundAccommodation === 'No' ||
          r.alreadyFoundAccommodation === 'Partly'
      ).length,
    [registrations]
  );

  const avgUsefulness = useMemo(() => {
    if (!feedbacks.length) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.usefulnessRating, 0);
    return Number((sum / feedbacks.length).toFixed(2));
  }, [feedbacks]);

  const shortlistedTwoCount = useMemo(
    () => feedbacks.filter((f) => f.taskShortlistTwo === 'Yes').length,
    [feedbacks]
  );

  const comparisonUsefulCount = useMemo(
    () => feedbacks.filter((f) => f.comparisonUseful === 'Yes').length,
    [feedbacks]
  );

  const channelChartData = useMemo(() => {
    return ALL_CHANNELS.map((ch) => ({
      channel: ch,
      count: registrations.filter((r) => r.channel === ch).length,
    }));
  }, [registrations]);

  const studentWtpBreakdown = useMemo(() => {
    const counts = { Yes: 0, Maybe: 0, No: 0, Unanswered: 0 };
    registrations.forEach((r) => {
      if (r.willingToPayPremium) counts[r.willingToPayPremium]++;
      else counts.Unanswered++;
    });
    return counts;
  }, [registrations]);

  const voteCounts = useMemo(() => {
    return {
      roommate: votes.filter((v) => v.featureId === 'roommate_matching').length,
      expenses: votes.filter((v) => v.featureId === 'shared_expense_calculator').length,
    };
  }, [votes]);

  // Filtered Table Lists
  const filteredRegs = useMemo(() => {
    const q = regSearch.trim().toLowerCase();
    return registrations.filter((r) => {
      if (regChannelFilter !== 'All' && r.channel !== regChannelFilter) return false;
      if (!q) return true;
      return `${r.name} ${r.email} ${r.college} ${r.collegeOther || ''} ${r.homeCityState}`
        .toLowerCase()
        .includes(q);
    });
  }, [registrations, regSearch, regChannelFilter]);

  const filteredOps = useMemo(() => {
    const q = opSearch.trim().toLowerCase();
    if (!q) return operators;
    return operators.filter((o) =>
      `${o.propertyName} ${o.area} ${o.contactPerson} ${o.phone}`
        .toLowerCase()
        .includes(q)
    );
  }, [operators, opSearch]);

  const filteredFeedbacks = useMemo(() => {
    const q = fbSearch.trim().toLowerCase();
    if (!q) return feedbacks;
    return feedbacks.filter((f) =>
      `${f.studentName || ''} ${f.college || ''} ${f.comment}`
        .toLowerCase()
        .includes(q)
    );
  }, [feedbacks, fbSearch]);

  const toggleMilestone = (id: string) => {
    const updated = milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updated);
    dataService.saveExperimentMilestones(updated);
  };

  const updateMilestoneNote = (id: string, notes: string) => {
    const updated = milestones.map((m) => (m.id === id ? { ...m, notes } : m));
    setMilestones(updated);
    dataService.saveExperimentMilestones(updated);
  };

  // CSV Exports
  const exportRegistrationsCsv = () => {
    exportRowsToCsv(
      'hostelmate-pilot-registrations.csv',
      [
        'ID',
        'Created At',
        'Name',
        'Email',
        'Phone',
        'College',
        'Course & Year',
        'Home City/State',
        'Budget Min',
        'Budget Max',
        'Room Type',
        'Food Preference',
        'Move-in',
        'Already Found',
        'Channel',
        'WTP Premium',
        'Price Sensitivity',
      ],
      filteredRegs.map((r) => [
        r.id,
        r.createdAt,
        r.name,
        r.email,
        r.phone || '',
        r.college === 'Other' ? r.collegeOther || 'Other' : r.college,
        r.courseAndYear,
        r.homeCityState,
        r.budgetMin,
        r.budgetMax,
        r.preferredRoomType,
        r.foodPreference,
        r.moveInTimeframe,
        r.alreadyFoundAccommodation,
        r.channel,
        r.willingToPayPremium || '',
        r.priceSensitivity || '',
      ])
    );
    showToast('Exported registrations CSV.', 'success');
  };

  const exportOperatorsCsv = () => {
    exportRowsToCsv(
      'hostelmate-operator-submissions.csv',
      [
        'ID',
        'Created At',
        'Property Name',
        'Type',
        'Gender',
        'Area',
        'Address',
        'Contact Person',
        'Phone',
        'Monthly Rent',
        'Deposit',
        'Room Types',
        'Food',
        'WTP Visibility',
        'Price Range',
      ],
      filteredOps.map((o) => [
        o.id,
        o.createdAt,
        o.propertyName,
        o.type,
        o.gender,
        o.area,
        o.address,
        o.contactPerson,
        o.phone,
        o.monthlyRent,
        o.securityDeposit,
        o.roomTypes.join('; '),
        o.foodOption,
        o.willingToPayVisibility || '',
        o.operatorPriceRange || '',
      ])
    );
    showToast('Exported operator submissions CSV.', 'success');
  };

  const exportFeedbackCsv = () => {
    exportRowsToCsv(
      'hostelmate-usability-feedback.csv',
      [
        'ID',
        'Created At',
        'Name',
        'College',
        'Found Under Budget',
        'Compared 2 Options',
        'Shortlisted 2 Options',
        'Time (min)',
        'Usefulness (1-5)',
        'Comparison Useful',
        'Comment',
      ],
      filteredFeedbacks.map((f) => [
        f.id,
        f.createdAt,
        f.studentName || 'Anonymous',
        f.college || '',
        f.taskFindUnderBudget,
        f.taskCompareTwo,
        f.taskShortlistTwo,
        f.timeTakenMinutes ?? '',
        f.usefulnessRating,
        f.comparisonUseful,
        f.comment,
      ])
    );
    showToast('Exported feedback CSV.', 'success');
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              Admin Dashboard (Demo)
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the local demo passcode to view pilot registrations, operator submissions,
              usability test metrics, and feature votes stored in this browser.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950 flex items-start gap-2 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Security note:</strong> This client-side passcode (
              <code className="font-mono font-semibold">hostelmate2026</code>) is for local
              prototype demonstration only. Replace with real server-backed authentication (e.g.
              Firebase Auth or Supabase Auth with role rules) before public launch.
            </p>
          </div>

          <div className="space-y-3">
            <GoogleSignInButton
              onClick={async () => {
                const signedIn = await signInWithGoogle();
                if (signedIn) {
                  if (
                    signedIn.email &&
                    signedIn.emailVerified &&
                    AUTHORIZED_ADMIN_EMAILS.includes(signedIn.email.toLowerCase())
                  ) {
                    showToast(`Admin access verified for ${signedIn.email}.`, 'success');
                  } else {
                    setAuthError(
                      `Signed in as ${signedIn.email}, which is not on the pilot admin allowlist. You can still use the local demo passcode below.`
                    );
                  }
                }
              }}
              loading={signingIn}
              label="Sign in with Google (Admin)"
              fullWidth
            />
            {googleAuthError && (
              <p role="alert" className="text-xs font-medium text-rose-700">
                {googleAuthError}
              </p>
            )}
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200" />
            <span className="shrink-0 mx-3 text-[11px] font-medium text-slate-400">
              or use local demo passcode
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-passcode" className="block text-xs font-semibold text-slate-700">
                Demo Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter hostelmate2026"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              />
              {authError && (
                <p role="alert" className="text-xs font-medium text-rose-700">
                  {authError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Unlock Demo Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            HostelMate Pilot Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Local browser dataset · Replace client-side demo passcode with real authentication
            before public launch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          {!isVerifiedGoogleAdmin && (
            <button
              type="button"
              onClick={() => {
                setUnlockedByPasscode(false);
                setPasscodeInput('');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Registrations',
            value: registrations.length,
            sub: 'Target: 30 in W4',
          },
          {
            label: 'Qualified Leads',
            value: qualifiedLeads,
            sub: 'Still searching / partly',
          },
          {
            label: 'Operator Listings',
            value: operators.length,
            sub: 'Target: 10 contacted W3',
          },
          {
            label: 'Feedback Sessions',
            value: feedbacks.length,
            sub: `Avg usefulness: ${avgUsefulness || '—'}/5`,
          },
          {
            label: 'Roommate Votes',
            value: voteCounts.roommate,
            sub: 'Coming Soon Lab',
          },
          {
            label: 'Expense Calc Votes',
            value: voteCounts.expenses,
            sub: 'Coming Soon Lab',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-slate-200 p-4 space-y-1"
          >
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {kpi.value}
            </p>
            <p className="text-[11px] text-slate-500 tabular-nums">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Willingness to Pay + Usability Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Channel Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Registrations by Acquisition Channel
            </h2>
            <p className="text-xs text-slate-500">
              Tracks which student outreach channel converts best during the pilot.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelChartData}
                margin={{ top: 10, right: 16, left: -16, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="channel"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Registrations" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: WTP Breakdown & Pilot Success Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-slate-900">
              Student Willingness-to-Pay Survey
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(
                [
                  ['Yes', studentWtpBreakdown.Yes, 'text-emerald-800 bg-emerald-50'],
                  ['Maybe', studentWtpBreakdown.Maybe, 'text-amber-900 bg-amber-50'],
                  ['No', studentWtpBreakdown.No, 'text-slate-700 bg-slate-100'],
                  ['Skipped', studentWtpBreakdown.Unanswered, 'text-slate-500 bg-slate-50'],
                ] as const
              ).map(([label, val, cls]) => (
                <div key={label} className={`rounded-lg p-3 ${cls}`}>
                  <p className="text-[11px] font-medium">{label}</p>
                  <p className="font-mono text-lg font-bold tabular-nums mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Usability Validation Benchmark
            </h2>
            <p className="text-xs text-slate-500">
              Pilot success goal: ≥10/15 testers shortlist 2+ options &amp; ≥8/15 find comparison
              useful.
            </p>
            <div className="space-y-2 text-sm tabular-nums">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Shortlisted 2+ options</span>
                <span className="font-semibold text-slate-900">
                  {shortlistedTwoCount} / {feedbacks.length} sessions (Goal: 10/15)
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Found comparison useful (&ldquo;Yes&rdquo;)</span>
                <span className="font-semibold text-slate-900">
                  {comparisonUsefulCount} / {feedbacks.length} sessions (Goal: 8/15)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Experiment Tracker */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            30-Day Pilot Experiment Tracker
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-4 space-y-3 transition-colors ${
                m.completed
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-800">{m.week}</span>
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => toggleMilestone(m.id)}
                    className="rounded accent-teal-700"
                  />
                  <span>{m.completed ? 'Done' : 'In progress'}</span>
                </label>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {m.targetDescription}
                </p>
              </div>
              <textarea
                rows={2}
                value={m.notes}
                onChange={(e) => updateMilestoneNote(m.id, e.target.value)}
                aria-label={`${m.week} notes`}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-teal-700 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tabbed Data Tables with Search & CSV Export */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {(
              [
                ['registrations', `Registrations (${registrations.length})`],
                ['operators', `Operators (${operators.length})`],
                ['feedback', `Feedback (${feedbacks.length})`],
                ['votes', `Feature Votes (${votes.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'registrations' && (
            <button
              type="button"
              onClick={exportRegistrationsCsv}
              disabled={filteredRegs.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Registrations CSV</span>
            </button>
          )}
          {activeTab === 'operators' && (
            <button
              type="button"
              onClick={exportOperatorsCsv}
              disabled={filteredOps.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Operators CSV</span>
            </button>
          )}
          {activeTab === 'feedback' && (
            <button
              type="button"
              onClick={exportFeedbackCsv}
              disabled={filteredFeedbacks.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Feedback CSV</span>
            </button>
          )}
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search name, email, college, city..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300"
                />
              </div>
              <select
                value={regChannelFilter}
                onChange={(e) => setRegChannelFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm"
              >
                <option value="All">All channels</option>
                {ALL_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {filteredRegs.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No student pilot registrations recorded yet. Submit a test entry on the Join Pilot
                page to see it appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">Student</th>
                      <th className="py-2.5 pr-4 font-semibold">College & Course</th>
                      <th className="py-2.5 pr-4 font-semibold">Budget</th>
                      <th className="py-2.5 pr-4 font-semibold">Found Stay?</th>
                      <th className="py-2.5 pr-4 font-semibold">Channel</th>
                      <th className="py-2.5 pr-4 font-semibold">WTP</th>
                      <th className="py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegs.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900">{r.name}</div>
                          <div className="text-slate-500">{r.email}</div>
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          <div>{r.college === 'Other' ? r.collegeOther : r.college}</div>
                          <div className="text-slate-500">{r.courseAndYear}</div>
                        </td>
                        <td className="py-3 pr-4 tabular-nums text-slate-800">
                          {formatINR(r.budgetMin)} – {formatINR(r.budgetMax)}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {r.alreadyFoundAccommodation}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">{r.channel}</td>
                        <td className="py-3 pr-4 text-slate-700">
                          {r.willingToPayPremium || '—'}
                          {r.priceSensitivity ? ` (${r.priceSensitivity})` : ''}
                        </td>
                        <td className="py-3 text-slate-500 tabular-nums">
                          {formatDateShort(r.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Operators Tab */}
        {activeTab === 'operators' && (
          <div className="p-6 space-y-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={opSearch}
                onChange={(e) => setOpSearch(e.target.value)}
                placeholder="Search property, area, contact..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300"
              />
            </div>

            {filteredOps.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No operator listing submissions yet. Submit one on the For Operators page to test.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">Property</th>
                      <th className="py-2.5 pr-4 font-semibold">Area & Address</th>
                      <th className="py-2.5 pr-4 font-semibold">Contact</th>
                      <th className="py-2.5 pr-4 font-semibold">Rent / Deposit</th>
                      <th className="py-2.5 pr-4 font-semibold">WTP Visibility</th>
                      <th className="py-2.5 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOps.map((o) => (
                      <tr key={o.id}>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900">{o.propertyName}</div>
                          <div className="text-slate-500">
                            {o.type} · {o.gender} · {o.foodOption}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          <div>{o.area}</div>
                          <div className="text-slate-500 truncate max-w-[200px]">{o.address}</div>
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          <div>{o.contactPerson}</div>
                          <div className="font-mono text-slate-500">{o.phone}</div>
                        </td>
                        <td className="py-3 pr-4 tabular-nums text-slate-800">
                          {formatINR(o.monthlyRent)} / {formatINR(o.securityDeposit)}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {o.willingToPayVisibility || '—'}
                          {o.operatorPriceRange ? ` · ${o.operatorPriceRange}` : ''}
                        </td>
                        <td className="py-3 text-slate-500 tabular-nums">
                          {formatDateShort(o.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="p-6 space-y-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={fbSearch}
                onChange={(e) => setFbSearch(e.target.value)}
                placeholder="Search tester name, college, comment..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300"
              />
            </div>

            {filteredFeedbacks.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No usability feedback sessions recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">Tester</th>
                      <th className="py-2.5 pr-4 font-semibold">Tasks (Budget / Compare / Shortlist)</th>
                      <th className="py-2.5 pr-4 font-semibold">Rating</th>
                      <th className="py-2.5 pr-4 font-semibold">Compare Useful?</th>
                      <th className="py-2.5 pr-4 font-semibold">Comment</th>
                      <th className="py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFeedbacks.map((f) => (
                      <tr key={f.id}>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900">
                            {f.studentName || 'Anonymous'}
                          </div>
                          <div className="text-slate-500">{f.college || '—'}</div>
                        </td>
                        <td className="py-3 pr-4 font-mono text-slate-700">
                          {f.taskFindUnderBudget} / {f.taskCompareTwo} / {f.taskShortlistTwo}
                        </td>
                        <td className="py-3 pr-4 font-bold tabular-nums text-slate-900">
                          {f.usefulnessRating}/5
                        </td>
                        <td className="py-3 pr-4 text-slate-700">{f.comparisonUseful}</td>
                        <td className="py-3 pr-4 text-slate-700 max-w-xs">{f.comment}</td>
                        <td className="py-3 text-slate-500 tabular-nums">
                          {formatDateShort(f.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Feature Votes Tab */}
        {activeTab === 'votes' && (
          <div className="p-6 space-y-4">
            {votes.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No Coming Soon Lab votes recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {votes.map((v) => (
                  <div
                    key={v.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {v.featureId === 'roommate_matching'
                          ? 'Roommate Preference Matching'
                          : 'Shared Expense Calculator'}
                      </span>
                      {v.suggestion && (
                        <p className="text-slate-600 mt-1">Note: &ldquo;{v.suggestion}&rdquo;</p>
                      )}
                    </div>
                    <span className="text-slate-500 tabular-nums shrink-0">
                      {formatDateShort(v.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
