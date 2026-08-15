<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'section_subject_id' => ['required', 'exists:section_subject,id'],
            'exam_type' => ['required', 'in:class_test,mid_term,final_exam,assignment'],
            'exam_date' => ['required', 'date'],
            'marks' => ['required', 'array'],
            'marks.*.student_id' => ['required', 'exists:students,id'],
            'marks.*.marks' => ['required', 'numeric', 'min:0', 'max:100'],
            'marks.*.remarks' => ['nullable', 'string'],
        ];
    }
}
