<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    protected $fillable = [
        'teacher_id',
        'leave_type',
        'start_date',
        'end_date',
        'reason',
        'status',
        'section_head_approval',
        'section_head_approval_date',
        'section_head_remarks',
        'admin_approval',
        'admin_approval_date',
        'admin_remarks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'section_head_approval' => 'boolean',
        'section_head_approval_date' => 'datetime',
        'admin_approval' => 'boolean',
        'admin_approval_date' => 'datetime',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
