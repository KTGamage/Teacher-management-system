import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Props {
  stats: {
    teachers: number;
    students: number;
    sections: number;
  };
}

export default function AdminDashboard({ stats }: Props) {
  const cards = [
    { label: 'Teachers', value: stats.teachers, accent: 'border-darkred', valueClass: 'text-darkred' },
    { label: 'Students', value: stats.students, accent: 'border-gold', valueClass: 'text-amber-500' },
    { label: 'Sections', value: stats.sections, accent: 'border-darkred', valueClass: 'text-darkred' },
  ];

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Admin Dashboard" />
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor the main school records and jump into management tasks from one clean overview."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={`panel border-t-4 ${card.accent} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className={`mt-3 text-4xl font-bold ${card.valueClass}`}>{card.value}</p>
            <p className="mt-3 text-sm text-slate-500">Active records in the system</p>
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
