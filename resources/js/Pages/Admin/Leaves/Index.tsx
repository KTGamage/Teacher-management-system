import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Teacher {
  full_name: string;
  teacher_registration_number: string;
}

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  teacher: Teacher;
}

interface Props {
  leaves: LeaveRequest[];
}

const formatDate = (date: string) => new Date(date).toLocaleDateString();
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

function LeaveAction({ leave, action }: { leave: LeaveRequest; action: 'approve' | 'reject' }) {
  const { put, processing } = useForm({ remarks: '' });

  return (
    <form onSubmit={event => {
      event.preventDefault();
      put(`/admin/leaves/${leave.id}/${action}`);
    }} className="flex items-center gap-2">
      <button type="submit" disabled={processing} className={action === 'approve' ? 'primary-button' : 'secondary-button'}>
        {action === 'approve' ? 'Approve' : 'Reject'}
      </button>
    </form>
  );
}

export default function Index({ leaves }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Leave Requests', url: '/admin/leaves' }]}>
      <Head title="Leave Requests" />
      <PageHeader title="Leave Requests" subtitle="Review teacher leave applications and record final approval decisions." />
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leaves.map(leave => (
                <tr key={leave.id} className="align-top transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    {leave.teacher?.full_name}<span className="mt-1 block text-xs font-normal text-slate-500">{leave.teacher?.teacher_registration_number}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{label(leave.leave_type)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</td>
                  <td className="max-w-xs px-6 py-4 text-sm text-slate-500">{leave.reason}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">{label(leave.status)}</td>
                  <td className="px-6 py-4">
                    {leave.status === 'pending' || leave.status === 'section_approved' ? (
                      <div className="flex gap-2"><LeaveAction leave={leave} action="approve" /><LeaveAction leave={leave} action="reject" /></div>
                    ) : <span className="text-sm text-slate-400">Completed</span>}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">No leave requests to review.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
