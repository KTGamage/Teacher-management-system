<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
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

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $user->id,
            'teacher_registration_number' => $validated['teacher_registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'joining_date' => $validated['joining_date'] ?? null,
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher added successfully.');
    }

    public function edit(Teacher $teacher)
    {
        $teacher->load('user');
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
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        // Update teacher
        $teacher->update([
            'teacher_registration_number' => $validated['teacher_registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'joining_date' => $validated['joining_date'] ?? null,
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher updated.');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->user->delete(); // cascade deletes teacher profile
        return back()->with('success', 'Teacher deleted.');
    }
}