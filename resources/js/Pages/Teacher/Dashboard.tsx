import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Props {
  teacher: { full_name: string; teacher_registration_number: string } | null;
  timetable: any[]; // placeholder
}

export default function TeacherDashboard({ teacher }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Teacher Dashboard" />
      <PageHeader
        title={`Welcome, ${teacher?.full_name ?? 'Teacher'}`}
        subtitle="View your teaching profile, timetable updates, and class tasks from this workspace."
      />
      <div className="panel p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Registration Number</p>
        <p className="mt-2 text-xl font-bold text-slate-950">{teacher?.teacher_registration_number ?? '-'}</p>
      </div>
    </AuthenticatedLayout>
  );
}
