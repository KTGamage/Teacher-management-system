import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

interface Teacher {
  id: number;
  full_name: string;
  teacher_registration_number: string;
}

interface Props {
  teachers: Teacher[];
}

export default function Create({ teachers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    academic_year: new Date().getFullYear().toString(),
    section_head_id: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/sections', {
      onSuccess: () => toast.success('Section created!'),
      onError: () => toast.error('Check the form for errors.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Sections', url: '/admin/sections' },
      { label: 'Add Section' }
    ]}>
      <Head title="Add Section" />
      <PageHeader
        title="Add New Section"
        subtitle="Create an academic section with a section head, year, and status for organizing students and classes."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Section Information</h2>
          <p className="mt-1 text-sm text-slate-500">Enter section name, code, academic year, and assign a section head.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Section Name</label>
            <input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="field-input"
              placeholder="e.g., Grade 10A"
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div>
            <label className="field-label">Section Code</label>
            <input
              value={data.code}
              onChange={e => setData('code', e.target.value)}
              className="field-input"
              placeholder="e.g., 10A"
              required
            />
            {errors.code && <div className="field-error">{errors.code}</div>}
          </div>

          <div>
            <label className="field-label">Academic Year</label>
            <input
              value={data.academic_year}
              onChange={e => setData('academic_year', e.target.value)}
              className="field-input"
              placeholder="e.g., 2024"
            />
            {errors.academic_year && <div className="field-error">{errors.academic_year}</div>}
          </div>

          <div>
            <label className="field-label">Section Head</label>
            <select
              value={data.section_head_id}
              onChange={e => setData('section_head_id', e.target.value)}
              className="field-input"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name} ({teacher.teacher_registration_number})
                </option>
              ))}
            </select>
            {errors.section_head_id && <div className="field-error">{errors.section_head_id}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-darkred focus:ring-darkred"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">
                Section is active
              </span>
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Inactive sections won't appear in student enrollment or timetable management.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Save Section
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
