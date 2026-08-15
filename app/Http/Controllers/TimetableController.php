<?php

namespace App\Http\Controllers;

use App\Http\Requests\TimetableSlotRequest;
use App\Models\Section;
use App\Models\TimetableSlot;
use App\Models\SectionSubject;
use App\Models\ClassRoom;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $sections = Section::with('head', 'classes')->orderBy('name')->get();
        } elseif ($user->role === 'teacher' && $user->teacher?->is_section_head) {
            $sections = Section::where('section_head_id', $user->teacher->id)
                ->with('head', 'classes')
                ->orderBy('name')
                ->get();
        } else {
            abort(403);
        }

        return Inertia::render('Timetable/Index', [
            'sections' => $sections,
            'days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        ]);
    }

    public function show(Section $section, Request $request)
    {
        $this->authorizeAccess($section);

        $query = TimetableSlot::with([
            'sectionSubject.subject:id,name,code',
            'teacher:id,full_name',
            'classRoom:id,name'
        ])
        ->whereIn('section_subject_id', $section->sectionSubjects->pluck('id'));

        if ($request->has('class_room_id') && $request->class_room_id) {
            $query->where('class_room_id', $request->class_room_id);
        }

        $slots = $query->orderBy('day_of_week')->orderBy('start_time')->get();

        return response()->json($slots);
    }

    public function sectionSubjects(Section $section)
    {
        $this->authorizeAccess($section);

        $subjects = SectionSubject::with('subject:id,name,code', 'teacher:id,full_name')
            ->where('section_id', $section->id)
            ->get();

        $teachers = \App\Models\Teacher::select('id', 'full_name')->orderBy('full_name')->get();
        $classes = $section->classes()->orderBy('name')->get();

        return response()->json([
            'section_subjects' => $subjects,
            'teachers' => $teachers,
            'classes' => $classes,
        ]);
    }

    public function store(TimetableSlotRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Conflict check (consider class_room_id as well)
        $conflict = TimetableSlot::where('day_of_week', $validated['day_of_week'])
            ->where('teacher_id', $validated['teacher_id'])
            ->where('class_room_id', $validated['class_room_id'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($conflict) {
            return back()->withErrors(['conflict' => 'This time slot conflicts with an existing one for the selected teacher and class.']);
        }

        $slot = TimetableSlot::create($validated);

        // If section_subject has no teacher, assign the teacher from the slot
        $sectionSubject = SectionSubject::find($validated['section_subject_id']);
        if ($sectionSubject && is_null($sectionSubject->teacher_id)) {
            $sectionSubject->teacher_id = $validated['teacher_id'];
            $sectionSubject->save();
        }

        return back()->with('success', 'Time slot added.');
    }

    public function destroy(TimetableSlot $slot): RedirectResponse
    {
        $section = $slot->sectionSubject->section;
        $this->authorizeAccess($section);
        $slot->delete();
        return back()->with('success', 'Slot removed.');
    }

    public function myTimetable(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'teacher') abort(403);

        $teacher = $user->teacher;
        $slots = TimetableSlot::with([
            'sectionSubject.subject:id,name,code',
            'sectionSubject.section:id,name,code',
            'classRoom:id,name'
        ])
            ->where('teacher_id', $teacher->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Teacher/Timetable', [
            'slots' => $slots,
            'days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        ]);
    }

    public function studentTimetable(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $student = $user->student;
        if (!$student || !$student->class_room_id) {
            return Inertia::render('Student/Timetable', [
                'slots' => [],
                'days' => [],
            ]);
        }

        $slots = TimetableSlot::with([
            'sectionSubject.subject:id,name,code',
            'teacher:id,full_name',
            'classRoom:id,name'
        ])
            ->where('class_room_id', $student->class_room_id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Student/Timetable', [
            'slots' => $slots,
            'days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        ]);
    }

    protected function authorizeAccess(Section $section): void
    {
        $user = request()->user();
        abort_if(
            !($user->role === 'admin' ||
                ($user->role === 'teacher' &&
                    $user->teacher?->is_section_head &&
                    $section->section_head_id === $user->teacher->id)),
            403
        );
    }
}