import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calculator,
  Check,
  FileSpreadsheet,
  Heart,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { SafeImage } from '../components/ui/SafeImage';
import { DEHRADUN_AREAS, DEHRADUN_COLLEGES, ROOM_TYPES } from '../data/constants';
import { IMG_HERO } from '../data/seedListings';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatINR } from '../utils/format';

export function HomePage() {
  useDocumentTitle(
    'Hostels & PGs in Dehradun',
    'Discover and compare hostels and PGs in Dehradun in one place. Built for outstation college students moving to Dehradun.'
  );

  const navigate = useNavigate();
  const [selectedTarget, setSelectedTarget] = useState('All');
  const [maxBudget, setMaxBudget] = useState(11000);
  const [roomType, setRoomType] = useState('All');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedTarget.startsWith('college:')) {
      params.set('college', selectedTarget.replace('college:', ''));
    } else if (selectedTarget.startsWith('area:')) {
      params.set('area', selectedTarget.replace('area:', ''));
    }
    params.set('budget', String(maxBudget));
    if (roomType !== 'All') {
      params.set('room', roomType);
    }
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-8">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium text-teal-800 tracking-normal">
                Dehradun Student Housing Pilot · Free for students
              </p>

              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
                Find your hostel or PG in Dehradun, without the hassle.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Stop piecing together rent, deposits, food details, and college distance from
                scattered WhatsApp chats and broker calls. HostelMate organizes hostel and PG
                information in one standardized format so you can filter, compare side by side,
                and shortlist with clarity.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/listings"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <span>Browse Hostels & PGs</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/pilot"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Join the Free Early-Access Pilot
                </Link>
              </div>

              <p className="text-xs text-slate-500">
                Early-stage pilot · Sample listings shown for demonstration · Direct contact with providers
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-full min-h-[280px]">
                <SafeImage
                  src={IMG_HERO}
                  alt="Modern student hostel neighborhood in Dehradun with green Himalayan foothills in the background"
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Search Bar (full-width row below hero split) */}
          <form
            onSubmit={handleQuickSearch}
            aria-label="Quick hostel and PG search"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-4 space-y-1.5">
              <label
                htmlFor="hero-location"
                className="block text-xs font-semibold text-slate-700"
              >
                College or Dehradun locality
              </label>
              <select
                id="hero-location"
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              >
                <option value="All">All Dehradun colleges & areas</option>
                <optgroup label="Colleges & Universities">
                  {DEHRADUN_COLLEGES.filter((c) => c !== 'Other').map((col) => (
                    <option key={col} value={`college:${col}`}>
                      Near {col}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Localities">
                  {DEHRADUN_AREAS.map((area) => (
                    <option key={area} value={`area:${area}`}>
                      {area}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="hero-budget" className="font-semibold text-slate-700">
                  Max monthly rent
                </label>
                <span className="font-mono font-semibold text-teal-800 tabular-nums">
                  {formatINR(maxBudget)}/mo
                </span>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg px-3.5 py-2 flex flex-col justify-center h-[42px]">
                <input
                  id="hero-budget"
                  type="range"
                  min={4500}
                  max={15000}
                  step={500}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label
                htmlFor="hero-room"
                className="block text-xs font-semibold text-slate-700"
              >
                Room type
              </label>
              <select
                id="hero-room"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              >
                <option value="All">Any</option>
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors h-[42px] whitespace-nowrap"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
            Why finding student accommodation in Dehradun feels harder than it should
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Outstation students arriving for college often spend days chasing incomplete leads
            before they can even narrow down a sensible shortlist.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              num: '01',
              title: 'Scattered information',
              desc: 'Details are split across college WhatsApp groups, Instagram reels, general property sites, brokers, and senior referrals.',
            },
            {
              num: '02',
              title: 'Incomplete & outdated listings',
              desc: 'Listings frequently omit curfew rules, deposit refund terms, food timings, or when rent details were last updated.',
            },
            {
              num: '03',
              title: 'Repeated calls and visits',
              desc: 'Students and parents end up asking the exact same 10 questions on every call and visiting places outside their budget.',
            },
            {
              num: '04',
              title: 'Unclear total monthly cost',
              desc: 'Base rent rarely tells the whole story once security deposits, optional mess fees, electricity, and commute distance are factored in.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-3"
            >
              <span className="font-mono text-xs font-semibold text-teal-800">
                {item.num}.
              </span>
              <h3 className="font-display text-base font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              How HostelMate works
            </h2>
            <p className="text-slate-600">
              A focused 3-step workflow built around how students and parents actually narrow down
              hostels and PGs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01. Filter by budget & college',
                body: 'Narrow Dehradun listings by monthly rent, nearby university (UPES, Graphic Era, DIT, Doon, and more), gender category, food preference, and essential facilities.',
              },
              {
                step: '02. Compare side by side',
                body: 'Select up to 3 options and review rent, deposit, first-month outlay, food details, curfew rules, and college distance in one structured table.',
              },
              {
                step: '03. Shortlist & contact directly',
                body: 'Save your top choices with personal notes, share your shortlist with parents on WhatsApp, and contact the hostel or PG provider directly—with our pre-deposit checklist in hand.',
              },
            ].map((s) => (
              <div key={s.step} className="space-y-2.5 pt-4 border-t border-slate-200">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {s.step}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights (Asymmetric Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            What is included in the pilot
          </h2>
          <p className="text-slate-600">
            Every listing uses the same structure so you can evaluate trade-offs without guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Standardized listing details & side-by-side comparison
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                View monthly rent, security deposit, estimated first-month outlay, food inclusions,
                curfew/visitor rules, approximate distance to your college, last updated date, and
                information source status in one consistent layout.
              </p>
            </div>
            <div>
              <Link
                to="/compare"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950"
              >
                <span>Open comparison tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Student-specific filters
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by college corridor, max distance, monthly budget, single/double/triple room
                occupancy, food option, Wi-Fi, winter hot water, and power backup.
              </p>
            </div>
            <Link
              to="/listings"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950"
            >
              <span>Try filters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Shareable shortlist with personal notes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Save properties, jot down questions from phone calls, and copy a clean summary to
                share with parents on WhatsApp.
              </p>
            </div>
            <Link
              to="/shortlist"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950"
            >
              <span>View shortlist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Monthly Budget Estimator & Pre-Deposit Checklist
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Estimate your realistic monthly living cost in Dehradun (rent, food, laundry,
                commute, miscellaneous) and use our printable checklist of essential questions to
                ask before paying any token or deposit.
              </p>
            </div>
            <div>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950"
              >
                <span>Open student tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Qualitative Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
            How HostelMate compares to typical ways students search
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            A practical look at workflow differences—not a substitute for visiting in person.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 font-semibold text-slate-700 w-1/4">Criteria</th>
                  <th className="px-5 py-4 font-semibold text-teal-900 bg-teal-50/50 w-1/4">
                    HostelMate (Pilot)
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700 w-1/4">
                    College WhatsApp Groups
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700 w-1/4">
                    General Property Sites
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">Information structure</td>
                  <td className="px-5 py-4 bg-teal-50/25 text-slate-800">
                    Standardized fields for rent, deposit, food, rules, and college distance
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Unstructured chat messages and forwarded photos that get buried quickly
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Primarily built for family flats; student-specific details often vary widely
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">Side-by-side comparison</td>
                  <td className="px-5 py-4 bg-teal-50/25 text-slate-800">
                    Built-in table comparing up to 3 options including estimated first-month cost
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Manual notes or spreadsheets created by the student
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Switching across multiple tabs and broker call-backs
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">Information transparency</td>
                  <td className="px-5 py-4 bg-teal-50/25 text-slate-800">
                    Displays information source status and last updated date clearly on every card
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Hard to tell whether a forwarded post is from this semester or last year
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Mixed owner and broker listings; terms often clarified only after calls
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">Student decision helpers</td>
                  <td className="px-5 py-4 bg-teal-50/25 text-slate-800">
                    Shareable shortlist for parents, budget estimator, and pre-deposit checklist
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Relies on asking individual seniors for advice
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Not tailored to hostel/PG student checklists or college corridors
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Coming Soon Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold text-amber-800">
                Planned after pilot validation
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Help decide what we build next
              </h2>
              <p className="text-sm text-slate-600">
                We are intentionally keeping Version 1 focused on discovery and comparison. Tell us
                if these upcoming tools would genuinely help you.
              </p>
            </div>
            <Link
              to="/coming-soon"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950 whitespace-nowrap"
            >
              <span>Vote in Coming Soon Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <Users className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <h3>Roommate Preference Matching</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find compatible roommates heading to the same Dehradun college based on study
                schedule, sleep habits, cleanliness, and budget range.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <Calculator className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <h3>Shared Expense Calculator</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track shared electricity bills, Wi-Fi, water cans, and groceries cleanly with
                roommates once you move in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot CTA + Operator Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium text-teal-300">
              Be one of our first pilot users
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Moving to Dehradun for college soon? Join the free early-access pilot.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Share your target college, budget, and preferences. Discovery and comparison are free
              for students during the pilot—and your feedback directly shapes HostelMate.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" /> Free for students
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" /> No spam or data resale
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" /> Takes 2 minutes
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/pilot"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Join the Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/feedback"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Give Prototype Feedback
            </Link>
          </div>
        </div>

        {/* Small Operator Banner */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Are you a hostel or PG owner in Dehradun?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Submit accurate rent, food, and facility details for free during our pilot to help
                prospective students evaluate your property clearly.
              </p>
            </div>
          </div>
          <Link
            to="/operators"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Submit a listing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
