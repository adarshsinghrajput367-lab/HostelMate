import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Share2, Shield } from 'lucide-react';
import { FormField, inputBaseClass } from '../components/ui/FormField';
import { GoogleSignInButton } from '../components/ui/GoogleSignInButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  DEHRADUN_COLLEGES,
  FACILITY_OPTIONS,
  PRIVACY_DELETE_EMAIL,
  ROOM_TYPES,
} from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService } from '../services/storageService';
import {
  AcquisitionChannel,
  FacilityKey,
  PriceSensitivity,
  Registration,
  RoomType,
  WtpAnswer,
} from '../types';

const CHANNELS: AcquisitionChannel[] = [
  'College group',
  'Instagram',
  'Friend',
  'Campus ambassador',
  'Other',
];

const PRICE_OPTIONS: PriceSensitivity[] = [
  'Rs 0',
  'Rs 99',
  'Rs 149',
  'Rs 199',
  'Rs 249',
];

export function PilotPage() {
  useDocumentTitle(
    'Join the Free Early-Access Pilot',
    'Register your Dehradun hostel or PG requirements and help us test a clearer way to discover and compare student accommodation.'
  );

  const { showToast } = useApp();
  const { user, signingIn, signInWithGoogle } = useAuth();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName);
    if (user?.email && !email) setEmail(user.email);
  }, [user, name, email]);
  const [college, setCollege] = useState<string>(DEHRADUN_COLLEGES[0]);
  const [collegeOther, setCollegeOther] = useState('');
  const [courseAndYear, setCourseAndYear] = useState('');
  const [homeCityState, setHomeCityState] = useState('');
  const [budgetMin, setBudgetMin] = useState('5000');
  const [budgetMax, setBudgetMax] = useState('10000');
  const [preferredRoomType, setPreferredRoomType] = useState<RoomType | 'Flexible'>('Double');
  const [foodPreference, setFoodPreference] =
    useState<Registration['foodPreference']>('Must include food');
  const [mustHaveFacilities, setMustHaveFacilities] = useState<FacilityKey[]>([
    'wifi',
    'hot_water',
  ]);
  const [moveInTimeframe, setMoveInTimeframe] = useState('Next 1–2 months');
  const [alreadyFound, setAlreadyFound] = useState<'Yes' | 'No' | 'Partly'>('No');
  const [channel, setChannel] = useState<AcquisitionChannel>('College group');
  const [willingToPay, setWillingToPay] = useState<WtpAnswer | ''>('');
  const [priceSensitivity, setPriceSensitivity] = useState<PriceSensitivity | ''>('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRecord, setSubmittedRecord] = useState<Registration | null>(null);

  const toggleFacility = (key: FacilityKey) => {
    setMustHaveFacilities((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = 'Please enter your full name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (phone.trim() && !/^[0-9+\-\s()]{8,15}$/.test(phone.trim())) {
      next.phone = 'Enter a valid 10-digit phone or WhatsApp number, or leave blank.';
    }
    if (college === 'Other' && !collegeOther.trim()) {
      next.collegeOther = 'Please specify your college or university name.';
    }
    if (!courseAndYear.trim()) {
      next.courseAndYear = 'Please enter your course and year (e.g., B.Tech 1st Year).';
    }
    if (!homeCityState.trim()) {
      next.homeCityState = 'Please enter your home city and state.';
    }
    const minVal = Number(budgetMin);
    const maxVal = Number(budgetMax);
    if (!minVal || minVal < 2000 || !maxVal || maxVal < minVal) {
      next.budget = 'Enter a valid monthly budget range where max is greater than or equal to min.';
    }
    if (!consentGiven) {
      next.consent = 'Please confirm your consent so we can save your pilot registration.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please check the highlighted form fields.', 'warning');
      return;
    }

    const result = dataService.addRegistration({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      college,
      collegeOther: college === 'Other' ? collegeOther.trim() : undefined,
      courseAndYear: courseAndYear.trim(),
      homeCityState: homeCityState.trim(),
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      preferredRoomType,
      foodPreference,
      mustHaveFacilities,
      moveInTimeframe,
      alreadyFoundAccommodation: alreadyFound,
      channel,
      willingToPayPremium: willingToPay || undefined,
      priceSensitivity: priceSensitivity || undefined,
      consentGiven,
    });

    if (!result.ok) {
      setErrors({ email: result.error });
      showToast(result.error, 'warning');
      return;
    }

    setSubmittedRecord(result.record);
    showToast('You are registered for the HostelMate early-access pilot!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareWithFriend = async () => {
    const shareText = `Hey! I just joined the free HostelMate early-access pilot to compare hostels and PGs in Dehradun in one place. Check it out: ${window.location.origin}/pilot`;
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Invite message copied to clipboard—share it in your college group!', 'success');
    } catch {
      showToast('Could not copy automatically. Share this page URL with your friend.', 'info');
    }
  };

  if (submittedRecord) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Thank you for joining the pilot, {submittedRecord.name}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We have recorded your accommodation requirements for{' '}
              <strong className="text-slate-900">
                {submittedRecord.college === 'Other'
                  ? submittedRecord.collegeOther
                  : submittedRecord.college}
              </strong>
              .
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-left text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">What happens next?</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                Explore the sample Dehradun listings now to test filters, side-by-side comparison,
                and shortlisting.
              </li>
              <li>
                Share quick usability feedback after trying the flow—it directly shapes which
                localities and operator listings we add first.
              </li>
              <li>
                As operator-provided listings are checked for your target corridor, we will notify
                early-access pilot students.
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/listings"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              Browse Sample Listings
            </Link>
            <Link
              to="/feedback"
              className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Take 2-Min Prototype Test
            </Link>
            <button
              type="button"
              onClick={handleShareWithFriend}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with a friend</span>
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
          Free for students · Early-access pilot
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug text-balance">
          Join the free HostelMate early-access pilot: tell us your accommodation requirements and
          help us test a simpler way to discover and compare hostels and PGs in Dehradun.
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Be one of our first pilot users. Discovery and comparison are free for students. Your
          responses help us prioritize localities, check listing details with local operators, and
          decide what to build next.
        </p>
      </div>

      {user ? (
        <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-teal-950">
          <span>
            Signed in with Google as <strong>{user.email}</strong> — your name and email have been
            pre-filled below.
          </span>
          <Link to="/login" className="font-semibold text-teal-800 hover:underline whitespace-nowrap">
            Manage account
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-900">
              Want to auto-fill your name and email?
            </p>
            <p className="text-xs text-slate-600">
              Sign in with your Google email account (optional) to speed up registration.
            </p>
          </div>
          <GoogleSignInButton
            onClick={async () => {
              const signedIn = await signInWithGoogle();
              if (signedIn) {
                showToast(`Signed in as ${signedIn.email}`, 'success');
              }
            }}
            loading={signingIn}
            label="Sign in with Google"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-7"
      >
        {/* Student Details */}
        <section className="space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
            01. About You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full name" htmlFor="pilot-name" required error={errors.name}>
              <input
                id="pilot-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className={inputBaseClass}
              />
            </FormField>

            <FormField label="Email address" htmlFor="pilot-email" required error={errors.email}>
              <input
                id="pilot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputBaseClass}
              />
            </FormField>

            <FormField
              label="Phone / WhatsApp"
              htmlFor="pilot-phone"
              hint="Optional"
              error={errors.phone}
            >
              <input
                id="pilot-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className={inputBaseClass}
              />
            </FormField>

            <FormField
              label="Home city & state"
              htmlFor="pilot-home"
              required
              error={errors.homeCityState}
            >
              <input
                id="pilot-home"
                type="text"
                value={homeCityState}
                onChange={(e) => setHomeCityState(e.target.value)}
                placeholder="e.g. Lucknow, UP"
                className={inputBaseClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="College / University in Dehradun" htmlFor="pilot-college" required>
              <select
                id="pilot-college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className={inputBaseClass}
              >
                {DEHRADUN_COLLEGES.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Course & Year"
              htmlFor="pilot-course"
              required
              error={errors.courseAndYear}
            >
              <input
                id="pilot-course"
                type="text"
                value={courseAndYear}
                onChange={(e) => setCourseAndYear(e.target.value)}
                placeholder="e.g. B.Tech CSE, 1st Year"
                className={inputBaseClass}
              />
            </FormField>
          </div>

          {college === 'Other' && (
            <FormField
              label="Specify your college / institution"
              htmlFor="pilot-college-other"
              required
              error={errors.collegeOther}
            >
              <input
                id="pilot-college-other"
                type="text"
                value={collegeOther}
                onChange={(e) => setCollegeOther(e.target.value)}
                placeholder="Enter your college name"
                className={inputBaseClass}
              />
            </FormField>
          )}
        </section>

        {/* Accommodation Requirements */}
        <section className="space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
            02. Accommodation Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Monthly budget min (₹)"
              htmlFor="pilot-bmin"
              required
              error={errors.budget}
            >
              <input
                id="pilot-bmin"
                type="number"
                min={2000}
                max={30000}
                step={500}
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className={`${inputBaseClass} tabular-nums`}
              />
            </FormField>

            <FormField label="Monthly budget max (₹)" htmlFor="pilot-bmax" required>
              <input
                id="pilot-bmax"
                type="number"
                min={3000}
                max={35000}
                step={500}
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className={`${inputBaseClass} tabular-nums`}
              />
            </FormField>

            <FormField label="Preferred room type" htmlFor="pilot-room">
              <select
                id="pilot-room"
                value={preferredRoomType}
                onChange={(e) =>
                  setPreferredRoomType(e.target.value as RoomType | 'Flexible')
                }
                className={inputBaseClass}
              >
                <option value="Flexible">Flexible</option>
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Food preference" htmlFor="pilot-food">
              <select
                id="pilot-food"
                value={foodPreference}
                onChange={(e) =>
                  setFoodPreference(
                    e.target.value as Registration['foodPreference']
                  )
                }
                className={inputBaseClass}
              >
                <option value="Must include food">Must include food</option>
                <option value="Optional / flexible">Optional / flexible</option>
                <option value="Self-arranged">Self-arranged / kitchen access</option>
              </select>
            </FormField>

            <FormField label="Expected move-in timeframe" htmlFor="pilot-movein">
              <select
                id="pilot-movein"
                value={moveInTimeframe}
                onChange={(e) => setMoveInTimeframe(e.target.value)}
                className={inputBaseClass}
              >
                <option value="Within 2 weeks">Within 2 weeks</option>
                <option value="Next 1–2 months">Next 1–2 months</option>
                <option value="Next semester (3–6 months)">Next semester (3–6 months)</option>
                <option value="Just exploring early">Just exploring early</option>
              </select>
            </FormField>

            <FormField label="Have you already found accommodation?" htmlFor="pilot-found">
              <select
                id="pilot-found"
                value={alreadyFound}
                onChange={(e) =>
                  setAlreadyFound(e.target.value as 'Yes' | 'No' | 'Partly')
                }
                className={inputBaseClass}
              >
                <option value="No">No — still searching</option>
                <option value="Partly">Partly — shortlisted a few / temporary stay</option>
                <option value="Yes">Yes — already secured one</option>
              </select>
            </FormField>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-slate-800">
              Must-have facilities
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FACILITY_OPTIONS.map((fac) => {
                const checked = mustHaveFacilities.includes(fac.key);
                return (
                  <label
                    key={fac.key}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
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
                    <span>{fac.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* Channel & Optional Research Questions */}
        <section className="space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
            03. Pilot Research Questions
          </h2>

          <FormField label="How did you hear about HostelMate?" htmlFor="pilot-channel" required>
            <select
              id="pilot-channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as AcquisitionChannel)}
              className={inputBaseClass}
            >
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
            <p className="text-xs text-slate-600">
              Optional survey — discovery and comparison are free in HostelMate. These two
              questions help us test whether optional add-on tools would ever be worth building
              after the pilot.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Would you pay a small fee for premium features like enhanced roommate preferences or comparison tools?"
                htmlFor="pilot-wtp"
              >
                <select
                  id="pilot-wtp"
                  value={willingToPay}
                  onChange={(e) => setWillingToPay(e.target.value as WtpAnswer | '')}
                  className={inputBaseClass}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Yes">Yes</option>
                  <option value="Maybe">Maybe</option>
                  <option value="No">No</option>
                </select>
              </FormField>

              <FormField
                label="If yes or maybe, what monthly price feels reasonable?"
                htmlFor="pilot-price"
              >
                <select
                  id="pilot-price"
                  value={priceSensitivity}
                  onChange={(e) =>
                    setPriceSensitivity(e.target.value as PriceSensitivity | '')
                  }
                  className={inputBaseClass}
                >
                  <option value="">Select a range (optional)</option>
                  {PRICE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p} / month
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </section>

        {/* Privacy & Consent */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
            <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Privacy note:</strong> Your details are used solely to run the HostelMate
              early-access pilot and understand student accommodation needs in Dehradun. We never
              sell your data to brokers or third parties. You can request deletion at any time via{' '}
              <a
                href={`mailto:${PRIVACY_DELETE_EMAIL}?subject=Data%20Deletion%20Request`}
                className="underline text-teal-800"
              >
                {PRIVACY_DELETE_EMAIL}
              </a>
              .
            </p>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-800">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 rounded accent-teal-700"
            />
            <span>
              I agree to share the above preferences for the HostelMate Dehradun early-access
              pilot. <span className="text-rose-600">*</span>
            </span>
          </label>
          {errors.consent && (
            <p role="alert" className="text-xs font-medium text-rose-700">
              {errors.consent}
            </p>
          )}
        </section>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
          >
            Complete Free Pilot Registration
          </button>
        </div>
      </form>
    </div>
  );
}
