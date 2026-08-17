import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';

interface Section {
  id: number;
  name: string;
  code: string;
  academic_year: string;
  is_active: boolean;
  students_count: number;
  classes_count: number;
  head: {
    id: number;
    full_name: string;
    teacher_registration_number: string;
  } | null;
}

interface Props {
  sections: Section[];
}

export default function Index({ sections }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Sections', url: '/admin/sections' }]}>
      <Head title="Sections" />
      <PageHeader
        title="Sections"
        subtitle="Manage academic sections, section heads, student enrollment, and classroom assignments."
        actions={(
          <Link href="/admin/sections/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Section
          </Link>
        )}
      />
      <div className="panel overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section Head</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Academic Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Students</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Classes</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {sections.map((section) => (
              <tr key={section.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{section.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.code}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {section.head ? section.head.full_name : (
                    <span className="text-slate-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.academic_year || '-'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.students_count}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.classes_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {section.is_active ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold leading-5 text-green-800">Active</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-5 text-slate-700">Inactive</span>
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
