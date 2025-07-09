<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    protected $primaryKey = 'id';
    protected $guarded = ["id"];

    protected $casts = [
        'expense_date' => 'date',
    ];

    public function home()
    {
        return $this->belongsTo(Home::class, 'home_id');
    }
    public function ocupant()
    {
        return $this->belongsTo(Ocupant::class, 'ocupant_id');
    }
}
