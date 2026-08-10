import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import PasswordInput from '@/Components/PasswordInput';

export default function Edit() {
  const { auth } = usePage().props as any;
  const user = auth.user;
  const teacher = user.teacher;
  const student = user.student;

  const profileForm = useForm({
    name: user.name,
    email: user.email,
    ...(user.role === 'teacher' ? {
      full_name: teacher?.full_name || '',
      contact_number: teacher?.contact_number || '',
      address: teacher?.address || '',
      qualifications: teacher?.qualifications ? JSON.stringify(teacher.qualifications) : '',
      specialization: teacher?.specialization || '',
    } : {}),
    ...(user.role === 'student' ? {
      full_name: student?.full_name || '',
      contact_number: student?.contact_number || '',
      address: student?.address || '',
      guardian_name: student?.guardian_name || '',
      guardian_contact: student?.guardian_contact || '',
    } : {}),
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.patch('/profile', {
      onSuccess: () => toast.success('Profile updated.'),
    });
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/password', {
      onSuccess: () => toast.success('Password updated.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Profile' }]}>
      <Head title="Profile" />
      <PageHeader
        title="Profile Settings"
        subtitle="Keep your personal information current and update your account password when needed."
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <form onSubmit={updateProfile} className="panel space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Profile Information</h2>
            <p className="mt-1 text-sm text-slate-500">Update your account details and role-specific profile information.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input
                value={profileForm.data.name}
                onChange={e => profileForm.setData('name', e.target.value)}
                className="field-input"
                required
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                value={profileForm.data.email}
                onChange={e => profileForm.setData('email', e.target.value)}
                className="field-input"
                required
              />
            </div>

            {user.role === 'teacher' && (
              <>
                <div>
                  <label className="field-label">Full Name (Teacher)</label>
                  <input
                    value={profileForm.data.full_name}
                    onChange={e => profileForm.setData('full_name', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Contact Number</label>
                  <input
                    value={profileForm.data.contact_number}
                    onChange={e => profileForm.setData('contact_number', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label">Address</label>
                  <textarea
                    value={profileForm.data.address}
                    onChange={e => profileForm.setData('address', e.target.value)}
                    className="field-input"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="field-label">Specialization</label>
                  <input
                    value={profileForm.data.specialization}
                    onChange={e => profileForm.setData('specialization', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Qualifications (JSON)</label>
                  <input
                    value={profileForm.data.qualifications}
                    onChange={e => profileForm.setData('qualifications', e.target.value)}
                    className="field-input"
                  />
                </div>
              </>
            )}

            {user.role === 'student' && (
              <>
                <div>
                  <label className="field-label">Full Name (Student)</label>
                  <input
                    value={profileForm.data.full_name}
                    onChange={e => profileForm.setData('full_name', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Contact Number</label>
                  <input
                    value={profileForm.data.contact_number}
                    onChange={e => profileForm.setData('contact_number', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label">Address</label>
                  <textarea
                    value={profileForm.data.address}
                    onChange={e => profileForm.setData('address', e.target.value)}
                    className="field-input"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="field-label">Guardian Name</label>
                  <input
                    value={profileForm.data.guardian_name}
                    onChange={e => profileForm.setData('guardian_name', e.target.value)}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Guardian Contact</label>
                  <input
                    value={profileForm.data.guardian_contact}
                    onChange={e => profileForm.setData('guardian_contact', e.target.value)}
                    className="field-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={profileForm.processing}
              className="primary-button"
            >
              Save Profile
            </button>
          </div>
        </form>

        <form onSubmit={updatePassword} className="panel space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Change Password</h2>
            <p className="mt-1 text-sm text-slate-500">Use a strong password to keep your account secure.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <PasswordInput
              id="current-password"
              label="Current Password"
              value={passwordForm.data.current_password}
              onChange={(value) => passwordForm.setData('current_password', value)}
              required
              autoComplete="current-password"
            />
            <PasswordInput
              id="new-password"
              label="New Password"
              value={passwordForm.data.password}
              onChange={(value) => passwordForm.setData('password', value)}
              required
              autoComplete="new-password"
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm New Password"
              value={passwordForm.data.password_confirmation}
              onChange={(value) => passwordForm.setData('password_confirmation', value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={passwordForm.processing}
              className="primary-button"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
