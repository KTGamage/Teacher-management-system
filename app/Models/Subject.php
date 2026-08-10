<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = ['name', 'code', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'section_subject')
            ->withPivot('id', 'teacher_id', 'is_active')
            ->withTimestamps();
    }

    public function sectionSubjects(): HasMany
    {
        return $this->hasMany(SectionSubject::class);
    }
}
