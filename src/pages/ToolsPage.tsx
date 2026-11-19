import { useEffect, useState } from 'react';
import {
  Calculator,
  CheckSquare,
  Copy,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRE_DEPOSIT_CHECKLIST } from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService } from '../services/storageService';
import { formatINR } from '../utils/format';

export function ToolsPage() {
  useDocumentTitle(
    'Budget Estimator & Pre-Deposit Checklist',
    'Estimate your monthly student living costs in Dehradun and use an interactive printable checklist before paying a hostel or PG deposit.'
  );

  const { showToast } = useApp();

  // Budget Estimator State
  const [rent, setRent] = useState(8500);
  const [food, setFood] = useState(2500);
  const [laundry, setLaundry] = useState(500);
  const [transport, setTransport] = useState(1200);
  const [misc, setMisc] = useState(1500);
  const [deposit, setDeposit] = useState(8500);

  const monthlyTotal = rent + food + laundry + transport + misc;
  const firstMonthTotal = monthlyTotal + deposit;
  const semesterTotal = monthlyTotal * 5 + deposit;

  const costRows = [
    { label: 'Monthly Rent', amount: rent, color: 'bg-teal-700' },
    { label: 'Food / Tiffin / Mess', amount: food, color: 'bg-amber-500' },
    { label: 'Commute / Transport', amount: transport, color: 'bg-slate-700' },
    { label: 'Laundry & Utilities', amount: laundry, color: 'bg-teal-500' },
    { label: 'Miscellaneous & Study', amount: misc, color: 'bg-slate-400' },
  ];

  // Checklist State persisted locally
  const [checkedIds, setCheckedIds] = useState<string[]>(() =>
    dataService.getCheckedChecklistIds()
  );

  useEffect(() => {
    dataService.saveCheckedChecklistIds(checkedIds);
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const copyChecklist = async () => {
    const text = [
      'HostelMate — Pre-Deposit Checklist for Dehradun Hostels & PGs',
      '-------------------------------------------------------------',
      ...PRE_DEPOSIT_CHECKLIST.map(
        (item, idx) =>
          `${checkedIds.includes(item.id) ? '[x]' : '[ ]'} ${idx + 1}. [${item.category}] ${item.question}`
      ),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Pre-deposit checklist copied to clipboard.', 'success');
    } catch {
      showToast('Could not copy automatically. Use the Print button instead.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-semibold text-teal-800">
          Student decision helpers · Runs privately in your browser
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Budget Estimator & Pre-Deposit Checklist
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Two practical tools to help you plan your total monthly student budget in Dehradun and
          ask the right questions before paying any security deposit.
        </p>
      </div>

      {/* Tool 1: Monthly Budget Estimator */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Calculator className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                01. Monthly Budget Estimator
              </h2>
              <p className="text-xs text-slate-500">
                Adjust each category to see your recurring monthly and first-month move-in cost.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setRent(8500);
              setFood(2500);
              setLaundry(500);
              setTransport(1200);
              setMisc(1500);
              setDeposit(8500);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'est-rent', label: 'Monthly Rent (₹)', value: rent, set: setRent, max: 20000, step: 500 },
              { id: 'est-food', label: 'Extra Food / Mess (₹)', value: food, set: setFood, max: 8000, step: 250 },
              { id: 'est-laundry', label: 'Laundry & Electricity (₹)', value: laundry, set: setLaundry, max: 4000, step: 100 },
              { id: 'est-transport', label: 'College Commute / Auto (₹)', value: transport, set: setTransport, max: 5000, step: 100 },
              { id: 'est-misc', label: 'Misc. (Wi-Fi, stationery, personal) (₹)', value: misc, set: setMisc, max: 8000, step: 250 },
              { id: 'est-deposit', label: 'One-Time Security Deposit (₹)', value: deposit, set: setDeposit, max: 25000, step: 500 },
            ].map((field) => (
              <div
                key={field.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={field.id} className="text-xs font-semibold text-slate-700">
                    {field.label}
                  </label>
                  <span className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                    {formatINR(field.value)}
                  </span>
                </div>
                <input
                  id={field.id}
                  type="number"
                  min={0}
                  max={50000}
                  step={field.step}
                  value={field.value}
                  onChange={(e) => field.set(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-teal-700 focus:outline-none"
                />
                <input
                  type="range"
                  min={0}
                  max={field.max}
                  step={field.step}
                  value={Math.min(field.value, field.max)}
                  onChange={(e) => field.set(Number(e.target.value))}
                  aria-label={`${field.label} slider`}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Summary Output */}
          <div className="lg:col-span-5 rounded-xl bg-slate-900 text-white p-6 space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-slate-300">Estimated recurring monthly cost</p>
              <p className="font-display text-4xl font-extrabold tabular-nums">
                {formatINR(monthlyTotal)}
                <span className="text-sm font-normal text-slate-300"> / mo</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-400">1st-month move-in outlay</p>
                <p className="font-mono text-lg font-semibold text-amber-300 tabular-nums mt-0.5">
                  {formatINR(firstMonthTotal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">5-month semester est.</p>
                <p className="font-mono text-lg font-semibold text-white tabular-nums mt-0.5">
                  {formatINR(semesterTotal)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300">Monthly cost breakdown</p>
              {costRows.map((row) => {
                const pct = monthlyTotal > 0 ? Math.round((row.amount / monthlyTotal) * 100) : 0;
                return (
                  <div key={row.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{row.label}</span>
                      <span className="font-mono tabular-nums text-white">
                        {formatINR(row.amount)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${row.color} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Note: If your hostel includes full mess meals, set Extra Food to ₹0–₹1,000 for
              occasional snacks.
            </p>
          </div>
        </div>
      </section>

      {/* Tool 2: Pre-Deposit Checklist */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                02. Interactive Pre-Deposit Checklist
              </h2>
              <p className="text-xs text-slate-600 tabular-nums">
                {checkedIds.length} of {PRE_DEPOSIT_CHECKLIST.length} questions checked (saved
                automatically on this device)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            {checkedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCheckedIds([])}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Uncheck all
              </button>
            )}
            <button
              type="button"
              onClick={copyChecklist}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy checklist</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {PRE_DEPOSIT_CHECKLIST.map((item) => {
            const checked = checkedIds.includes(item.id);
            return (
              <label
                key={item.id}
                className={`py-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                  checked ? 'opacity-70' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 w-4 h-4 rounded accent-teal-700 shrink-0"
                />
                <div className="space-y-1">
                  <p
                    className={`text-sm font-medium ${
                      checked ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    <span className="font-semibold text-teal-800 mr-1.5">
                      {item.category}:
                    </span>
                    {item.question}
                  </p>
                  <p className="text-xs text-slate-500">{item.whyItMatters}</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
