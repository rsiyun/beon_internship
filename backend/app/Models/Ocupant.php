<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ocupant extends Model
{
    use HasFactory;
    protected $table = 'ocupants';
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    protected $casts = [
        'is_married' => 'boolean',
    ];

    public function houseOcupantHistories()
    {
        return $this->hasMany(HouseOcupantHistory::class, 'ocupant_id');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class, 'ocupant_id');
    }
    public function currentHouseOcupantHistory()
    {
        return $this->hasOne(HouseOcupantHistory::class, 'ocupant_id')
            ->where('is_current_resident', true)->with('home');
    }

    protected function IdentityCard(): Attribute
    {
        return Attribute::make(
            get: fn ($image) => $image ? url('/storage/identity-card/'.$image) : null,
        );
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('phone', 'like', '%' . $searchTerm . '%');
    }
}
