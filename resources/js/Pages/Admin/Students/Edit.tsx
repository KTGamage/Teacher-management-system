import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import PasswordInput from '@/Components/PasswordInput';
import { useState } from 'react';

interface Section {
  id: number;
  name: string;
  classes: { id: number; name: string }[];
}

interface Student {
  id: number;
  full_name: string;
  registration_number: string;
  contact_number: string;
  date_of_birth: string | null;
  address: string | null;
  guardian_name: string;
  guardian_contact: string;
  section_id: number | null;
  class_room_id: number | null;
  user: { email: string };
}

interface Props {
  student: Student;
  sections: Section[];
}

export default function Edit({ student, sections }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    full_name: student.full_name || '',
    email: student.user?.email || '',
    password: '', // optional new password
    registration_number: student.registration_number || '',
    contact_number: student.contact_number || '',
    date_of_birth: student.date_of_birth || '',
    address: student.address || '',
    guardian_name: student.guardian_name || '',
    guardian_contact: student.guardian_contact || '',
    section_id: student.section_id?.toString() || '',
    class_room_id: student.class_room_id?.toString() || '',
  });

  const [availableClasses, setAvailableClasses] = useState<{ id: number; name: string }[]>(() => {
    const section = sections.find(s => s.id === student.section_id);
    return section ? section.classes : [];
  });

  const handleSectionChange = (sectionId: string) => {
    setData('section_id', sectionId);
    setData('class_room_id', '');
    const section = sections.find(s => s.id.toString() === sectionId);
    setAvailableClasses(section ? section.classes : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/students/${student.id}`, {
      onSuccess: () => toast.success('Student updated.'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: 'Students', url: '/admin/students' },
        { label: `Edit ${student.full_name}` },
      ]}
    >
      <Head title={`Edit ${student.full_name}`} />
      <PageHeader
        title={`Edit Student: ${student.full_name}`}
        subtitle="Update student details, guardian information, and section assignment."
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
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

          <div className="md:col-span-2">
            <PasswordInput
              id="student-password"
              label="New Password (leave blank to keep current)"
              value={data.password}
              onChange={(value) => setData('password', value)}
              error={errors.password}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-slate-500">
              Only enter a new password if you want to reset the student's login credentials.
            </p>
          </div>

          <div>
            <label className="field-label">Reg. Number</label>
            <input
              value={data.registration_number}
              onChange={e => setData('registration_number', e.target.value)}
              className="field-input"
              required
            />
            {errors.registration_number && <div className="field-error">{errors.registration_number}</div>}
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
            <label className="field-label">Date of Birth</label>
            <input
              type="date"
              value={data.date_of_birth}
              onChange={e => setData('date_of_birth', e.target.value)}
              className="field-input"
            />
            {errors.date_of_birth && <div className="field-error">{errors.date_of_birth}</div>}
          </div>

          <div>
            <label className="field-label">Guardian Name</label>
            <input
              value={data.guardian_name}
              onChange={e => setData('guardian_name', e.target.value)}
              className="field-input"
              required
            />
            {errors.guardian_name && <div className="field-error">{errors.guardian_name}</div>}
          </div>

          <div>
            <label className="field-label">Guardian Contact</label>
            <input
              value={data.guardian_contact}
              onChange={e => setData('guardian_contact', e.target.value)}
              className="field-input"
              required
            />
            {errors.guardian_contact && <div className="field-error">{errors.guardian_contact}</div>}
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
            <label className="field-label">Section</label>
            <select
              value={data.section_id}
              onChange={e => handleSectionChange(e.target.value)}
              className="field-input"
              required
            >
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.section_id && <div className="field-error">{errors.section_id}</div>}
          </div>

          <div>
            <label className="field-label">Class</label>
            <select
              value={data.class_room_id}
              onChange={e => setData('class_room_id', e.target.value)}
              className="field-input"
              required
              disabled={!data.section_id}
            >
              <option value="">Select Class</option>
              {availableClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.class_room_id && <div className="field-error">{errors.class_room_id}</div>}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Update Student
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}