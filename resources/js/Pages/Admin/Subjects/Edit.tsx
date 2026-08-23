import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
}

interface Props {
  subject: Subject;
}

export default function Edit({ subject }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: subject.name,
    code: subject.code,
    description: subject.description ?? '',
    is_active: subject.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/subjects/${subject.id}`, {
      onSuccess: () => toast.success('Subject updated!'),
      onError: () => toast.error('Check the form for errors.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Subjects', url: '/admin/subjects' },
      { label: 'Edit Subject' }
    ]}>
      <Head title="Edit Subject" />
      <PageHeader
        title="Edit Subject"
        subtitle="Update the subject name, code, description, and active state."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Subject Information</h2>
          <p className="mt-1 text-sm text-slate-500">Edit the subject details stored in the administration module.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Subject Name</label>
            <input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="field-input"
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div>
            <label className="field-label">Subject Code</label>
            <input
              value={data.code}
              onChange={e => setData('code', e.target.value)}
              className="field-input"
              required
            />
            {errors.code && <div className="field-error">{errors.code}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="field-label">Description</label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="field-input"
              rows={4}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
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
                Subject is active
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Update Subject
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
