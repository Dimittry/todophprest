<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class User extends Eloquent
{
    protected $table = "users";

    protected $fillable = [
        'username',
        'password'
    ];

    protected $hidden = ['password'];

    public function tasks()
    {
        return $this->hasMany('App\Models\Task');
    }
}