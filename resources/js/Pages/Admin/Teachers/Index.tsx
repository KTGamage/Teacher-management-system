import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ConfirmDialog from '@/Components/ConfirmDialog';
import toast from 'react-hot-toast';

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
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = useState('');
    const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.teacher_registration_number.toLowerCase().includes(search.toLowerCase()) ||
    teacher.contact_number.toLowerCase().includes(search.toLowerCase()) ||
    teacher.user?.email.toLowerCase().includes(search.toLowerCase())
    );
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
    };

    const confirmDelete = () => {
    if (deleteId) {
        destroy(`/admin/teachers/${deleteId}`, {
        onSuccess: () => {
            toast.success('Teacher deleted.');
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
      <div className="mb-4 max-w-md">
            <input
                type="text"
                placeholder="Search teachers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field-input"
            />
        </div>
      <div className="panel overflow-hidden">
        {filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <UsersIcon className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-700">No teachers found</h3>
                <p className="mt-1 text-sm text-slate-500">
                    {search ? 'Try adjusting your search.' : 'Get started by adding a new teacher.'}
                </p>
            </div>
        ) : (
           <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reg No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section Head</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTeachers.map((teacher) => (
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
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/teachers/${teacher.id}/edit`}
                      className="text-slate-500 transition hover:text-darkred"
                      title="View / Edit"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(teacher.id)}
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
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={processing}
        />
    </AuthenticatedLayout>
  );
}