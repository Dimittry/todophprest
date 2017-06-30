<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Task extends Eloquent
{
    protected $table = "tasks";

    protected $fillable = [
        'name',
        'completed',
        'user_id'
    ];
}