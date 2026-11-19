import { useState } from 'react';
import { Building2, CheckCircle2, Info } from 'lucide-react';
import { FormField, inputBaseClass } from '../components/ui/FormField';
import { useApp } from '../context/AppContext';
import {
  DEHRADUN_AREAS,
  FACILITY_OPTIONS,
  ROOM_TYPES,
} from '../data/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dataService } from '../services/storageService';
import {
  FacilityKey,
  FoodOption,
  GenderCategory,
  OperatorSubmission,
  PropertyType,
  RoomType,
  WtpAnswer,
} from '../types';

export function OperatorsPage() {
  useDocumentTitle(
    'For Hostel & PG Operators in Dehradun',
    'List your Dehradun hostel or PG for free during the HostelMate pilot so students receive clear, accurate details upfront.'
  );

  const { showToast } = useApp();

  const [propertyName, setPropertyName] = useState('');
  const [type, setType] = useState<PropertyType>('Hostel');
  const [gender, setGender] = useState<GenderCategory>('Boys');
  const [area, setArea] = useState<string>(DEHRADUN_AREAS[0]);
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(['Double']);
  const [foodOption, setFoodOption] = useState<FoodOption>('Included');
  const [foodDetails, setFoodDetails] = useState('');
  const [facilities, setFacilities] = useState<FacilityKey[]>([
    'wifi',
    'hot_water',
    'power_backup',
  ]);
  const [rulesSummary, setRulesSummary] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [willingToPay, setWillingToPay] = useState<WtpAnswer | ''>('');
  const [operatorPriceRange, setOperatorPriceRange] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<OperatorSubmission | null>(null);

  const toggleRoom = (rt: RoomType) => {
    setRoomTypes((prev) =>
      prev.includes(rt) ? prev.filter((r) => r !== rt) : [...prev, rt]
    );
  };

  const toggleFacility = (key: FacilityKey) => {
    setFacilities((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!propertyName.trim()) next.propertyName = 'Enter the hostel or PG name.';
    if (!address.trim()) next.address = 'Enter the street or landmark address in Dehradun.';
    if (!contactPerson.trim()) next.contactPerson = 'Enter the owner or manager name.';
    if (!phone.trim() || !/^[0-9+\-\s()]{8,15}$/.test(phone.trim())) {
      next.phone = 'Enter a valid contact phone number.';
    }
    if (!monthlyRent || Number(monthlyRent) < 1500) {
      next.monthlyRent = 'Enter a realistic starting monthly rent (₹).';
    }
    if (securityDeposit === '' || Number(securityDeposit) < 0) {
      next.securityDeposit = 'Enter the security deposit amount (₹0 if none).';
    }
    if (roomTypes.length === 0) {
      next.roomTypes = 'Select at least one room occupancy type.';
    }
    if (!rulesSummary.trim()) {
      next.rulesSummary = 'Share key house rules (curfew, visitors, notice period).';
    }
    if (!consentGiven) {
      next.consent = 'Please confirm that the submitted property information is accurate.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please review the highlighted fields before submitting.', 'warning');
      return;
    }

    const record = dataService.addOperatorSubmission({
      propertyName: propertyName.trim(),
      type,
      gender,
      area,
      address: address.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      roomTypes,
      foodOption,
      foodDetails: foodDetails.trim() || undefined,
      facilities,
      rulesSummary: rulesSummary.trim(),
      availabilityNote: availabilityNote.trim() || 'Confirm directly on call',
      willingToPayVisibility: willingToPay || undefined,
      operatorPriceRange: operatorPriceRange || undefined,
      consentGiven,
    });

    setSubmitted(record);
    showToast('Listing details submitted for pilot review.', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Listing received for pilot review
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thank you, <strong className="text-slate-900">{submitted.contactPerson}</strong>. We
            have logged <strong className="text-slate-900">{submitted.propertyName}</strong> (
            {submitted.area}) as <span className="font-medium">Provided by operator</span>. Our
            pilot team will review the submission before publishing it alongside verified pilot
            listings.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setPropertyName('');
              setAddress('');
            }}
            className="px-5 py-2.5 text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg"
          >
            Submit another property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 max-w-2xl">
        <p className="text-xs font-semibold text-teal-800">
          Free during the Dehradun pilot · Direct student enquiries
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900 text-balance">
          For Hostel & PG Operators in Dehradun
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Present your rent, deposit, food, and house rules clearly so prospective outstation
          students and parents contact you with fewer mismatched enquiries.
        </p>
      </div>

      {/* Benefits + Honest Scope */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Free during pilot',
            body: 'Submitting your property details costs ₹0 during the early-access pilot with no brokerage commissions.',
          },
          {
            title: 'Better-informed calls',
            body: 'Students see your room types, budget range, and rules upfront before picking up the phone.',
          },
          {
            title: 'Direct student contact',
            body: 'Students reach out to you directly—HostelMate does not sit in the middle of bookings or payments.',
          },
        ].map((b) => (
          <div
            key={b.title}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-1.5"
          >
            <h2 className="font-display text-sm font-bold text-slate-900">{b.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100/80 px-5 py-3.5 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Pilot transparency:</strong> HostelMate is an early-stage discovery pilot.
          Submitting a listing does not guarantee a specific number of student enquiries or
          bookings.
        </p>
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-7"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <Building2 className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Submit your listing details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Property name"
            htmlFor="op-name"
            required
            error={errors.propertyName}
          >
            <input
              id="op-name"
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. Green Valley Boys Hostel"
              className={inputBaseClass}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type" htmlFor="op-type" required>
              <select
                id="op-type"
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className={inputBaseClass}
              >
                <option value="Hostel">Hostel</option>
                <option value="PG">PG</option>
              </select>
            </FormField>

            <FormField label="Gender" htmlFor="op-gender" required>
              <select
                id="op-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderCategory)}
                className={inputBaseClass}
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </FormField>
          </div>

          <FormField label="Dehradun locality / area" htmlFor="op-area" required>
            <select
              id="op-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={inputBaseClass}
            >
              {DEHRADUN_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Full address / nearest landmark"
            htmlFor="op-address"
            required
            error={errors.address}
          >
            <input
              id="op-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, landmark, Dehradun"
              className={inputBaseClass}
            />
          </FormField>

          <FormField
            label="Contact person name"
            htmlFor="op-person"
            required
            error={errors.contactPerson}
          >
            <input
              id="op-person"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Owner or warden name"
              className={inputBaseClass}
            />
          </FormField>

          <FormField
            label="Contact phone number"
            htmlFor="op-phone"
            required
            error={errors.phone}
          >
            <input
              id="op-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className={inputBaseClass}
            />
          </FormField>

          <FormField
            label="Starting monthly rent (₹)"
            htmlFor="op-rent"
            required
            error={errors.monthlyRent}
          >
            <input
              id="op-rent"
              type="number"
              min={1500}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="e.g. 8500"
              className={`${inputBaseClass} tabular-nums`}
            />
          </FormField>

          <FormField
            label="Security deposit (₹)"
            htmlFor="op-deposit"
            required
            error={errors.securityDeposit}
          >
            <input
              id="op-deposit"
              type="number"
              min={0}
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="e.g. 8500"
              className={`${inputBaseClass} tabular-nums`}
            />
          </FormField>
        </div>

        {/* Room Types */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-800">
            Available room types <span className="text-rose-600">*</span>
          </span>
          <div className="flex flex-wrap gap-2.5">
            {ROOM_TYPES.map((rt) => {
              const checked = roomTypes.includes(rt);
              return (
                <label
                  key={rt}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    checked
                      ? 'border-teal-700 bg-teal-50/70 text-teal-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRoom(rt)}
                    className="rounded accent-teal-700"
                  />
                  <span>{rt}</span>
                </label>
              );
            })}
          </div>
          {errors.roomTypes && (
            <p role="alert" className="text-xs font-medium text-rose-700">
              {errors.roomTypes}
            </p>
          )}
        </div>

        {/* Food */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Food arrangement" htmlFor="op-food" required>
            <select
              id="op-food"
              value={foodOption}
              onChange={(e) => setFoodOption(e.target.value as FoodOption)}
              className={inputBaseClass}
            >
              <option value="Included">Included in rent</option>
              <option value="Optional">Optional (extra cost)</option>
              <option value="Not Included">Not included</option>
            </select>
          </FormField>

          <FormField label="Food details" htmlFor="op-food-details" hint="Optional">
            <input
              id="op-food-details"
              type="text"
              value={foodDetails}
              onChange={(e) => setFoodDetails(e.target.value)}
              placeholder="e.g. 3 veg meals + evening tea"
              className={inputBaseClass}
            />
          </FormField>
        </div>

        {/* Facilities */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-800">Facilities provided</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {FACILITY_OPTIONS.map((fac) => {
              const checked = facilities.includes(fac.key);
              return (
                <label
                  key={fac.key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    checked
                      ? 'border-teal-700 bg-teal-50/70 text-teal-900'
                      : 'border-slate-200 bg-white text-slate-700'
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

        {/* Rules & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="House rules (curfew, visitors, notice period)"
            htmlFor="op-rules"
            required
            error={errors.rulesSummary}
          >
            <textarea
              id="op-rules"
              rows={3}
              value={rulesSummary}
              onChange={(e) => setRulesSummary(e.target.value)}
              placeholder="e.g. 10 PM gate timing, 30 days notice period, parents allowed in reception..."
              className={inputBaseClass}
            />
          </FormField>

          <FormField
            label="Current availability note"
            htmlFor="op-avail"
            hint="Optional"
          >
            <textarea
              id="op-avail"
              rows={3}
              value={availabilityNote}
              onChange={(e) => setAvailabilityNote(e.target.value)}
              placeholder="e.g. Seats open for upcoming semester; call to confirm current rooms."
              className={inputBaseClass}
            />
          </FormField>
        </div>

        {/* Optional Future Plan Validation */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
          <p className="text-xs text-slate-600">
            Optional pilot research question — listing is completely free during the pilot.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Would you consider paying for enhanced visibility or verified-listing services in the future?"
              htmlFor="op-wtp"
            >
              <select
                id="op-wtp"
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
              label="If yes/maybe, what monthly price range seems fair?"
              htmlFor="op-pricerange"
            >
              <select
                id="op-pricerange"
                value={operatorPriceRange}
                onChange={(e) => setOperatorPriceRange(e.target.value)}
                className={inputBaseClass}
              >
                <option value="">Select range (optional)</option>
                <option value="Rs 0 (Free only)">Rs 0 (Free only)</option>
                <option value="Rs 500 - Rs 1,000 / month">Rs 500 – Rs 1,000 / month</option>
                <option value="Rs 1,000 - Rs 2,500 / month">Rs 1,000 – Rs 2,500 / month</option>
                <option value="Rs 2,500+ / month">Rs 2,500+ / month</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Accuracy Consent */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-800">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 rounded accent-teal-700"
            />
            <span>
              I confirm that the rent, deposit, facilities, and rules submitted above are accurate
              to the best of my knowledge, and I consent to HostelMate contacting me to confirm
              updates during the pilot. <span className="text-rose-600">*</span>
            </span>
          </label>
          {errors.consent && (
            <p role="alert" className="text-xs font-medium text-rose-700">
              {errors.consent}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-7 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
        >
          Submit Listing for Pilot Review
        </button>
      </form>
    </div>
  );
}
