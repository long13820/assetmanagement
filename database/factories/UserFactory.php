<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstName = $this->faker->firstName($gender);
        $lastName = $this->faker->lastName();
        $userName = $firstName . $lastName[0] . $this->faker->randomNumber(4, true);
        return [
            'staff_code' => $this->faker->numerify('SD####'),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'date_of_birth' => $this->faker->dateTimeBetween(),
            'gender' => $gender,
            'joined_date' => $this->faker->dateTimeBetween(),
            'password' => '$2y$10$aPfE/Nbwqto0qDdPZW3pUOK.vjtbZGodZYHRH7yiJ.5p/GW.hMFm2',
            'username' => $userName,
            'type' => $this->faker->randomElement(["Staff", "Admin"]),
            'location_id' => rand(1, 3)
        ];
    }
}