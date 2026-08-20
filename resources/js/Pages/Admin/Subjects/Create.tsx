import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/subjects', {
      onSuccess: () => toast.success('Subject created.'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Subjects', url: '/admin/subjects' },
      { label: 'Add Subject' }
    ]}>
      <Head title="Add Subject" />
      <PageHeader title="Add New Subject" subtitle="Create a new subject with a unique code." />
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
          <button type="submit" disabled={processing} className="primary-button">Save Subject</button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}