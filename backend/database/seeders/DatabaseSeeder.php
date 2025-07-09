<?php

namespace Database\Seeders;

use App\Models\DuesType;
use App\Models\Home;
use App\Models\HouseOcupantHistory;
use App\Models\Ocupant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password123')
        ]);
        DuesType::factory()->create([
            'type_name' => 'kebersihan',
            'default_amount_per_month' => 80000,
        ]);
        DuesType::factory()->create([
            'type_name' => 'satpam',
            'default_amount_per_month' => 60000,
        ]);
        $home = Home::factory()->create([
            'house_number' => 'A-01',
            'status' => 'occupied',
        ]);
        $ocupant = Ocupant::factory()->create([
            'name' => 'John Doe',
            'phone' => '081234567890',
            'identity_card' => 'sample.jpg',
            'resident_status' => 'permanent',
            'is_married' => true,
        ]);
        HouseOcupantHistory::create([
            'home_id' => $home->id,
            'ocupant_id' => $ocupant->id,
            'start_date' => now(),
            'is_current_resident' => true,
        ]);
    }
}
