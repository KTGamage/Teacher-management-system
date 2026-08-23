import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    leave_type: 'annual',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    post('/teacher/leaves', {
      onSuccess: () => toast.success('Leave request submitted.'),
      onError: () => toast.error('Please check the form.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Leave Requests', url: '/teacher/leaves' }, { label: 'New Request' }]}>
      <Head title="New Leave Request" />
      <PageHeader title="New Leave Request" subtitle="Provide the dates and reason for your leave application." />
      <form onSubmit={submit} className="panel mx-auto max-w-3xl space-y-6 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="leave_type" className="field-label">Leave Type</label>
            <select id="leave_type" value={data.leave_type} onChange={event => setData('leave_type', event.target.value)} className="field-input">
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="duty">Duty</option>
              <option value="other">Other</option>
            </select>
            {errors.leave_type && <div className="field-error">{errors.leave_type}</div>}
          </div>
          <div />
          <div>
            <label htmlFor="start_date" className="field-label">Start Date</label>
            <input id="start_date" type="date" value={data.start_date} onChange={event => setData('start_date', event.target.value)} className="field-input" required />
            {errors.start_date && <div className="field-error">{errors.start_date}</div>}
          </div>
          <div>
            <label htmlFor="end_date" className="field-label">End Date</label>
            <input id="end_date" type="date" value={data.end_date} onChange={event => setData('end_date', event.target.value)} className="field-input" required />
            {errors.end_date && <div className="field-error">{errors.end_date}</div>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="reason" className="field-label">Reason</label>
            <textarea id="reason" value={data.reason} onChange={event => setData('reason', event.target.value)} className="field-input" rows={5} required />
            {errors.reason && <div className="field-error">{errors.reason}</div>}
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">Submit Request</button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
