import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Shield, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PILOT_DISCLAIMER, PRIVACY_DELETE_EMAIL } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function AboutPilotPage() {
  useDocumentTitle(
    'About the HostelMate Pilot',
    'Learn about HostelMate’s pilot scope, data transparency rules, local architecture, and how to connect a real backend.'
  );

  const { resetAllLocalData } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-teal-800">
          Project README & Pilot Overview
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          About the HostelMate Pilot
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          HostelMate is an early-stage student housing discovery and comparison MVP focused on
          Dehradun, Uttarakhand. Our core hypothesis is that outstation college students prefer a
          single standardized comparison workflow over piecing together scattered WhatsApp posts,
          broker calls, and general property portals.
        </p>
      </div>

      {/* Scope */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            Included in Version 1 (Pilot)
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>Standardized Dehradun hostel & PG listings with clear information-status labels</li>
            <li>Budget, college distance, locality, gender, room type, food, and facility filters</li>
            <li>Side-by-side comparison table (up to 3 options) with estimated first-month outlay</li>
            <li>Shortlist with personal notes and WhatsApp-friendly parent sharing</li>
            <li>Monthly Budget Estimator and printable Pre-Deposit Checklist</li>
            <li>Pilot registration, usability test feedback, and operator listing submission</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            Intentionally Excluded from V1
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>In-app rent/deposit payments or booking guarantees</li>
            <li>Automatic roommate matching (demand-tested only in Coming Soon Lab)</li>
            <li>Shared roommate expense management (demand-tested only)</li>
            <li>Complex user ratings/reviews or unverified safety claims</li>
            <li>Real-time bed availability sync or AI recommendations</li>
            <li>Full property-owner self-service portal</li>
          </ul>
        </div>
      </section>

      {/* Architecture & Backend Swap Guide */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Architecture & Connecting a Real Backend Later
          </h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          For the MVP pilot, all sample listings are seeded from a typed dataset and all user
          actions (shortlist, compare selection, pilot registrations, operator submissions,
          usability feedback, and feature votes) are isolated behind a single repository module:
          <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-slate-900">
            src/services/storageService.ts
          </code>
          .
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-semibold text-slate-900">Running locally</h3>
            <pre className="font-mono text-xs text-slate-700 overflow-x-auto leading-relaxed">
{`npm install
npm run dev
npm run build`}
            </pre>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-semibold text-slate-900">Swapping to Firebase or Supabase</h3>
            <ol className="list-decimal pl-4 text-xs text-slate-600 space-y-1">
              <li>Keep the exported methods in <span className="font-mono">dataService</span>.</li>
              <li>Convert repository methods to <span className="font-mono">async</span> Firestore or Supabase table queries.</li>
              <li>Replace the demo Admin passcode with real Firebase Auth / Supabase Auth + RBAC rules.</li>
              <li>Promote reviewed operator submissions to live listings with verification dates.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Privacy & Data Deletion */}
      <section
        id="privacy"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Trust, Privacy & Data Deletion
          </h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{PILOT_DISCLAIMER}</p>

        <p className="text-sm text-slate-700 leading-relaxed">
          All form data in this pilot build is stored locally in your browser&apos;s{' '}
          <span className="font-mono text-xs">localStorage</span>. We never sell student contact
          information. To request data deletion once a live backend is connected, email{' '}
          <a
            href={`mailto:${PRIVACY_DELETE_EMAIL}?subject=HostelMate%20Data%20Deletion%20Request`}
            className="font-semibold text-teal-800 underline"
          >
            {PRIVACY_DELETE_EMAIL}
          </a>
          . You can also erase all locally saved browser data immediately below:
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear my local browser data</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-lg">
              <span className="text-xs font-medium text-rose-900">
                Erase shortlist, compare list, and saved pilot entries on this device?
              </span>
              <button
                type="button"
                onClick={() => {
                  resetAllLocalData();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md"
              >
                Confirm delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          )}

          <Link
            to="/admin"
            className="text-xs font-semibold text-slate-600 hover:text-teal-800 underline"
          >
            Open Admin Dashboard (Demo)
          </Link>
        </div>
      </section>
    </div>
  );
}
