<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'actor_name',
        'type',
        'status',
        'description',
    ];
}