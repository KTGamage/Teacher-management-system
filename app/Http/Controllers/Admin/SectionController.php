<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionRequest;
use App\Models\Section;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\ClassRoom;
use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use \Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Admin/Sections/Index', ['sections' => $sections]);
    }

    public function create()
    {
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')
            ->orderBy('full_name')->get();
        return Inertia::render('Admin/Sections/Create', ['teachers' => $teachers]);
    }

    public function store(SectionRequest $request): RedirectResponse
    {
        $section = Section::create($request->validated());

        $this->syncSectionHeadStatus($section->section_head_id);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Section Created',
            'status' => 'success',
            'description' => "Section {$section->name} added.",
        ]);

        return redirect()->route('admin.sections.index')->with('success', 'Section created successfully.');
    }

    public function edit(Section $section)
    {
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')->orderBy('full_name')->get();
        return Inertia::render('Admin/Sections/Edit', ['section' => $section, 'teachers' => $teachers]);
    }

    public function update(SectionRequest $request, Section $section): RedirectResponse
    {
        $oldHeadId = $section->section_head_id;
        $section->update($request->validated());

          if ($oldHeadId != $section->section_head_id) {
                $this->syncSectionHeadStatus($section->section_head_id, $oldHeadId);
            }

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Section Updated',
            'status' => 'info',
            'description' => "Section {$section->name} updated.",
        ]);

        return redirect()->route('admin.sections.index')->with('success', 'Section updated successfully.');
    }

    public function destroy(Section $section): RedirectResponse
    {
        $oldHeadId = $section->section_head_id;
        $section->delete();

        if ($oldHeadId) {
            $this->syncSectionHeadStatus(null, $oldHeadId);
        }

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Section Deleted',
            'status' => 'warning',
            'description' => "Section {$section->name} deleted.",
        ]);

        return back()->with('success', 'Section deleted.');
    }

    public function duplicate(Section $section): RedirectResponse
    {
        $newSection = $section->replicate();
        $newSection->name = $section->name . ' (Copy)';
        $newSection->code = $section->code . '_copy';
        $newSection->section_head_id = null;
        $newSection->save();

        foreach ($section->subjects as $subject) {
            $newSection->subjects()->attach($subject->id, ['teacher_id' => $subject->pivot->teacher_id]);
        }
        foreach ($section->classes as $class) {
            $newSection->classes()->create(['name' => $class->name]);
        }

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Section Duplicated',
            'status' => 'info',
            'description' => "Section {$section->name} duplicated.",
        ]);

        return redirect()->route('admin.sections.index')->with('success', 'Section duplicated successfully.');
    }

    public function subjects(Section $section)
    {
        $sectionSubjects = $section->sectionSubjects()->with('subject:id,name,code', 'teacher:id,full_name')->get();
        $subjects = $sectionSubjects->map(function ($ss) {
            return [
                'id' => $ss->subject_id,
                'name' => $ss->subject->name,
                'code' => $ss->subject->code,
                'teacher' => $ss->teacher ? $ss->teacher->full_name : null,
            ];
        });
        $allSubjects = Subject::orderBy('name')->get();
        $teachers = Teacher::select('id', 'full_name', 'teacher_registration_number')->orderBy('full_name')->get();

        return Inertia::render('Admin/Sections/Subjects', [
            'section' => $section,
            'subjects' => $subjects,
            'allSubjects' => $allSubjects,
            'teachers' => $teachers,
        ]);
    }

    public function attachSubject(Request $request, Section $section): RedirectResponse
    {
        $request->validate(['subject_id' => 'required|exists:subjects,id', 'teacher_id' => 'required|exists:teachers,id']);

        if (!$section->subjects->contains($request->subject_id)) {
            $section->subjects()->attach($request->subject_id, ['teacher_id' => $request->teacher_id]);
        }

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Subject Assigned to Section',
            'status' => 'info',
            'description' => "Subject assigned to section {$section->name}.",
        ]);

        return back()->with('success', 'Subject added to section.');
    }

    public function detachSubject(Section $section, Subject $subject): RedirectResponse
    {
        $section->subjects()->detach($subject->id);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Subject Removed from Section',
            'status' => 'warning',
            'description' => "Subject {$subject->name} removed from section {$section->name}.",
        ]);

        return back()->with('success', 'Subject removed from section.');
    }

    public function classes(Section $section)
    {
        $classes = $section->classes()->orderBy('name')->get();
        return Inertia::render('Admin/Sections/Classes', ['section' => $section, 'classes' => $classes]);
    }

    public function storeClass(Request $request, Section $section): RedirectResponse
    {
        $request->validate(['name' => ['required', 'string', 'max:10']]);
        $section->classes()->create(['name' => $request->name]);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Class Added',
            'status' => 'success',
            'description' => "Class {$request->name} added to section {$section->name}.",
        ]);

        return back()->with('success', 'Class added.');
    }

    public function destroyClass(ClassRoom $classRoom): RedirectResponse
    {
        $classRoom->delete();

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Class Deleted',
            'status' => 'warning',
            'description' => "Class {$classRoom->name} deleted.",
        ]);

        return back()->with('success', 'Class deleted.');
    }

    private function syncSectionHeadStatus(?int $newHeadId, ?int $oldHeadId = null): void
    {
        // If old head exists, check if they still head any section
        if ($oldHeadId) {
            $oldHead = Teacher::find($oldHeadId);
            if ($oldHead) {
                $oldHead->update([
                    'is_section_head' => Section::where('section_head_id', $oldHeadId)->exists(),
                ]);
            }
        }

        // Set new head's flag to true
        if ($newHeadId) {
            $newHead = Teacher::find($newHeadId);
            if ($newHead) {
                $newHead->update(['is_section_head' => true]);
            }
        }
    }

    /**
     * Show teachers assigned to a section.
     */
    public function teachers(Section $section)
    {
        $assignedTeachers = $section->teachers()
            ->select('teachers.id', 'teachers.full_name', 'teachers.teacher_registration_number')
            ->orderBy('teachers.full_name')
            ->get();

        $allTeachers = Teacher::select('id', 'full_name', 'teacher_registration_number')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('Admin/Sections/Teachers', [
            'section' => $section,
            'assignedTeachers' => $assignedTeachers,
            'allTeachers' => $allTeachers,
        ]);
    }

    /**
     * Attach a teacher to a section.
     */
    public function attachTeacher(Request $request, Section $section): RedirectResponse
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
        ]);

        if (!$section->teachers()->where('teacher_id', $request->teacher_id)->exists()) {
            $section->teachers()->attach($request->teacher_id);
        }

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Teacher Assigned to Section',
            'status' => 'info',
            'description' => "Teacher ID {$request->teacher_id} assigned to section {$section->name}.",
        ]);

        return back()->with('success', 'Teacher assigned to section.');
    }

    /**
     * Detach a teacher from a section.
     */
    public function detachTeacher(Section $section, Teacher $teacher): RedirectResponse
    {
        $section->teachers()->detach($teacher->id);

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Teacher Removed from Section',
            'status' => 'warning',
            'description' => "Teacher {$teacher->full_name} removed from section {$section->name}.",
        ]);

        return back()->with('success', 'Teacher removed from section.');
    }
}