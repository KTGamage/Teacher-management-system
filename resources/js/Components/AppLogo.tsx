import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface Props {
  compact?: boolean;
  className?: string;
  textClassName?: string;
}

export default function AppLogo({ compact = false, className = '', textClassName = '' }: Props) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src="/images/school-logo.png"
                alt="School Logo"
                className={`object-contain ${compact ? 'h-10 w-10' : 'h-11 w-11'}`}
            />
            {!compact && (
                <div className={`min-w-0 ${textClassName}`}>
                    <p className="text-base font-bold leading-tight">KCC TMS</p>
                    <p className="text-xs font-medium leading-tight opacity-75">
                        Karandeniya Central College
                    </p>
                </div>
            )}
        </div>
    );
}
