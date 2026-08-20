import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Leave {
  id: number;
  teacher: { full_name: string; teacher_registration_number: string };
  leave_type: string;
  start_date: string;
  start_time?: string | null;
  end_date: string;
  end_time?: string | null;
  reason: string;
  status: string;
  created_at: string;
}

interface Props {
  leaves: Leave[];
}

const formatDate = (date: string) => {
  if (!date) return '';
  return date.split('T')[0];
};

const formatTime = (time: string | null | undefined) => {
  if (!time) return '';
  if (time.includes('T')) {
    return time.split('T')[1]?.substring(0, 5) ?? '';
  }
  return time.substring(0, 5);
};

// Status label & color mapping
const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  section_approved: { label: 'Forwarded to Admin', className: 'bg-blue-100 text-blue-800' },
  admin_approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
};

export default function SectionLeaves({ leaves }: Props) {
  const { put, delete: destroy, processing } = useForm();

  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'forward' | 'reject' | 'delete';
    leaveId: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = (id: number) => {
    setConfirmAction({ type: 'approve', leaveId: id });
    setDialogOpen(true);
  };

  const handleForward = (id: number) => {
    setConfirmAction({ type: 'forward', leaveId: id });
    setDialogOpen(true);
  };

  const handleReject = (id: number) => {
    setConfirmAction({ type: 'reject', leaveId: id });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({ type: 'delete', leaveId: id });
    setDialogOpen(true);
  };

  const confirmActionHandler = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'delete') {
      destroy(`/teacher/section-leaves/${confirmAction.leaveId}`, {
        onSuccess: () => {
          toast.success('Leave request deleted.');
          setDialogOpen(false);
          setConfirmAction(null);
        },
        onError: () => {
          toast.error('Delete failed.');
          setDialogOpen(false);
          setConfirmAction(null);
        },
      });
      return;
    }

    const base = `/teacher/section-leaves/${confirmAction.leaveId}`;
    const url =
      confirmAction.type === 'approve'
        ? `${base}/approve`
        : confirmAction.type === 'forward'
        ? `${base}/forward`
        : `${base}/reject`;

    put(url, {
      onSuccess: () => {
        toast.success(
          confirmAction.type === 'approve'
            ? 'Leave approved.'
            : confirmAction.type === 'forward'
            ? 'Leave forwarded to admin.'
            : 'Leave rejected.'
        );
        setDialogOpen(false);
        setConfirmAction(null);
      },
      onError: () => {
        toast.error('Action failed.');
        setDialogOpen(false);
        setConfirmAction(null);
      },
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Leave Approvals' }]}>
      <Head title="Leave Approvals" />
      <PageHeader
        title="Leave Approvals"
        subtitle="Review and manage leave requests from teachers in your section."
      />

      <div className="panel overflow-hidden">
        {leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No requests</h3>
            <p className="mt-1 text-sm text-slate-500">No leave requests found for your section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Start</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">End</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaves.map((leave) => {
                  const meta = statusMeta[leave.status] || { label: leave.status, className: 'bg-slate-100 text-slate-700' };
                  return (
                    <tr key={leave.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-slate-900">
                        {leave.teacher.full_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-slate-500">
                        {leave.leave_type}
                      </td>
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
                      <td className="max-w-xs truncate px-4 py-2 text-sm text-slate-500">
                        {leave.reason}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${meta.className}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          {leave.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="text-green-600 hover:text-green-800 transition"
                                title="Approve directly"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleForward(leave.id)}
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Forward to admin"
                              >
                                <ArrowRightCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="text-red-600 hover:text-red-800 transition"
                                title="Reject"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(leave.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Delete request"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Leave'
            : confirmAction?.type === 'forward'
            ? 'Forward to Admin'
            : confirmAction?.type === 'reject'
            ? 'Reject Leave'
            : 'Delete Leave Request'
        }
        message={
          confirmAction?.type === 'approve'
            ? 'Approve this leave request directly?'
            : confirmAction?.type === 'forward'
            ? 'Forward this leave request to admin for final decision?'
            : confirmAction?.type === 'reject'
            ? 'Reject this leave request?'
            : 'This will permanently delete the leave request. Continue?'
        }
        confirmLabel={
          confirmAction?.type === 'approve'
            ? 'Approve'
            : confirmAction?.type === 'forward'
            ? 'Forward'
            : confirmAction?.type === 'reject'
            ? 'Reject'
            : 'Delete'
        }
        onConfirm={confirmActionHandler}
        onCancel={() => setDialogOpen(false)}
        loading={processing}
      />
    </AuthenticatedLayout>
  );
}