<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('sections', 'code')->ignore($this->route('section')),
            ],
            'section_head_id' => ['nullable', 'exists:teachers,id'],
            'academic_year' => ['nullable', 'string', 'max:10'],
        ];
    }
}
