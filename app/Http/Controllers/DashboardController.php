<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Section;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'teachers' => Teacher::count(),
                'students' => Student::count(),
                'sections' => Section::count(),
            ]
        ]);
    }

    public function teacher()
    {
        $user = auth()->user();
        $teacher = $user->teacher;
        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
            'timetable' => [],   // placeholder
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
