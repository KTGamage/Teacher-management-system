import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/Components/PageHeader';

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

interface Props {
  leaves: LeaveRequest[];
}

const formatDate = (date: string) => new Date(date).toLocaleDateString();
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

export default function Index({ leaves }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Leave Requests', url: '/teacher/leaves' }]}>
      <Head title="Leave Requests" />
      <PageHeader
        title="My Leave Requests"
        subtitle="Submit leave applications and follow their approval status."
        actions={(
          <Link href="/teacher/leaves/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> New Request
          </Link>
        )}
      />
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leaves.map(leave => (
                <tr key={leave.id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{label(leave.leave_type)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</td>
                  <td className="max-w-sm px-6 py-4 text-sm text-slate-500">{leave.reason}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{label(leave.status)}</span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">No leave requests yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
