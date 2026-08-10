import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-darkred">Section</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
