<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMarkRequest;
use App\Models\Activity;
use App\Models\Mark;
use App\Models\Section;
use App\Models\SectionSubject;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MarkController extends Controller
{
    /**
     * Teacher: list assigned sections and subjects for mark entry.
     */
    public function teacherIndex(Request $request)
    {
        $teacher = $request->user()->teacher;

        $sectionSubjects = SectionSubject::with('subject:id,name,code', 'section:id,name,code')
            ->where('teacher_id', $teacher->id)
            ->get();

        return Inertia::render('Teacher/MarkEntry', [
            'sectionSubjects' => $sectionSubjects,
        ]);
    }

    /**
     * Teacher: show form to enter/edit marks for a specific section_subject.
     */
    public function teacherEntry(Request $request, SectionSubject $sectionSubject)
    {
        $teacher = $request->user()->teacher;

        // Ensure teacher owns this section_subject
        if ($sectionSubject->teacher_id !== $teacher->id) {
            abort(403);
        }

        $students = Student::where('section_id', $sectionSubject->section_id)
            ->orderBy('full_name')
            ->get();

        $existingMarks = Mark::where('section_subject_id', $sectionSubject->id)
            ->where('exam_type', $request->query('exam_type', 'class_test'))
            ->where('exam_date', $request->query('exam_date', today()->toDateString()))
            ->get()
            ->keyBy('student_id');

        return Inertia::render('Teacher/MarkEntryForm', [
            'sectionSubject' => $sectionSubject->load('subject', 'section'),
            'students' => $students,
            'existingMarks' => $existingMarks,
            'examType' => $request->query('exam_type', 'class_test'),
            'examDate' => $request->query('exam_date', today()->toDateString()),
        ]);
    }

    /**
     * Teacher: store/update marks.
     */
        public function store(StoreMarkRequest $request)
        {
            $validated = $request->validated();
            $teacher = $request->user()->teacher;

            $sectionSubject = SectionSubject::findOrFail($validated['section_subject_id']);
            if ($sectionSubject->teacher_id !== $teacher->id) {
                abort(403);
            }

            foreach ($validated['marks'] as $markData) {
                Mark::updateOrCreate(
                    [
                        'student_id' => $markData['student_id'],
                        'section_subject_id' => $validated['section_subject_id'],
                        'exam_type' => $validated['exam_type'],
                        'exam_date' => $validated['exam_date'],
                    ],
                    [
                        'marks' => $markData['marks'],
                        'remarks' => $markData['remarks'] ?? null,
                        'teacher_id' => $teacher->id,
                    ]
                );
            }

            Activity::create([
                'actor_name' => $teacher->full_name,
                'type' => 'Marks Entered',
                'status' => 'info',
                'description' => "Marks entered for {$sectionSubject->subject->name}.",
            ]);

            return back()->with('success', 'Marks saved.');
        }

    /**
     * Student: show own marks.
     */
    public function studentMarks(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) abort(403);

        $marks = Mark::with('sectionSubject.subject:id,name,code')
            ->where('student_id', $student->id)
            ->orderBy('exam_date', 'desc')
            ->get()
            ->groupBy('section_subject_id');

        return Inertia::render('Student/MyMarks', [
            'student' => $student,
            'marks' => $marks,
        ]);
    }

    /**
     * Admin: view marks for a specific student.
     */
    public function adminStudentMarks(Student $student)
    {
        $marks = Mark::with('sectionSubject.subject:id,name,code')
            ->where('student_id', $student->id)
            ->orderBy('exam_date', 'desc')
            ->get()
            ->groupBy('section_subject_id');

        return Inertia::render('Admin/Students/Marks', [
            'student' => $student,
            'marks' => $marks,
        ]);
    }

    /**
     * Download marks as PDF for a student (admin, teacher, student).
     */
    public function downloadPdf(Student $student)
    {
        $user = request()->user();
        // Authorization: admin, or teacher if they teach the student, or the student themselves
        if ($user->role === 'student' && $user->student && $user->student->id === $student->id) {
            // ok
        } elseif ($user->role === 'admin') {
            // ok
        } else {
            abort(403);
        }

        $marks = Mark::with('sectionSubject.subject:id,name,code')
            ->where('student_id', $student->id)
            ->orderBy('exam_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.student-marks', compact('student', 'marks'));
        return $pdf->download("marks-{$student->registration_number}.pdf");
    }

    public function studentDownloadPdf(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student' || !$user->student) {
            abort(403);
        }

        $student = $user->student;
        $marks = Mark::with('sectionSubject.subject:id,name,code')
            ->where('student_id', $student->id)
            ->orderBy('exam_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.student-marks', compact('student', 'marks'));
        return $pdf->download("marks-{$student->registration_number}.pdf");
    }
}
