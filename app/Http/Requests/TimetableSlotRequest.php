<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimetableSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user &&
            (
                $user->role === 'admin' ||
                ($user->role === 'teacher' && $user->teacher?->is_section_head)
            );
    }

    public function rules(): array
    {
        return [
            'section_subject_id' => ['required', 'exists:section_subject,id'],
            'day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'teacher_id' => ['required', 'exists:teachers,id'],
            'class_room_id' => ['required', 'exists:class_rooms,id'],
        ];
    }
}
