<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        $teacher = $this->route('teacher');
        $userId = $teacher->user_id;
        $teacherId = $teacher->id;

        return [
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'teacher_registration_number' => [
                'required',
                'string',
                Rule::unique('teachers', 'teacher_registration_number')->ignore($teacherId),
            ],
            'full_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'qualifications' => ['nullable', 'json'],
            'specialization' => ['nullable', 'string', 'max:100'],
            'joining_date' => ['nullable', 'date'],
        ];
    }
}