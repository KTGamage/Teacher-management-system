<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Section;
use App\Models\Subject;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

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

        $recentActivity = LeaveRequest::with('teacher:id,full_name')
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
        ]);
    }

    public function teacher()
    {
        $user = auth()->user();
        $teacher = $user->teacher;
        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
            'timetable' => [],
        ]);
    }

    public function student()
    {
        $user = auth()->user();
        $student = $user->student;
        return Inertia::render('Student/Dashboard', [
            'student' => $student,
        ]);
    }
}