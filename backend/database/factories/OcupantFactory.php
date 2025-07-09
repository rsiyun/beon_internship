<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ocupant>
 */
class OcupantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'identity_card' => fake()->url(),
            'phone' => fake()->phoneNumber(),
            'resident_status' => fake()->randomElement(['contract', 'permanent']),
            'is_married' => fake()->boolean(),
        ];
    }
}
