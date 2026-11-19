import {
  BookOpen,
  Car,
  Dumbbell,
  Flame,
  Shield,
  Shirt,
  Snowflake,
  Wifi,
  Zap,
} from 'lucide-react';
import { FacilityKey } from '../../types';

export function FacilityIcon({
  facility,
  className = 'w-3.5 h-3.5',
}: {
  facility: FacilityKey;
  className?: string;
}) {
  switch (facility) {
    case 'wifi':
      return <Wifi className={className} aria-hidden="true" />;
    case 'laundry':
      return <Shirt className={className} aria-hidden="true" />;
    case 'ac':
      return <Snowflake className={className} aria-hidden="true" />;
    case 'hot_water':
      return <Flame className={className} aria-hidden="true" />;
    case 'power_backup':
      return <Zap className={className} aria-hidden="true" />;
    case 'cctv':
      return <Shield className={className} aria-hidden="true" />;
    case 'study_room':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'parking':
      return <Car className={className} aria-hidden="true" />;
    case 'gym':
      return <Dumbbell className={className} aria-hidden="true" />;
  }
}
