<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionRequest;
use App\Models\Section;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\ClassRoom;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::with('head:id,full_name,teacher_registration_number')
            ->withCount('students')
            ->withCount('classes')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Sections/Index', [
            'sections' => $sections,
        ]);
    }

    public function create()
    {
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('Admin/Sections/Create', [
            'teachers' => $teachers,
        ]);
    }

    public function store(SectionRequest $request): RedirectResponse
    {
        $section = Section::create($request->validated());

        return redirect()
            ->route('admin.sections.index')
            ->with('success', 'Section created successfully.');
    }

    public function edit(Section $section)
    {
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('Admin/Sections/Edit', [
            'section' => $section,
            'teachers' => $teachers,
        ]);
    }

    public function update(SectionRequest $request, Section $section): RedirectResponse
    {
        $section->update($request->validated());

        return redirect()
            ->route('admin.sections.index')
            ->with('success', 'Section updated successfully.');
    }

    public function destroy(Section $section): RedirectResponse
    {
        $section->delete();
        return back()->with('success', 'Section deleted.');
    }

    public function duplicate(Section $section): RedirectResponse
    {
        $newSection = $section->replicate();
        $newSection->name = $section->name . ' (Copy)';
        $newSection->code = $section->code . '_copy';
        $newSection->section_head_id = null;
        $newSection->save();

        // Copy subject assignments
        foreach ($section->subjects as $subject) {
            $newSection->subjects()->attach($subject->id, [
                'teacher_id' => $subject->pivot->teacher_id,
            ]);
        }

        // Copy classes
        foreach ($section->classes as $class) {
            $newSection->classes()->create(['name' => $class->name]);
        }

        return redirect()
            ->route('admin.sections.index')
            ->with('success', 'Section duplicated successfully.');
    }

    public function subjects(Section $section)
    {
        $section->load('subjects');
        $allSubjects = Subject::orderBy('name')->get();
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('Admin/Sections/Subjects', [
            'section' => $section,
            'subjects' => $section->subjects,
            'allSubjects' => $allSubjects,
            'teachers' => $teachers,
        ]);
    }

    public function attachSubject(Request $request, Section $section): RedirectResponse
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
        ]);

        // Attach if not already attached
        if (!$section->subjects->contains($request->subject_id)) {
            $section->subjects()->attach($request->subject_id, [
                'teacher_id' => $request->teacher_id,
            ]);
        }

        return back()->with('success', 'Subject added to section.');
    }

    public function detachSubject(Section $section, Subject $subject): RedirectResponse
    {
        $section->subjects()->detach($subject->id);
        return back()->with('success', 'Subject removed from section.');
    }

    public function classes(Section $section)
    {
        $classes = $section->classes()->orderBy('name')->get();
        return Inertia::render('Admin/Sections/Classes', [
            'section' => $section,
            'classes' => $classes,
        ]);
    }

    public function storeClass(Request $request, Section $section): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:10'],
        ]);

        $section->classes()->create(['name' => $request->name]);

        return back()->with('success', 'Class added.');
    }

    public function destroyClass(ClassRoom $classRoom): RedirectResponse
    {
        $classRoom->delete();
        return back()->with('success', 'Class deleted.');
    }
}