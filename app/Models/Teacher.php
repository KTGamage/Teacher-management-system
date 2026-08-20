<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'teacher_registration_number',
        'full_name',
        'qualifications',
        'specialization',
        'joining_date',
        'contact_number',
        'address',
        'is_section_head',
    ];

    protected $casts = [
        'qualifications' => 'array',
        'joining_date' => 'date',
        'is_section_head' => 'boolean',
    ];

    /**
     * @property-read \App\Models\User $user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sectionHeaded(): HasOne
    {
        return $this->hasOne(Section::class, 'section_head_id');
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'section_teacher')
            ->withTimestamps();
    }
}
