<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Home extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    public function houseOcupantHistories()
    {
        return $this->hasMany(HouseOcupantHistory::class, 'home_id');
    }
    public function currentOcupants()
    {
        return $this->hasMany(HouseOcupantHistory::class, 'home_id')
            ->where('is_current_resident', true)->with('ocupant');
    }

}
