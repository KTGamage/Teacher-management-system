import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TrashIcon, AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PageHeader from '@/Components/PageHeader';
import ConfirmDialog from '@/Components/ConfirmDialog';
import toast from 'react-hot-toast';

interface Student {
  id: number;
  full_name: string;
  registration_number: string;
  contact_number: string;
  guardian_name: string;
  section: { name: string } | null;
  class_room: { name: string } | null;
}

interface Props {
  students: Student[];
}

export default function Index({ students }: Props) {
  const { delete: destroy, processing } = useForm();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.registration_number.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_number.toLowerCase().includes(search.toLowerCase()) ||
    s.guardian_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.section?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true); };

  const confirmDelete = () => {
    if (deleteId) {
      destroy(`/admin/students/${deleteId}`, {
        onSuccess: () => { toast.success('Student deleted.'); setConfirmOpen(false); setDeleteId(null); },
        onError: () => { toast.error('Failed to delete.'); setConfirmOpen(false); setDeleteId(null); },
      });
    }
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Students', url: '/admin/students' }]}>
      <Head title="Students" />
      <PageHeader
        title="Students"
        subtitle="Browse student records, guardian details, and assigned sections in one organized table."
        actions={<Link href="/admin/students/create" className="primary-button"><PlusIcon className="mr-2 h-5 w-5" /> Add Student</Link>}
      />
      <div className="mb-4 max-w-md">
        <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="field-input" />
      </div>
      <div className="panel overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AcademicCapIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No students found</h3>
            <p className="mt-1 text-sm text-slate-500">{search ? 'Try adjusting your search.' : 'Add your first student to get started.'}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reg No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Guardian</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Section</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{student.full_name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.registration_number}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.contact_number}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.guardian_name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.section?.name ?? '-'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{student.class_room?.name ?? '-'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/students/${student.id}/edit`} className="text-slate-500 hover:text-darkred" title="Edit"><EyeIcon className="h-5 w-5" /></Link>
                      <Link href={`/admin/students/${student.id}/marks`} className="text-slate-500 hover:text-darkred" title="View Marks"><ChartBarIcon className="h-5 w-5" /></Link>
                      <button onClick={() => handleDelete(student.id)} className="text-slate-500 hover:text-red-600" title="Delete"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmDialog open={confirmOpen} title="Delete Student" message="Are you sure you want to delete this student? All related records will be removed." onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} loading={processing} />
    </AuthenticatedLayout>
  );
}