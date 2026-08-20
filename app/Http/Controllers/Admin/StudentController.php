<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\User;
use App\Models\Student;
use App\Models\Section;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('user', 'section', 'classRoom')->get();
        return Inertia::render('Admin/Students/Index', ['students' => $students]);
    }

    public function create()
    {
        $sections = Section::with('classes')->orderBy('name')->get();
        return Inertia::render('Admin/Students/Create', ['sections' => $sections]);
    }

    public function store(StoreStudentRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'registration_number' => $validated['registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'],
            'guardian_contact' => $validated['guardian_contact'],
            'section_id' => $validated['section_id'],
            'class_room_id' => $validated['class_room_id'],
        ]);

        // Log activity
        Activity::create([
            'actor_name' => Auth::user()?->name ?? 'System',
            'type' => 'Student Created',
            'status' => 'success',
            'description' => "New student {$student->full_name} added.",
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student added successfully.');
    }

    public function edit(Student $student)
    {
        $student->load('user');
        $sections = Section::with('classes')->orderBy('name')->get();
        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'sections' => $sections,
        ]);
    }

    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $validated = $request->validated();

        // Update user
        $user = $student->user;
        $user->name = $validated['full_name'];
        $user->email = $validated['email'];
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        // Update student
        $student->update([
            'registration_number' => $validated['registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'],
            'guardian_contact' => $validated['guardian_contact'],
            'section_id' => $validated['section_id'],
            'class_room_id' => $validated['class_room_id'],
        ]);

        // Log activity
        Activity::create([
            'actor_name' => Auth::user()?->name ?? 'System',
            'type' => 'Student Updated',
            'status' => 'info',
            'description' => "Student {$student->full_name} updated.",
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student updated.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->user->delete();

        Activity::create([
            'actor_name' => Auth::user()?->name ?? 'System',
            'type' => 'Student Deleted',
            'status' => 'warning',
            'description' => "Student {$student->full_name} deleted.",
        ]);

        return back()->with('success', 'Student deleted.');
    }
}