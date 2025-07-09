<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DuesType extends Model
{
    use HasFactory;

    protected $table = 'dues_types';
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'dues_type_id');
    }
}
