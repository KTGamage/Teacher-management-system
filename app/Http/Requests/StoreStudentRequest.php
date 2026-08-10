<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
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
            'registration_number' => ['required', 'string', 'unique:students,registration_number'],
            'full_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['required', 'string', 'max:255'],
            'guardian_contact' => ['required', 'string', 'max:20'],
            'section_id' => ['required', 'exists:sections,id'],
        ];
    }
}
