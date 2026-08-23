import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/subjects', {
      onSuccess: () => toast.success('Subject created!'),
      onError: () => toast.error('Check the form for errors.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Subjects', url: '/admin/subjects' },
      { label: 'Add Subject' }
    ]}>
      <Head title="Add Subject" />
      <PageHeader
        title="Add New Subject"
        subtitle="Create a subject record with a code, description, and activation state for curriculum use."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Subject Information</h2>
          <p className="mt-1 text-sm text-slate-500">Enter the subject name, code, description, and whether it is active.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Subject Name</label>
            <input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="field-input"
              placeholder="e.g., Mathematics"
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
              placeholder="e.g., MATH101"
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
              placeholder="Short subject description"
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
            <p className="mt-1 text-xs text-slate-500">
              Inactive subjects can be hidden from operational workflows later.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Save Subject
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
