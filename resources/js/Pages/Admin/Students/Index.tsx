import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';

interface Student {
  id: number;
  full_name: string;
  registration_number: string;
  contact_number: string;
  guardian_name: string;
  section: { name: string } | null;
}

interface Props {
  students: Student[];
}

export default function Index({ students }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Students', url: '/admin/students' }]}>
      <Head title="Students" />
      <PageHeader
        title="Students"
        subtitle="Browse student records, guardian details, and assigned sections in one organized table."
        actions={(
          <Link href="/admin/students/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Student
          </Link>
        )}
      />
      <div className="panel overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reg No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Guardian</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {students.map((student) => (
              <tr key={student.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{student.full_name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.registration_number}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.contact_number}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.guardian_name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.section?.name ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
