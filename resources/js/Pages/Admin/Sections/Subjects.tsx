import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';

interface Subject {
  id: number;
  name: string;
  code: string;
  teacher?: string | null; // teacher full name
}

interface Teacher {
  id: number;
  full_name: string;
  teacher_registration_number: string;
}

interface Props {
  section: { id: number; name: string; code: string; class_name?: string | null };
  subjects: Subject[];
  allSubjects: Subject[]; // these don't have teacher
  teachers: Teacher[];
}

export default function Subjects({ section, subjects, allSubjects, teachers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    subject_id: '',
    teacher_id: '',
  });

  const handleAttach = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/sections/${section.id}/subjects`, {
      onSuccess: () => toast.success('Subject added.'),
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
      <Head title={`Subjects for ${section.name}`} />
      <PageHeader
        title={`Manage Subjects for ${section.name}`}
        subtitle={`Assign subjects to this section (Code: ${section.code}${
          section.class_name ? ', Class ' + section.class_name : ''
        })`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Subjects */}
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Current Subjects</h2>
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
              <p>No subjects assigned yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {subjects.map((subject) => (
                <li key={subject.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {subject.name}{' '}
                      <span className="text-xs text-slate-400">({subject.code})</span>
                    </div>
                    {subject.teacher && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        Teacher: {subject.teacher}
                      </div>
                    )}
                  </div>
                  <Link
                    method="delete"
                    as="button"
                    href={`/admin/sections/${section.id}/subjects/${subject.id}`}
                    className="text-red-600 hover:text-red-800"
                    title="Remove subject"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Subject */}
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Add Subject</h2>
          <form onSubmit={handleAttach} className="space-y-4">
            <div>
              <label className="field-label">Subject</label>
              <select
                value={data.subject_id}
                onChange={(e) => setData('subject_id', e.target.value)}
                className="field-input"
                required
              >
                <option value="">Select Subject</option>
                {allSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
              {errors.subject_id && <div className="field-error">{errors.subject_id}</div>}
            </div>

            <div>
              <label className="field-label">Teacher</label>
              <select
                value={data.teacher_id}
                onChange={(e) => setData('teacher_id', e.target.value)}
                className="field-input"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.teacher_registration_number})
                  </option>
                ))}
              </select>
              {errors.teacher_id && <div className="field-error">{errors.teacher_id}</div>}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={processing} className="primary-button">
                Add Subject
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}