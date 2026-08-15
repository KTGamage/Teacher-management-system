<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        $student = $this->route('student');
        $userId = $student->user_id;
        $studentId = $student->id;

        return [
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:6'],
            'registration_number' => ['required', 'string', Rule::unique('students', 'registration_number')->ignore($studentId)],
            'full_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['required', 'string', 'max:255'],
            'guardian_contact' => ['required', 'string', 'max:20'],
            'section_id' => ['required', 'exists:sections,id'],
            'class_room_id' => ['required', 'exists:class_rooms,id'],
        ];
    }
}