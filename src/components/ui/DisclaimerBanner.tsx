import { Info } from 'lucide-react';
import { PILOT_DISCLAIMER } from '../../data/constants';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      className={`rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 ${
        compact ? 'px-4 py-3 text-xs' : 'px-5 py-4 text-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <Info
          className={`${compact ? 'w-4 h-4 mt-0.5' : 'w-5 h-5 mt-0.5'} shrink-0 text-amber-700`}
          aria-hidden="true"
        />
        <p className="leading-relaxed">
          <span className="font-semibold">Pilot Notice: </span>
          {PILOT_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
