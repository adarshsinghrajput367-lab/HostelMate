import { Copy, Phone, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PILOT_DISCLAIMER } from '../../data/constants';
import { Listing } from '../../types';
import { InformationStatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface ContactProviderModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export function ContactProviderModal({
  listing,
  onClose,
}: ContactProviderModalProps) {
  const { showToast } = useApp();

  if (!listing) return null;

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(listing.contact.phone);
      showToast('Contact number copied to clipboard.', 'success');
    } catch {
      showToast('Could not copy automatically. Please copy the number manually.', 'warning');
    }
  };

  return (
    <Modal
      open={Boolean(listing)}
      onClose={onClose}
      title={`Contact ${listing.name}`}
      description="HostelMate connects you directly with the property provider. We do not handle bookings, deposits, or rent payments."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600">Listing status</span>
          <InformationStatusBadge status={listing.informationStatus} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div>
            <p className="text-xs text-slate-500">Contact person</p>
            <p className="text-sm font-semibold text-slate-900">
              {listing.contact.personName}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <div>
              <p className="text-xs text-slate-500">Phone number (Sample)</p>
              <p className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                {listing.contact.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={copyPhone}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">Preferred call hours</p>
            <p className="text-sm text-slate-800">{listing.contact.preferredHours}</p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">Locality</p>
            <p className="text-sm text-slate-800">{listing.addressHint}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold mb-1">Before paying any token or deposit</p>
            <p>{PILOT_DISCLAIMER}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href={`tel:${listing.contact.phone}`}
            onClick={(e) => {
              if (listing.informationStatus === 'sample') {
                e.preventDefault();
                showToast('This is a sample prototype phone number, not a live listing.', 'info');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Provider</span>
          </a>
        </div>
      </div>
    </Modal>
  );
}
