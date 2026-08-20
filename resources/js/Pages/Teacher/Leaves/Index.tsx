import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  PlusIcon,
  ClipboardIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Leave {
  id: number;
  leave_type: string;
  start_date: string;
  start_time?: string | null;
  end_date: string;
  end_time?: string | null;
  reason: string;
  status: string;
}

interface Props {
  leaves: Leave[];
}

const formatDate = (date: string) => {
  if (!date) return '';
  return date.split('T')[0]; // extracts YYYY-MM-DD
};

const formatTime = (time: string | null | undefined) => {
  if (!time) return '';
  // If time includes a T (e.g., 2026-08-21T09:00:00), extract the time part
  if (time.includes('T')) {
    return time.split('T')[1]?.substring(0, 5) ?? '';
  }
  // Already in HH:mm format
  return time.substring(0, 5);
};

export default function TeacherLeaves({ leaves }: Props) {
  const { delete: destroy, processing } = useForm();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteRequest = (id: number) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    destroy(`/teacher/leaves/${deleteId}`, {
      onSuccess: () => {
        toast.success('Leave request deleted.');
        setDialogOpen(false);
        setDeleteId(null);
      },
      onError: () => {
        toast.error('Failed to delete.');
        setDialogOpen(false);
        setDeleteId(null);
      },
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'My Leaves' }]}>
      <Head title="My Leave Requests" />
      <PageHeader
        title="My Leave Requests"
        subtitle="Submit and track your leave requests."
        actions={(
          <Link href="/teacher/leaves/create" className="primary-button">
            <PlusIcon className="mr-2 h-5 w-5" /> New Request
          </Link>
        )}
      />

      <div className="panel overflow-hidden">
        {leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No leave requests yet</h3>
            <p className="mt-1 text-sm text-slate-500">You haven’t submitted any leave requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Start</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">End</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-slate-700">{leave.leave_type}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-slate-500">
                      {formatDate(leave.start_date)}
                      {formatTime(leave.start_time) && (
                        <span className="ml-1 text-xs text-slate-400">at {formatTime(leave.start_time)}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-slate-500">
                      {formatDate(leave.end_date)}
                      {formatTime(leave.end_time) && (
                        <span className="ml-1 text-xs text-slate-400">at {formatTime(leave.end_time)}</span>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-4 py-2 text-sm text-slate-500">{leave.reason}</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        leave.status === 'admin_approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'section_approved' ? 'bg-blue-100 text-blue-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{leave.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      {leave.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/teacher/leaves/${leave.id}/edit`}
                            className="text-slate-500 transition hover:text-darkred"
                            title="Edit request"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteRequest(leave.id)}
                            className="text-slate-500 transition hover:text-red-600"
                            title="Delete request"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title="Delete Leave Request"
        message="Are you sure you want to delete this leave request? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
        loading={processing}
      />
    </AuthenticatedLayout>
  );
}