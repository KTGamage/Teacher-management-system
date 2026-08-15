<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::orderBy('name')->get();
        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subjects/Create');
    }

    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        Subject::create($request->validated());
        return redirect()->route('admin.subjects.index')->with('success', 'Subject created.');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('Admin/Subjects/Edit', [
            'subject' => $subject,
        ]);
    }

    public function update(UpdateSubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());
        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();
        return back()->with('success', 'Subject deleted.');
    }
}