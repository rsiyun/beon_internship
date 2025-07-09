<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    protected $casts = [
        'payment_date' => 'date',
    ];

    public function ocupant()
    {
        return $this->belongsTo(Ocupant::class, 'ocupant_id');
    }

    public function home()
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function duesType()
    {
        return $this->belongsTo(DuesType::class, 'dues_type_id');
    }
}
