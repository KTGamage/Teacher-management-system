<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveApprovalRequest;
use App\Http\Requests\StoreLeaveRequest;
use App\Mail\LeaveRequestStatusChanged;
use App\Models\Activity;
use App\Models\LeaveRequest;
use App\Models\Section;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Admin: list all leave requests (pending section head + non-pending others).
     */
    public function adminIndex(Request $request)
    {
        $leaves = LeaveRequest::with('teacher.user')
            ->where(function ($query) {
                $query->where('status', 'section_approved')
                    ->orWhereNotNull('admin_approval_date')
                    ->orWhere(function ($q) {
                        $q->where('status', 'rejected')
                            ->where('section_head_approval', true);
                    })
                    ->orWhereHas('teacher', function ($q) {
                        $q->where('is_section_head', true);
                    });
            })
            ->where(function ($query) {
                $query->whereNull('admin_remarks')
                    ->orWhere('admin_remarks', '!=', 'Approved directly by section head');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Leaves/Index', [
            'leaves' => $leaves,
        ]);
    }

    /**
     * Section head: list pending leave requests from teachers in their sections.
     */
    public function sectionHeadIndex(Request $request)
    {
        $sectionHead = Auth::user()->teacher;

        if (! $sectionHead || ! $sectionHead->is_section_head) {
            abort(403);
        }

        $sectionIds = Section::where('section_head_id', $sectionHead->id)
            ->where('is_active', true)
            ->pluck('id');

        $teacherIds = Teacher::whereHas('sections', function ($query) use ($sectionIds) {
            $query->whereIn('sections.id', $sectionIds);
        })
            ->where('id', '!=', $sectionHead->id)
            ->pluck('id');

        $leaves = LeaveRequest::with('teacher.user')
            ->whereIn('teacher_id', $teacherIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/SectionLeaves/Index', [
            'leaves' => $leaves,
        ]);
    }

    /**
     * Teacher: list own leave requests.
     */
    public function teacherIndex(Request $request)
    {
        $teacher = Auth::user()->teacher;
        $leaves = LeaveRequest::where('teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/Leaves/Index', [
            'leaves' => $leaves,
        ]);
    }

    /**
     * Teacher: show create form.
     */
    public function create()
    {
        return Inertia::render('Teacher/Leaves/Create');
    }

    /**
     * Teacher: store leave request.
     */
    public function store(StoreLeaveRequest $request)
    {
        $teacher = Auth::user()->teacher;

        $leave = LeaveRequest::create([
            'teacher_id' => $teacher->id,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'start_time' => $request->start_time,
            'end_date' => $request->end_date,
            'end_time' => $request->end_time,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        Activity::create([
            'actor_name' => $teacher->full_name,
            'type' => 'Leave Requested',
            'status' => 'info',
            'description' => "Leave request from {$teacher->full_name}.",
        ]);

        return redirect()->route('teacher.leaves.index')->with('success', 'Leave request submitted.');
    }

    /**
     * Section Head: forward leave request to admin (no final decision).
     */
    public function sectionForward(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $sectionHead = Auth::user()->teacher;
        $this->authorizeSectionHeadAction($sectionHead, $leave);

        $leave->update([
            'section_head_approval' => true,
            'section_head_approval_date' => now(),
            'section_head_remarks' => $request->remarks,
            'status' => 'section_approved',
        ]);

        Activity::create([
            'actor_name' => $sectionHead->full_name,
            'type' => 'Leave Forwarded to Admin',
            'status' => 'info',
            'description' => "Leave {$leave->id} forwarded to admin.",
        ]);

        return back()->with('success', 'Leave forwarded to admin.');
    }

    /**
     * Section Head: final approve (no admin needed).
     */
    public function sectionFinalApprove(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $sectionHead = Auth::user()->teacher;
        $this->authorizeSectionHeadAction($sectionHead, $leave);

        DB::transaction(function () use ($request, $leave, $sectionHead): void {
            $leave->update([
                'section_head_approval' => true,
                'section_head_approval_date' => now(),
                'section_head_remarks' => $request->remarks,
                'status' => 'admin_approved',
                'admin_approval' => false,
                'admin_approval_date' => null,
                'admin_remarks' => null,
            ]);

            Activity::create([
                'actor_name' => $sectionHead->full_name,
                'type' => 'Leave Approved by Section Head',
                'status' => 'success',
                'description' => "Leave {$leave->id} approved directly by section head.",
            ]);

            Mail::to($leave->teacher->user->email)->send(new LeaveRequestStatusChanged($leave, 'approved', $request->remarks));
        });

        return back()->with('success', 'Leave approved.');
    }

    /**
     * Section Head: reject leave request.
     */
    public function sectionReject(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $sectionHead = Auth::user()->teacher;
        $this->authorizeSectionHeadAction($sectionHead, $leave);

        DB::transaction(function () use ($request, $leave, $sectionHead): void {
            $leave->update([
                'section_head_approval' => false,
                'section_head_approval_date' => now(),
                'section_head_remarks' => $request->remarks,
                'status' => 'rejected',
            ]);

            Activity::create([
                'actor_name' => $sectionHead->full_name,
                'type' => 'Leave Rejected by Section Head',
                'status' => 'warning',
                'description' => "Leave {$leave->id} rejected by section head.",
            ]);

            Mail::to($leave->teacher->user->email)->send(new LeaveRequestStatusChanged($leave, 'rejected', $request->remarks));
        });

        return back()->with('success', 'Leave rejected.');
    }

    /**
     * Admin: final approve leave request.
     */
    public function adminApprove(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $this->authorizeAdminAction($leave);

        DB::transaction(function () use ($request, $leave): void {
            $leave->update([
                'admin_approval' => true,
                'admin_approval_date' => now(),
                'admin_remarks' => $request->remarks,
                'status' => 'admin_approved',
            ]);

            Activity::create([
                'actor_name' => Auth::user()->name ?? 'Admin',
                'type' => 'Leave Approved by Admin',
                'status' => 'success',
                'description' => "Leave {$leave->id} approved by admin.",
            ]);

            Mail::to($leave->teacher->user->email)->send(new LeaveRequestStatusChanged($leave, 'approved', $request->remarks));
        });

        return back()->with('success', 'Leave approved.');
    }

    /**
     * Admin: reject leave request.
     */
    public function adminReject(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $this->authorizeAdminAction($leave);

        DB::transaction(function () use ($request, $leave): void {
            $leave->update([
                'admin_approval' => false,
                'admin_approval_date' => now(),
                'admin_remarks' => $request->remarks,
                'status' => 'rejected',
            ]);

            Activity::create([
                'actor_name' => Auth::user()->name ?? 'Admin',
                'type' => 'Leave Rejected by Admin',
                'status' => 'warning',
                'description' => "Leave {$leave->id} rejected by admin.",
            ]);

            Mail::to($leave->teacher->user->email)->send(new LeaveRequestStatusChanged($leave, 'rejected', $request->remarks));
        });

        return back()->with('success', 'Leave rejected.');
    }

    /**
     * Admin: delete a leave request.
     */
    public function adminDestroy(LeaveRequest $leave): RedirectResponse
    {
        $leave->delete();

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'Admin',
            'type' => 'Leave Deleted by Admin',
            'status' => 'warning',
            'description' => "Leave {$leave->id} deleted by admin.",
        ]);

        return back()->with('success', 'Leave request deleted.');
    }

    /**
     * Section Head: delete a leave request.
     */
    public function sectionDestroy(LeaveRequest $leave): RedirectResponse
    {
        $sectionHead = Auth::user()->teacher;
        $this->authorizeSectionHeadAction($sectionHead, $leave);

        $leave->delete();

        Activity::create([
            'actor_name' => $sectionHead->full_name,
            'type' => 'Leave Deleted by Section Head',
            'status' => 'warning',
            'description' => "Leave {$leave->id} deleted by section head.",
        ]);

        return back()->with('success', 'Leave request deleted.');
    }

    /**
     * Teacher: edit own pending leave request.
     */
    public function edit(LeaveRequest $leave)
    {
        $teacher = Auth::user()->teacher;
        if ($leave->teacher_id !== $teacher->id || $leave->status !== 'pending') {
            abort(403);
        }

        return Inertia::render('Teacher/Leaves/Create', [
            'leave' => $leave,
        ]);
    }

    /**
     * Teacher: update own pending leave request.
     */
    public function update(StoreLeaveRequest $request, LeaveRequest $leave)
    {
        $teacher = Auth::user()->teacher;
        if ($leave->teacher_id !== $teacher->id || $leave->status !== 'pending') {
            abort(403);
        }

        $leave->update([
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'start_time' => $request->start_time,
            'end_date' => $request->end_date,
            'end_time' => $request->end_time,
            'reason' => $request->reason,
        ]);

        return redirect()->route('teacher.leaves.index')->with('success', 'Leave request updated.');
    }

    /**
     * Teacher: delete own pending leave request.
     */
    public function destroy(LeaveRequest $leave)
    {
        $teacher = Auth::user()->teacher;
        if ($leave->teacher_id !== $teacher->id || $leave->status !== 'pending') {
            abort(403);
        }

        $leave->delete();

        return back()->with('success', 'Leave request deleted.');
    }

    private function authorizeSectionHeadAction(?Teacher $sectionHead, LeaveRequest $leave): void
    {
        if (! $sectionHead || ! $sectionHead->is_section_head || $leave->teacher_id === $sectionHead->id) {
            abort(403);
        }

        $teacherBelongsToHeadedSection = Section::query()
            ->where('section_head_id', $sectionHead->id)
            ->where('is_active', true)
            ->whereHas('teachers', function ($query) use ($leave) {
                $query->where('teachers.id', $leave->teacher_id);
            })
            ->exists();

        abort_unless($teacherBelongsToHeadedSection, 403);
        abort_unless(
            $leave->status === 'pending',
            409,
            'Only pending leave requests can be reviewed by a section head.'
        );
    }

    private function authorizeAdminAction(LeaveRequest $leave): void
    {
        $leave->loadMissing('teacher');

        $isForwardedTeacherRequest = $leave->status === 'section_approved';
        $isPendingSectionHeadRequest = $leave->status === 'pending'
            && $leave->teacher->is_section_head;

        abort_unless(
            $isForwardedTeacherRequest || $isPendingSectionHeadRequest,
            409,
            'This leave request is not awaiting an admin decision.'
        );
    }
}
