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
    academic_year: '',
    section_head_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/sections', {
      onSuccess: () => toast.success('Section created.'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Sections', url: '/admin/sections' }, { label: 'Add Section' }]}>
      <Head title="Add Section" />
      <PageHeader title="Add New Section" subtitle="Create a new section and assign a section head." />
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-xl space-y-6 p-6">
        <div>
          <label className="field-label">Section Name</label>
          <input value={data.name} onChange={e => setData('name', e.target.value)} className="field-input" required />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div>
          <label className="field-label">Code</label>
          <input value={data.code} onChange={e => setData('code', e.target.value)} className="field-input" required />
          {errors.code && <div className="field-error">{errors.code}</div>}
        </div>
        <div>
          <label className="field-label">Academic Year</label>
          <input value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} className="field-input" />
        </div>
        <div>
          <label className="field-label">Section Head</label>
          <select value={data.section_head_id} onChange={e => setData('section_head_id', e.target.value)} className="field-input">
            <option value="">None</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.full_name} ({t.teacher_registration_number})</option>
            ))}
          </select>
          {errors.section_head_id && <div className="field-error">{errors.section_head_id}</div>}
        </div>
        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">Save Section</button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}