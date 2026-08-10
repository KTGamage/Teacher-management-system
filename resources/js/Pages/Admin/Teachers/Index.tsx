import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';

interface Teacher {
  id: number;
  full_name: string;
  teacher_registration_number: string;
  contact_number: string;
  is_section_head: boolean;
  user: { email: string };
}

interface Props {
  teachers: Teacher[];
}

export default function Index({ teachers }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Teachers', url: '/admin/teachers' }]}>
      <Head title="Teachers" />
      <PageHeader
        title="Teachers"
        subtitle="Review staff records, contact details, registration numbers, and section head assignments."
        actions={(
          <Link href="/admin/teachers/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Teacher
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
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section Head</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{teacher.full_name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{teacher.teacher_registration_number}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{teacher.contact_number}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{teacher.user?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {teacher.is_section_head ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold leading-5 text-green-800">Yes</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-5 text-slate-700">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
