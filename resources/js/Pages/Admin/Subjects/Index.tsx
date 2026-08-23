import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';
import toast from 'react-hot-toast';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
}

interface Props {
  subjects: Subject[];
}

export default function Index({ subjects }: Props) {
  const handleDelete = (subject: Subject) => {
    if (!confirm(`Delete ${subject.name}?`)) {
      return;
    }

    router.delete(`/admin/subjects/${subject.id}`, {
      onSuccess: () => toast.success('Subject deleted.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Subjects', url: '/admin/subjects' }]}>
      <Head title="Subjects" />
      <PageHeader
        title="Subjects"
        subtitle="Manage subject records, codes, descriptions, and activation status across the curriculum."
        actions={(
          <Link href="/admin/subjects/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Subject
          </Link>
        )}
      />
      <div className="panel overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {subjects.map((subject) => (
              <tr key={subject.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{subject.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{subject.code}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {subject.description ? subject.description : <span className="text-slate-400 italic">No description</span>}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {subject.is_active ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold leading-5 text-green-800">Active</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-5 text-slate-700">Inactive</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/subjects/${subject.id}/edit`}
                      className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <PencilSquareIcon className="mr-2 h-4 w-4" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(subject)}
                      className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
