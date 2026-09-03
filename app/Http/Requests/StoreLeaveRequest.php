<?php

namespace App\Http\Requests;

use App\Models\LeaveRequest;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'teacher' && $this->user()->teacher !== null;
    }

    public function rules(): array
    {
        return [
            'leave_type' => ['required', 'in:annual,sick,casual,duty,other'],
            'start_date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i', 'required_with:end_time'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'end_time' => ['nullable', 'date_format:H:i', 'required_with:start_time'],
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }

    /** @return array<int, Closure> */
    public function after(): array
    {
        return [
            function ($validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $teacher = $this->user()->teacher;

                if (! $teacher->is_section_head && ! $teacher->sections()
                    ->where('sections.is_active', true)
                    ->whereNotNull('sections.section_head_id')
                    ->exists()) {
                    $validator->errors()->add(
                        'leave_type',
                        'You must be assigned to an active section with a section head before requesting leave.'
                    );

                    return;
                }

                if ($this->input('start_date') === $this->input('end_date')
                    && $this->filled('start_time')
                    && $this->filled('end_time')
                    && $this->input('end_time') <= $this->input('start_time')) {
                    $validator->errors()->add('end_time', 'The end time must be after the start time.');
                }

                $overlap = LeaveRequest::query()
                    ->where('teacher_id', $teacher->id)
                    ->whereIn('status', ['pending', 'section_approved', 'admin_approved'])
                    ->whereDate('start_date', '<=', $this->input('end_date'))
                    ->whereDate('end_date', '>=', $this->input('start_date'))
                    ->when($this->route('leave'), function ($query, LeaveRequest $leave) {
                        $query->whereKeyNot($leave->id);
                    })
                    ->exists();

                if ($overlap) {
                    $validator->errors()->add('start_date', 'This leave period overlaps an existing active request.');
                }
            },
        ];
    }
}
