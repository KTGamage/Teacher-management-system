<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Models\User;
use App\Models\Student;
use App\Models\Section;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('user', 'section')->get();
        return Inertia::render('Admin/Students/Index', ['students' => $students]);
    }

    public function create()
    {
        $sections = Section::all();
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

        Student::create([
            'user_id' => $user->id,
            'registration_number' => $validated['registration_number'],
            'full_name' => $validated['full_name'],
            'contact_number' => $validated['contact_number'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'],
            'guardian_contact' => $validated['guardian_contact'],
            'section_id' => $validated['section_id'],
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student added successfully.');
    }
}
