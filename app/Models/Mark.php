<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mark extends Model
{
    protected $fillable = [
        'student_id',
        'section_subject_id',
        'teacher_id',
        'marks',
        'exam_type',
        'exam_date',
        'remarks',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'marks' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function sectionSubject(): BelongsTo
    {
        return $this->belongsTo(SectionSubject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
