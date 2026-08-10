<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
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
        Route::resource('teachers', TeacherController::class)->only(['index', 'create', 'store']);
        Route::resource('students', StudentController::class)->only(['index', 'create', 'store']);
    });

    // Teacher routes
    Route::middleware('role:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'teacher'])->name('dashboard');
        // Future: timetable, marks, etc.
    });

    // Student routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'student'])->name('dashboard');
        // Future: marks, etc.
    });
});
