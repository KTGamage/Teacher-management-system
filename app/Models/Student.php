<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'registration_number',
        'full_name',
        'date_of_birth',
        'contact_number',
        'address',
        'guardian_name',
        'guardian_contact',
        'section_id',
        'class_room_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];


    /**
     * @property-read \App\Models\User $user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function classRoom(): BelongsTo
    {
        return $this->belongsTo(ClassRoom::class);
    }
}
