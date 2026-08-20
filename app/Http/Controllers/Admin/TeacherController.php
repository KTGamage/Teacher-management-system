<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use \Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('user')->get();
        return Inertia::render('Admin/Teachers/Index', ['teachers' => $teachers]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teachers/Create');
    }

    public function store(StoreTeacherRequest $request)
    {
        $validated = $request->validated();
        $qualifications = $this->parseQualifications($validated['qualifications'] ?? null);

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
        ]);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'teacher_registration_number' => $validated['teacher_registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'] ?? null,
            'qualifications' => $qualifications,
            'specialization' => $validated['specialization'] ?? null,
            'joining_date' => $validated['joining_date'] ?? null,
        ]);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Teacher Created',
            'status' => 'success',
            'description' => "New teacher {$teacher->full_name} added.",
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher added successfully.');
    }

    public function edit(Teacher $teacher)
    {
        $teacher->load('user');
        if (is_array($teacher->qualifications)) {
            $teacher->qualifications = implode(', ', $teacher->qualifications);
        }
        return Inertia::render('Admin/Teachers/Edit', [
            'teacher' => $teacher,
        ]);
    }

    public function update(UpdateTeacherRequest $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validated();

        // Update user
        $user = $teacher->user;
        $user->name = $validated['full_name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        $teacher->update([
            'teacher_registration_number' => $validated['teacher_registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'joining_date' => $validated['joining_date'] ?? null,
        ]);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Teacher Updated',
            'status' => 'info',
            'description' => "Teacher {$teacher->full_name} updated.",
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher updated.');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->user->delete();

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Teacher Deleted',
            'status' => 'warning',
            'description' => "Teacher {$teacher->full_name} deleted.",
        ]);

        return back()->with('success', 'Teacher deleted.');
    }

    private function parseQualifications(?string $qualifications): ?array
    {
        if (empty($qualifications)) {
            return null;
        }
        $parts = array_filter(array_map('trim', explode(',', $qualifications)));
        return array_values($parts);
    }
}