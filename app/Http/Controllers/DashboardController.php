<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Section;
use App\Models\Subject;
use App\Models\SectionSubject;
use App\Models\TimetableSlot;
use App\Models\LeaveRequest;
use App\Models\Activity;
use App\Models\Mark;
use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function admin()
    {
        $stats = [
            'teachers' => Teacher::count(),
            'students' => Student::count(),
            'sections' => Section::count(),
            'subjects' => Subject::count(),
            'leaves' => LeaveRequest::count(),
        ];

        // Recent activities (latest 5)
        $recentActivity = Activity::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'teacher' => $activity->actor_name ?? 'System',
                    'type' => $activity->type,
                    'status' => $activity->status,
                    'created_at' => $activity->created_at->diffForHumans(),
                ];
            });

        // Latest leave requests
        $leaveRequests = LeaveRequest::with('teacher:id,full_name')
            ->select('id', 'teacher_id', 'leave_type', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'teacher' => $leave->teacher?->full_name ?? 'Unknown',
                    'type' => ucfirst(str_replace('_', ' ', $leave->leave_type)),
                    'status' => $leave->status,
                    'created_at' => $leave->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'leaveRequests' => $leaveRequests,
        ]);
    }

   public function teacher()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        $stats = [
            'subjects' => SectionSubject::where('teacher_id', $teacher->id)->count(),
            'classes_today' => TimetableSlot::where('teacher_id', $teacher->id)
                ->where('day_of_week', strtolower(now()->format('l')))
                ->count(),
            'pending_leaves' => LeaveRequest::where('teacher_id', $teacher->id)
                ->whereIn('status', ['pending', 'section_approved'])
                ->count(),
            'total_slots' => TimetableSlot::where('teacher_id', $teacher->id)->count(),
        ];

        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
            'stats' => $stats,
        ]);
    }

   public function student()
    {
        $user = Auth::user();
        $student = $user->student;

        $stats = [
            'subjects' => $student ? $student->section?->subjects()->count() ?? 0 : 0,
            'classes_today' => $student ? TimetableSlot::where('class_room_id', $student->class_room_id)
                ->where('day_of_week', strtolower(now()->format('l')))
                ->count() : 0,
            'marks_entries' => $student ? Mark::where('student_id', $student->id)->count() : 0,
            'upcoming_exams' => 0, // placeholder, can be calculated if exam dates exist
        ];

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'stats' => $stats,
        ]);
    }
}