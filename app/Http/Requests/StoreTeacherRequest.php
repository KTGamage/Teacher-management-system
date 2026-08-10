<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'teacher_registration_number' => ['required', 'string', 'unique:teachers,teacher_registration_number'],
            'full_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'qualifications' => ['nullable', 'json'],
            'specialization' => ['nullable', 'string', 'max:100'],
            'joining_date' => ['nullable', 'date'],
        ];
    }
}
