<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class ShareTodo extends Eloquent
{
    protected $table = "share_todos";

    protected $fillable = [
        'owner_id',
        'client_id',
        'editable'
    ];


    public function sharedUsers()
    {
        return $this->hasMany('App\Models\User', 'id', 'owner_id');
    }
}