<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseOcupantHistory extends Model
{
    protected $table = 'house_ocupant_histories';
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    public function home()
    {
        return $this->belongsTo(Home::class, 'home_id');
    }
    public function ocupant()
    {
        return $this->belongsTo(Ocupant::class, 'ocupant_id');
    }
}
