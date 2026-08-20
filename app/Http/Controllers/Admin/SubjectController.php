<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use \Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::orderBy('name')->get();
        return Inertia::render('Admin/Subjects/Index', ['subjects' => $subjects]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subjects/Create');
    }

    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        $subject = Subject::create($request->validated());

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Subject Created',
            'status' => 'success',
            'description' => "Subject {$subject->name} added.",
        ]);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject created.');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('Admin/Subjects/Edit', ['subject' => $subject]);
    }

    public function update(UpdateSubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Subject Updated',
            'status' => 'info',
            'description' => "Subject {$subject->name} updated.",
        ]);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();

        Activity::create([
            'actor_name' => Auth::user()->name ?? 'System',
            'type' => 'Subject Deleted',
            'status' => 'warning',
            'description' => "Subject {$subject->name} deleted.",
        ]);

        return back()->with('success', 'Subject deleted.');
    }
}