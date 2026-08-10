import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}: Props) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeSlashIcon : EyeIcon;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field-input mt-0 pr-11"
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-1.5 my-1 flex w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-darkred/20"
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
        >
          <ToggleIcon className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
