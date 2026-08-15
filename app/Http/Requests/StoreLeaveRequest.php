<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'leave_type' => ['required', 'in:annual,sick,casual,duty,other'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string'],
        ];
    }
}
