<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Section extends Model
{
    protected $fillable = ['name', 'code', 'academic_year', 'section_head_id', 'is_active'];

    public function head(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'section_head_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'section_subject')
            ->withPivot('id', 'teacher_id', 'is_active')
            ->withTimestamps();
    }

    public function sectionSubjects(): HasMany
    {
        return $this->hasMany(SectionSubject::class);
    }

    public function classes(): HasMany
    {
        return $this->hasMany(ClassRoom::class);
    }
}
