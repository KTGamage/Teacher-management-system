<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ];

        if ($user->role === 'teacher') {
            $rules = array_merge($rules, [
                'full_name' => ['required', 'string', 'max:255'],
                'contact_number' => ['required', 'string', 'max:20'],
                'address' => ['nullable', 'string'],
                'qualifications' => ['nullable', 'json'],
                'specialization' => ['nullable', 'string', 'max:100'],
            ]);
        } elseif ($user->role === 'student') {
            $rules = array_merge($rules, [
                'full_name' => ['required', 'string', 'max:255'],
                'contact_number' => ['required', 'string', 'max:20'],
                'address' => ['nullable', 'string'],
                'guardian_name' => ['required', 'string', 'max:255'],
                'guardian_contact' => ['required', 'string', 'max:20'],
            ]);
        }

        return $rules;
    }
}
