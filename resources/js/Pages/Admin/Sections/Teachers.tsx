import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Section {
  id: number;
  name: string;
  code: string;
}

interface Teacher {
  id: number;
  full_name: string;
  teacher_registration_number: string;
}

interface Props {
  section: Section;
  assignedTeachers: Teacher[];
  allTeachers: Teacher[];
}

export default function SectionTeachers({ section, assignedTeachers, allTeachers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    teacher_id: '',
  });

  const handleAttach = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/sections/${section.id}/teachers`, {
      onSuccess: () => toast.success('Teacher assigned.'),
      onError: () => toast.error('Error.'),
    });
  };

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: 'Sections', url: '/admin/sections' },
        { label: section.name },
      ]}
    >
      <Head title={`Teachers for ${section.name}`} />
      <PageHeader
        title={`Manage Teachers for ${section.name}`}
        subtitle={`Assign teachers to this section (Code: ${section.code})`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Assigned Teachers</h2>
          {assignedTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
              <p>No teachers assigned yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {assignedTeachers.map((teacher) => (
                <li key={teacher.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-semibold">{teacher.full_name}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      ({teacher.teacher_registration_number})
                    </span>
                  </div>
                  <Link
                    method="delete"
                    as="button"
                    href={`/admin/sections/${section.id}/teachers/${teacher.id}`}
                    className="text-red-600 hover:text-red-800"
                    title="Remove teacher"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Add Teacher</h2>
          <form onSubmit={handleAttach} className="space-y-4">
            <div>
              <label className="field-label">Teacher</label>
              <select
                value={data.teacher_id}
                onChange={(e) => setData('teacher_id', e.target.value)}
                className="field-input"
                required
              >
                <option value="">Select Teacher</option>
                {allTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.teacher_registration_number})
                  </option>
                ))}
              </select>
              {errors.teacher_id && <div className="field-error">{errors.teacher_id}</div>}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={processing} className="primary-button">
                <PlusIcon className="mr-2 h-5 w-5" /> Assign Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}