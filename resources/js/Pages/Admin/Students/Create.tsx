import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import { useState } from 'react';

interface Section {
  id: number;
  name: string;
  classes: { id: number; name: string }[];
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
    class_room_id: '',
  });

  const [availableClasses, setAvailableClasses] = useState<{ id: number; name: string }[]>([]);

  const handleSectionChange = (sectionId: string) => {
    setData('section_id', sectionId);
    setData('class_room_id', '');
    const section = sections.find(s => s.id.toString() === sectionId);
    setAvailableClasses(section ? section.classes : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/students', {
      onSuccess: () => toast.success('Student created!'),
      onError: () => toast.error('Check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Students', url: '/admin/students' }, { label: 'Add Student' }]}>
      <Head title="Add Student" />
      <PageHeader title="Add New Student" subtitle="Register a student account and connect guardian, contact, and section details." />
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><label className="field-label">Full Name</label><input value={data.full_name} onChange={e => setData('full_name', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Password</label><input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Reg. Number</label><input value={data.registration_number} onChange={e => setData('registration_number', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Contact Number</label><input value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Date of Birth</label><input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} className="field-input" /></div>
          <div className="md:col-span-2"><label className="field-label">Address</label><textarea value={data.address} onChange={e => setData('address', e.target.value)} className="field-input" rows={3} /></div>
          <div><label className="field-label">Guardian Name</label><input value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} className="field-input" required /></div>
          <div><label className="field-label">Guardian Contact</label><input value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className="field-input" required /></div>
          <div>
            <label className="field-label">Section</label>
            <select value={data.section_id} onChange={e => handleSectionChange(e.target.value)} className="field-input" required>
              <option value="">Select Section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Class</label>
            <select value={data.class_room_id} onChange={e => setData('class_room_id', e.target.value)} className="field-input" required disabled={!data.section_id}>
              <option value="">Select Class</option>
              {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">Save Student</button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}