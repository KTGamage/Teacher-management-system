import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';
import PasswordInput from '@/Components/PasswordInput';
import { UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Edit() {
  const { auth } = usePage().props as any;
  const user = auth.user;
  const teacher = user.teacher;
  const student = user.student;

  // Profile form (existing data)
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

  // Password form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Photo upload form
  const photoForm = useForm({
    photo: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.profile_photo_url || null);

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.patch('/profile', {
      onSuccess: () => toast.success('Profile updated.'),
      onError: () => toast.error('Could not update profile.'),
    });
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/password', {
      onSuccess: () => toast.success('Password updated.'),
      onError: () => toast.error('Check your current password.'),
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      photoForm.setData('photo', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    photoForm.post('/profile/photo', {
      onSuccess: () => {
        toast.success('Profile photo updated.');
        photoForm.reset('photo');
        // Update preview with new URL from server (handled by redirect? We'll just refresh user)
      },
      onError: () => toast.error('Could not upload photo.'),
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
        {/* Profile Photo */}
        <div className="panel space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Profile Photo</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a photo to personalise your account.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-darkred/20">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <UserIcon className="h-10 w-10" />
                </div>
              )}
            </div>

            <form onSubmit={uploadPhoto} className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mb-3 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-darkred file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-800"
              />
              {photoForm.errors.photo && <div className="field-error">{photoForm.errors.photo}</div>}
              <button type="submit" disabled={photoForm.processing || !photoForm.data.photo} className="secondary-button">
                Upload Photo
              </button>
            </form>
          </div>
        </div>

        {/* Profile Information */}
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

        {/* Change Password */}
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
