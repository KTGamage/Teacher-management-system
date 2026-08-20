import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface Props {
  subject: Subject;
}

export default function Edit({ subject }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: subject.name || '',
    code: subject.code || '',
    description: subject.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/subjects/${subject.id}`, {
      onSuccess: () => toast.success('Subject updated.'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Subjects', url: '/admin/subjects' },
      { label: `Edit ${subject.name}` }
    ]}>
      <Head title={`Edit ${subject.name}`} />
      <PageHeader title={`Edit Subject: ${subject.name}`} subtitle="Update subject details." />
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-xl space-y-6 p-6">
        <div>
          <label className="field-label">Subject Name</label>
          <input value={data.name} onChange={e => setData('name', e.target.value)} className="field-input" required />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div>
          <label className="field-label">Subject Code</label>
          <input value={data.code} onChange={e => setData('code', e.target.value)} className="field-input" required />
          {errors.code && <div className="field-error">{errors.code}</div>}
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="field-input" rows={3} />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>
        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">Update Subject</button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}