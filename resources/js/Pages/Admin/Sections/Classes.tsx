import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ClassRoom {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  code: string;
}

interface Props {
  section: Section;
  classes: ClassRoom[];
}

export default function Classes({ section, classes }: Props) {
  const { data, setData, post, processing, errors } = useForm({ name: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/sections/${section.id}/classes`, {
      onSuccess: () => {
        toast.success('Class added.');
        setData('name', '');
      },
      onError: () => toast.error('Error adding class.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Sections', url: '/admin/sections' }, { label: section.name }]}>
      <Head title={`Classes for ${section.name}`} />
      <PageHeader title={`Manage Classes for ${section.name}`} subtitle={`Section Code: ${section.code}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Current Classes</h2>
          {classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
              <p>No classes added.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {classes.map(cls => (
                <li key={cls.id} className="flex justify-between items-center py-2">
                  <span className="font-semibold">Class {cls.name}</span>
                  <Link
                    method="delete"
                    as="button"
                    href={`/admin/classes/${cls.id}`}
                    className="text-red-600 hover:text-red-800"
                    title="Delete class"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Add New Class</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="class-name" className="field-label">Class Name (e.g., A, B)</label>
              <input id="class-name" value={data.name} onChange={e => setData('name', e.target.value)} className="field-input" placeholder="A" required />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={processing} className="primary-button">
                <PlusIcon className="mr-2 h-5 w-5" /> Add Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}