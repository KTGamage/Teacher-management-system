<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\MarkController;
use App\Http\Controllers\LeaveController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Homepage – role‑based redirect when logged in
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => redirect()->route('login'),
        };
    }
    return redirect()->route('login');
});

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'changePassword'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');

        // Teachers
        Route::resource('teachers', TeacherController::class);

        // Students
        Route::resource('students', StudentController::class);

        // Subjects
        Route::resource('subjects', SubjectController::class);

        // Sections
        Route::resource('sections', SectionController::class);
        Route::post('sections/{section}/duplicate', [SectionController::class, 'duplicate'])
            ->name('sections.duplicate');
        Route::get('sections/{section}/subjects', [SectionController::class, 'subjects'])
            ->name('sections.subjects');
        Route::post('sections/{section}/subjects', [SectionController::class, 'attachSubject'])
            ->name('sections.subjects.attach');
        Route::delete('sections/{section}/subjects/{subject}', [SectionController::class, 'detachSubject'])
            ->name('sections.subjects.detach');

        Route::get('/sections/{section}/classes', [SectionController::class, 'classes'])->name('sections.classes');
        Route::post('/sections/{section}/classes', [SectionController::class, 'storeClass'])->name('sections.classes.store');
        Route::delete('/classes/{classRoom}', [SectionController::class, 'destroyClass'])->name('classes.destroy');


        // Admin Marks for student
        Route::get('/students/{student}/marks', [MarkController::class, 'adminStudentMarks'])
            ->name('students.marks');
        Route::get('/students/{student}/marks/pdf', [MarkController::class, 'downloadPdf'])
            ->name('students.marks.pdf');

        // Admin Leaves
        Route::get('/leaves', [LeaveController::class, 'adminIndex'])->name('leaves.index');
        Route::put('/leaves/{leave}/approve', [LeaveController::class, 'adminApprove'])->name('leaves.approve');
        Route::put('/leaves/{leave}/reject', [LeaveController::class, 'reject'])->name('leaves.reject');
    });

    // Timetable management (section heads and admins)
    Route::middleware('role:admin,teacher')->prefix('timetable')->name('timetable.')->group(function () {
        Route::get('/', [TimetableController::class, 'index'])->name('index');
        Route::get('/{section}', [TimetableController::class, 'show'])->name('show');
        Route::get('/{section}/section-subjects', [TimetableController::class, 'sectionSubjects'])->name('section.subjects');
        Route::post('/', [TimetableController::class, 'store'])->name('store');
        Route::delete('/{slot}', [TimetableController::class, 'destroy'])->name('destroy');
    });

    // Teacher routes
    Route::middleware('role:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'teacher'])->name('dashboard');
        Route::get('/timetable', [TimetableController::class, 'myTimetable'])->name('timetable');

        // Teacher Marks
        Route::get('/mark-entry', [MarkController::class, 'teacherIndex'])->name('marks.index');
        Route::get('/mark-entry/{sectionSubject}', [MarkController::class, 'teacherEntry'])->name('marks.entry');
        Route::post('/marks', [MarkController::class, 'store'])->name('marks.store');

        // Teacher Leaves
        Route::get('/leaves', [LeaveController::class, 'teacherIndex'])->name('leaves.index');
        Route::get('/leaves/create', [LeaveController::class, 'create'])->name('leaves.create');
        Route::post('/leaves', [LeaveController::class, 'store'])->name('leaves.store');

        // Section Head approval (teacher can approve if they are section head)
        Route::put('/leaves/{leave}/section-approve', [LeaveController::class, 'sectionApprove'])->name('leaves.sectionApprove');
    });

    // Student routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'student'])->name('dashboard');
        Route::get('/timetable', [TimetableController::class, 'studentTimetable'])->name('timetable');

        // Student Marks
        Route::get('/marks', [MarkController::class, 'studentMarks'])->name('marks.index');
        Route::get('/marks/pdf', [MarkController::class, 'downloadPdf'])->name('marks.pdf');
    });
});

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/teacher-directory', function () {
    return view('teacherDirectory');
})->name('teacher.directory');
