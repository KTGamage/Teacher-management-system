import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import PasswordInput from '@/Components/PasswordInput';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    teacher_registration_number: '',
    full_name: '',
    contact_number: '',
    address: '',
    qualifications: '',
    specialization: '',
    joining_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/teachers', {
      onSuccess: () => toast.success('Teacher created!'),
      onError: () => toast.error('Check the form for errors.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Teachers', url: '/admin/teachers' },
      { label: 'Add Teacher' }
    ]}>
      <Head title="Add Teacher" />
      <PageHeader
        title="Add New Teacher"
        subtitle="Create a staff login and capture the teacher profile details used across timetable and section workflows."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Teacher Information</h2>
          <p className="mt-1 text-sm text-slate-500">Enter account details, contact information, and academic profile data.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="field-label">Full Name</label>
            <input
              value={data.full_name}
              onChange={e => setData('full_name', e.target.value)}
              className="field-input"
              required
            />
            {errors.full_name && <div className="field-error">{errors.full_name}</div>}
          </div>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              className="field-input"
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <PasswordInput
            id="teacher-password"
            label="Password"
            value={data.password}
            onChange={(value) => setData('password', value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          <div>
            <label className="field-label">Reg. Number</label>
            <input
              value={data.teacher_registration_number}
              onChange={e => setData('teacher_registration_number', e.target.value)}
              className="field-input"
              required
            />
            {errors.teacher_registration_number && <div className="field-error">{errors.teacher_registration_number}</div>}
          </div>
          <div>
            <label className="field-label">Contact Number</label>
            <input
              value={data.contact_number}
              onChange={e => setData('contact_number', e.target.value)}
              className="field-input"
              required
            />
            {errors.contact_number && <div className="field-error">{errors.contact_number}</div>}
          </div>
          <div>
            <label className="field-label">Joining Date</label>
            <input
              type="date"
              value={data.joining_date}
              onChange={e => setData('joining_date', e.target.value)}
              className="field-input"
            />
            {errors.joining_date && <div className="field-error">{errors.joining_date}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Address</label>
            <textarea
              value={data.address}
              onChange={e => setData('address', e.target.value)}
              className="field-input"
              rows={3}
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>
          <div>
            <label className="field-label">Specialization</label>
            <input
              value={data.specialization}
              onChange={e => setData('specialization', e.target.value)}
              className="field-input"
            />
            {errors.specialization && <div className="field-error">{errors.specialization}</div>}
          </div>
          <div>
            <label className="field-label">Qualifications (comma separated)</label>
            <input
              value={data.qualifications}
              onChange={e => setData('qualifications', e.target.value)}
              placeholder="BSc, MEd, PGDE"
              className="field-input"
            />
            <p className="mt-1 text-xs text-slate-500">
              Separate multiple qualifications with a comma.
            </p>
            {errors.qualifications && <div className="field-error">{errors.qualifications}</div>}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Save Teacher
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}