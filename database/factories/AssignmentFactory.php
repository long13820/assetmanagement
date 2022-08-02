<?php

namespace Database\Factories;

use App\Models\Assignment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AssignmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Assignment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id'=> rand(1, 3),
            'admin_id'=> rand(2, 6),
            'asset_id'=> rand(1, 3),
            'assigned_date' => $this->faker->dateTimeBetween(),
            'state' => $this->faker->randomElement(["Accepted", "Waiting for acceptance"]),
            'note' => $this->faker->randomAscii(10),
        ];
    }
}
