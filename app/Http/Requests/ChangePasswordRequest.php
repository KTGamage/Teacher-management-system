<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', function ($attribute, $value, $fail) {
                if (!Hash::check($value, $this->user()->password)) {
                    $fail('The current password is incorrect.');
                }
            }],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }
}
