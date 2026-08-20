import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TrashIcon, BookOpenIcon, ArrowPathIcon, BuildingLibraryIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ConfirmDialog from '@/Components/ConfirmDialog';
import toast from 'react-hot-toast';

interface Section {
  id: number;
  name: string;
  code: string;
  academic_year: string | null;
  head: { full_name: string; teacher_registration_number: string } | null;
  students_count: number;
  classes_count: number;
}

interface Props {
  sections: Section[];
}

export default function Index({ sections }: Props) {
  const { delete: destroy, processing } = useForm();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(search.toLowerCase()) ||
    section.code.toLowerCase().includes(search.toLowerCase()) ||
    (section.head?.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      destroy(`/admin/sections/${deleteId}`, {
        onSuccess: () => {
          toast.success('Section deleted.');
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
    <AuthenticatedLayout breadcrumbs={[{ label: 'Sections', url: '/admin/sections' }]}>
      <Head title="Sections" />
      <PageHeader
        title="Sections"
        subtitle="Manage classes, assign section heads, and organize subjects."
        actions={(
          <Link href="/admin/sections/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> Add Section
          </Link>
        )}
      />
      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search sections..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="field-input"
        />
      </div>
      <div className="panel overflow-hidden">
        {filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BuildingLibraryIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No sections found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {search ? 'Try adjusting your search.' : 'Add your first section to get started.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section Head</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSections.map((section) => (
                <tr key={section.id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{section.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.code}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {section.head?.full_name ?? 'Not assigned'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.classes_count}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{section.students_count}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/sections/${section.id}/edit`} className="text-slate-500 hover:text-darkred" title="Edit"><EyeIcon className="h-5 w-5" /></Link>
                      <Link href={`/admin/sections/${section.id}/subjects`} className="text-slate-500 hover:text-darkred" title="Subjects"><BookOpenIcon className="h-5 w-5" /></Link>
                      <Link href={`/admin/sections/${section.id}/classes`} className="text-slate-500 hover:text-darkred" title="Classes"><AcademicCapIcon className="h-5 w-5" /></Link>
                      <Link
                        href={`/admin/sections/${section.id}/teachers`}
                        className="text-slate-500 transition hover:text-darkred"
                        title="Manage Teachers"
                      >
                        <UserGroupIcon className="h-5 w-5" />
                      </Link>
                      <Link method="post" as="button" href={`/admin/sections/${section.id}/duplicate`} className="text-slate-500 hover:text-darkred" title="Duplicate"><ArrowPathIcon className="h-5 w-5" /></Link>
                      <button onClick={() => handleDelete(section.id)} className="text-slate-500 hover:text-red-600" title="Delete"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmDialog open={confirmOpen} title="Delete Section" message="Are you sure you want to delete this section? All students and subject assignments will be removed." onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} loading={processing} />
    </AuthenticatedLayout>
  );
}