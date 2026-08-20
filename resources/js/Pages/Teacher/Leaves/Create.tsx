import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

interface Leave {
  id?: number;
  leave_type: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  reason: string;
}

interface Props {
  leave?: Leave;
}

export default function Create({ leave }: Props) {
  const isEditing = Boolean(leave);

  const { data, setData, post, put, processing, errors } = useForm({
    leave_type: leave?.leave_type || 'annual',
    start_date: leave?.start_date || '',
    start_time: leave?.start_time || '',
    end_date: leave?.end_date || '',
    end_time: leave?.end_time || '',
    reason: leave?.reason || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && leave?.id) {
      put(`/teacher/leaves/${leave.id}`, {
        onSuccess: () => toast.success('Leave request updated.'),
        onError: () => toast.error('Error updating.'),
      });
    } else {
      post('/teacher/leaves', {
        onSuccess: () => toast.success('Leave request submitted.'),
        onError: () => toast.error('Error submitting.'),
      });
    }
  };

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: 'My Leaves', url: '/teacher/leaves' },
        { label: isEditing ? 'Edit Request' : 'New Request' },
      ]}
    >
      <Head title={isEditing ? 'Edit Leave Request' : 'New Leave Request'} />
      <PageHeader
        title={isEditing ? 'Edit Leave Request' : 'New Leave Request'}
        subtitle={
          isEditing
            ? 'Update your leave request details.'
            : 'Submit a leave request for approval.'
        }
      />

      <form onSubmit={handleSubmit} className="panel mx-auto max-w-xl space-y-6 p-6">
        <div>
          <label className="field-label">Leave Type</label>
          <select
            value={data.leave_type}
            onChange={(e) => setData('leave_type', e.target.value)}
            className="field-input"
          >
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="casual">Casual</option>
            <option value="duty">Duty</option>
            <option value="other">Other</option>
          </select>
          {errors.leave_type && <div className="field-error">{errors.leave_type}</div>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">Start Date</label>
            <input
              type="date"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
              className="field-input"
              required
            />
            {errors.start_date && <div className="field-error">{errors.start_date}</div>}
          </div>
          <div>
            <label className="field-label">Start Time (optional)</label>
            <input
              type="time"
              value={data.start_time}
              onChange={(e) => setData('start_time', e.target.value)}
              className="field-input"
            />
            {errors.start_time && <div className="field-error">{errors.start_time}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">End Date</label>
            <input
              type="date"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
              className="field-input"
              required
            />
            {errors.end_date && <div className="field-error">{errors.end_date}</div>}
          </div>
          <div>
            <label className="field-label">End Time (optional)</label>
            <input
              type="time"
              value={data.end_time}
              onChange={(e) => setData('end_time', e.target.value)}
              className="field-input"
            />
            {errors.end_time && <div className="field-error">{errors.end_time}</div>}
          </div>
        </div>

        <div>
          <label className="field-label">Reason</label>
          <textarea
            value={data.reason}
            onChange={(e) => setData('reason', e.target.value)}
            className="field-input"
            rows={4}
            required
          />
          {errors.reason && <div className="field-error">{errors.reason}</div>}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={processing} className="primary-button">
            {isEditing ? 'Update Request' : 'Submit Request'}
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}