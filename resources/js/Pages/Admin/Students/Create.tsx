import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import PasswordInput from '@/Components/PasswordInput';

interface Section {
  id: number;
  name: string;
}

interface Props {
  sections: Section[];
}

export default function Create({ sections }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    registration_number: '',
    full_name: '',
    contact_number: '',
    date_of_birth: '',
    address: '',
    guardian_name: '',
    guardian_contact: '',
    section_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/students', {
      onSuccess: () => toast.success('Student created!'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Students', url: '/admin/students' },
      { label: 'Add Student' }
    ]}>
      <Head title="Add Student" />
      <PageHeader
        title="Add New Student"
        subtitle="Register a student account and connect guardian, contact, and section details in one form."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Student Information</h2>
          <p className="mt-1 text-sm text-slate-500">Enter the student profile, login credentials, and guardian information.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Full Name</label>
            <input value={data.full_name} onChange={e => setData('full_name', e.target.value)} className="field-input" required />
            {errors.full_name && <div className="field-error">{errors.full_name}</div>}
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="field-input" required />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <PasswordInput
            id="student-password"
            label="Password"
            value={data.password}
            onChange={(value) => setData('password', value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          <div>
            <label className="field-label">Reg. Number</label>
            <input value={data.registration_number} onChange={e => setData('registration_number', e.target.value)} className="field-input" required />
            {errors.registration_number && <div className="field-error">{errors.registration_number}</div>}
          </div>
          <div>
            <label className="field-label">Contact Number</label>
            <input value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className="field-input" required />
            {errors.contact_number && <div className="field-error">{errors.contact_number}</div>}
          </div>
          <div>
            <label className="field-label">Date of Birth</label>
            <input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} className="field-input" />
            {errors.date_of_birth && <div className="field-error">{errors.date_of_birth}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Address</label>
            <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="field-input" rows={3} />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>
          <div>
            <label className="field-label">Guardian Name</label>
            <input value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} className="field-input" required />
            {errors.guardian_name && <div className="field-error">{errors.guardian_name}</div>}
          </div>
          <div>
            <label className="field-label">Guardian Contact</label>
            <input value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className="field-input" required />
            {errors.guardian_contact && <div className="field-error">{errors.guardian_contact}</div>}
          </div>
          <div>
            <label className="field-label">Section</label>
            <select value={data.section_id} onChange={e => setData('section_id', e.target.value)} className="field-input" required>
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.section_id && <div className="field-error">{errors.section_id}</div>}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Save Student
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
