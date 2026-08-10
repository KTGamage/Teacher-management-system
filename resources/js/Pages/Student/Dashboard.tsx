import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Props {
  student: { full_name: string; registration_number: string; section?: { name: string } } | null;
}

export default function StudentDashboard({ student }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Student Dashboard" />
      <PageHeader
        title={`Welcome, ${student?.full_name ?? 'Student'}`}
        subtitle="Keep track of your class details, marks, and school information from one place."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Registration Number</p>
          <p className="mt-2 text-xl font-bold text-slate-950">{student?.registration_number ?? '-'}</p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Section</p>
          <p className="mt-2 text-xl font-bold text-slate-950">{student?.section?.name ?? 'Not assigned'}</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
