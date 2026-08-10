<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SectionSubject extends Model
{
    protected $table = 'section_subject';

    protected $fillable = [
        'section_id',
        'subject_id',
        'teacher_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }

    public function timetableSlots(): HasMany
    {
        return $this->hasMany(TimetableSlot::class);
    }
}
