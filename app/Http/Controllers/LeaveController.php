<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\LeaveApprovalRequest;
use App\Models\LeaveRequest;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Admin: list all leave requests.
     */
    public function adminIndex(Request $request)
    {
        $leaves = LeaveRequest::with('teacher:id,full_name,teacher_registration_number')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Leaves/Index', [
            'leaves' => $leaves,
        ]);
    }

    /**
     * Teacher: list own leave requests.
     */
    public function teacherIndex(Request $request)
    {
        $teacher = $request->user()->teacher;
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
        $teacher = $request->user()->teacher;

        $leave = LeaveRequest::create([
            'teacher_id' => $teacher->id,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('teacher.leaves.index')->with('success', 'Leave request submitted.');
    }

    /**
     * Section Head: approve leave request (first level).
     */
    public function sectionApprove(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $sectionHead = $request->user()->teacher;
        if (!$sectionHead || !$sectionHead->is_section_head) abort(403);

        $leave->update([
            'section_head_approval' => true,
            'section_head_approval_date' => now(),
            'section_head_remarks' => $request->remarks,
            'status' => 'section_approved',
        ]);

        return back()->with('success', 'Leave approved by section head.');
    }

    /**
     * Admin: final approve leave request.
     */
    public function adminApprove(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $leave->update([
            'admin_approval' => true,
            'admin_approval_date' => now(),
            'admin_remarks' => $request->remarks,
            'status' => 'admin_approved',
        ]);

        return back()->with('success', 'Leave approved by admin.');
    }

    /**
     * Reject leave request (either section head or admin).
     */
    public function reject(LeaveApprovalRequest $request, LeaveRequest $leave)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $leave->update([
                'admin_approval' => false,
                'admin_remarks' => $request->remarks,
                'status' => 'rejected',
            ]);
        } elseif ($user->role === 'teacher' && $user->teacher?->is_section_head) {
            $leave->update([
                'section_head_approval' => false,
                'section_head_remarks' => $request->remarks,
                'status' => 'rejected',
            ]);
        } else {
            abort(403);
        }

        return back()->with('success', 'Leave rejected.');
    }
}
