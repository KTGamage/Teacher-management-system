import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface Props {
  compact?: boolean;
  className?: string;
  textClassName?: string;
}

export default function AppLogo({ compact = false, className = '', textClassName = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/50 bg-gold text-darkred shadow-sm">
        <AcademicCapIcon className="h-6 w-6" />
      </div>
      {!compact && (
        <div className={`min-w-0 ${textClassName}`}>
          <p className="text-base font-bold leading-tight">KCC TMS</p>
          <p className="text-xs font-medium leading-tight opacity-75">Karandeniya Central College</p>
        </div>
      )}
    </div>
  );
}
