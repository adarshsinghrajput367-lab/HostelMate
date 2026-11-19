import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { FormField, inputBaseClass } from '../components/ui/FormField';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DEHRADUN_COLLEGES } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService } from '../services/storageService';
import { FeedbackEntry } from '../types';

export function FeedbackPage() {
  useDocumentTitle(
    'Prototype Usability Test & Feedback',
    'Complete 3 quick student tasks and share honest feedback on whether HostelMate makes comparing Dehradun hostels and PGs easier.'
  );

  const { showToast } = useApp();
  const { user } = useAuth();
  const [studentName, setStudentName] = useState(user?.displayName || '');

  useEffect(() => {
    if (user?.displayName && !studentName) setStudentName(user.displayName);
  }, [user, studentName]);
  const [college, setCollege] = useState('');
  const [taskFindUnderBudget, setTaskFindUnderBudget] = useState<'Yes' | 'No'>('Yes');
  const [taskCompareTwo, setTaskCompareTwo] = useState<'Yes' | 'No'>('Yes');
  const [taskShortlistTwo, setTaskShortlistTwo] = useState<'Yes' | 'No'>('Yes');
  const [timeTakenMinutes, setTimeTakenMinutes] = useState('');
  const [usefulnessRating, setUsefulnessRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [comparisonUseful, setComparisonUseful] = useState<'Yes' | 'Somewhat' | 'No'>('Yes');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<FeedbackEntry | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share at least one short comment on what worked or felt confusing.');
      return;
    }
    setError('');

    const entry = dataService.addFeedbackEntry({
      studentName: studentName.trim() || undefined,
      college: college || undefined,
      taskFindUnderBudget,
      taskCompareTwo,
      taskShortlistTwo,
      timeTakenMinutes: timeTakenMinutes ? Number(timeTakenMinutes) : undefined,
      usefulnessRating,
      comparisonUseful,
      comment: comment.trim(),
    });

    setSubmitted(entry);
    showToast('Prototype feedback recorded. Thank you for testing HostelMate!', 'success');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Thank you for testing the HostelMate prototype
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your usability test responses have been saved locally and are reflected in the pilot
            evaluation summary.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/pilot"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
            >
              Join Early-Access Pilot
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(null);
                setComment('');
              }}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Submit another session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-teal-800">
          Student usability study · 2 minutes
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Prototype Test & Student Feedback
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We are testing whether standardized listings and side-by-side comparison genuinely help
          students narrow down hostels and PGs in Dehradun. Try the 3 short tasks below, then let
          us know how it went.
        </p>
      </div>

      {/* 3 Suggested Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
          <ClipboardCheck className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2>Try these 3 tasks first</h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <li className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs font-semibold text-teal-800">Task 1</span>
            <p className="font-semibold text-slate-900">Find a place under your budget</p>
            <p className="text-xs text-slate-600">
              Use the budget slider and college filter on the{' '}
              <Link to="/listings" className="underline text-teal-800">
                Browse page
              </Link>
              .
            </p>
          </li>
          <li className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs font-semibold text-teal-800">Task 2</span>
            <p className="font-semibold text-slate-900">Compare two options</p>
            <p className="text-xs text-slate-600">
              Select 2+ listings and review rent, deposit, and rules on{' '}
              <Link to="/compare" className="underline text-teal-800">
                Compare
              </Link>
              .
            </p>
          </li>
          <li className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs font-semibold text-teal-800">Task 3</span>
            <p className="font-semibold text-slate-900">Shortlist two options</p>
            <p className="text-xs text-slate-600">
              Save 2+ places and add a note or preview sharing on{' '}
              <Link to="/shortlist" className="underline text-teal-800">
                Shortlist
              </Link>
              .
            </p>
          </li>
        </ol>
      </div>

      {/* Usability Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Your name" htmlFor="fb-name" hint="Optional">
            <input
              id="fb-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Anonymous is fine"
              className={inputBaseClass}
            />
          </FormField>

          <FormField label="College / University" htmlFor="fb-college" hint="Optional">
            <select
              id="fb-college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">Select college</option>
              {DEHRADUN_COLLEGES.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Task Completion Radios */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Task completion</h3>

          {[
            {
              label: '1. Were you able to find a hostel or PG under your monthly budget?',
              val: taskFindUnderBudget,
              set: setTaskFindUnderBudget,
            },
            {
              label: '2. Were you able to compare at least two options side by side?',
              val: taskCompareTwo,
              set: setTaskCompareTwo,
            },
            {
              label: '3. Did you shortlist two or more options?',
              val: taskShortlistTwo,
              set: setTaskShortlistTwo,
            },
          ].map((task) => (
            <div
              key={task.label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200"
            >
              <span className="text-sm text-slate-800">{task.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                {(['Yes', 'No'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => task.set(opt)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                      task.val === opt
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Time & Usefulness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <FormField
            label="Approximate time taken (minutes)"
            htmlFor="fb-time"
            hint="Optional"
          >
            <input
              id="fb-time"
              type="number"
              min={1}
              max={60}
              value={timeTakenMinutes}
              onChange={(e) => setTimeTakenMinutes(e.target.value)}
              placeholder="e.g. 4"
              className={`${inputBaseClass} tabular-nums`}
            />
          </FormField>

          <FormField label="Was the side-by-side comparison useful?" htmlFor="fb-comp" required>
            <select
              id="fb-comp"
              value={comparisonUseful}
              onChange={(e) =>
                setComparisonUseful(e.target.value as 'Yes' | 'Somewhat' | 'No')
              }
              className={inputBaseClass}
            >
              <option value="Yes">Yes — clearly helpful</option>
              <option value="Somewhat">Somewhat useful</option>
              <option value="No">No — not really needed</option>
            </select>
          </FormField>
        </div>

        {/* Rating 1-5 */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-800">
            Overall usefulness rating (1 = Not useful, 5 = Very useful)
          </span>
          <div className="flex items-center gap-2">
            {([1, 2, 3, 4, 5] as const).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setUsefulnessRating(num)}
                className={`w-11 h-11 rounded-lg border text-sm font-bold tabular-nums transition-colors ${
                  usefulnessRating === num
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="What felt most helpful, missing, or confusing?"
          htmlFor="fb-comment"
          required
          error={error}
        >
          <textarea
            id="fb-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. Would love to see exact electricity rates per unit or bus stop distance..."
            className={inputBaseClass}
          />
        </FormField>

        <button
          type="submit"
          className="px-6 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
        >
          Submit Prototype Feedback
        </button>
      </form>
    </div>
  );
}
