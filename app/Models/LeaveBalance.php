<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    protected $fillable = [
        'teacher_id',
        'leave_type',
        'total_days',
        'used_days',
        'remaining_days',
        'academic_year',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
