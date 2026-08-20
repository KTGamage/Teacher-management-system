import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ConfirmDialog from '@/Components/ConfirmDialog';
import toast from 'react-hot-toast';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface Props {
  subjects: Subject[];
}

export default function Index({ subjects }: Props) {
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = useState('');
    const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(search.toLowerCase()) ||
    subject.code.toLowerCase().includes(search.toLowerCase()) ||
    (subject.description ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
    };

    const confirmDelete = () => {
    if (deleteId) {
        destroy(`/admin/subjects/${deleteId}`, {
        onSuccess: () => {
            toast.success('Subject deleted.');
            setConfirmOpen(false);
            setDeleteId(null);
        },
        onError: () => {
            toast.error('Failed to delete.');
            setConfirmOpen(false);
            setDeleteId(null);
        },
        });
    }
    };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Subjects', url: '/admin/subjects' }]}>
      <Head title="Subjects" />
      <PageHeader
        title="Subjects"
        subtitle="Manage subject catalog and course codes."
        actions={(
          <Link href="/admin/subjects/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Subject
          </Link>
        )}
      />
      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="field-input"
        />
      </div>
      <div className="panel overflow-hidden">
        {filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpenIcon className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-700">No subjects found</h3>
                <p className="mt-1 text-sm text-slate-500">
                    {search ? 'Try adjusting your search.' : 'Create your first subject to begin.'}
                </p>
            </div>
        ) : (
            <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{subject.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{subject.code}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{subject.description || '-'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/subjects/${subject.id}/edit`}
                      className="text-slate-500 transition hover:text-darkred"
                      title="Edit"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="text-slate-500 transition hover:text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? It will be removed from all sections."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={processing}
        />
    </AuthenticatedLayout>
  );
}