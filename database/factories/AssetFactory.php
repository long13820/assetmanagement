<?php

namespace Database\Factories;

use App\Models\Asset;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Asset::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {

        $assetName = $this->faker->firstName();
        $specification = $this->faker->lastName();
        return [
            'asset_code' => $this->faker->numerify('SD####'),
            'asset_name' => $assetName,
            'installed_date' => $this->faker->dateTimeBetween(),
            'specification' => $specification,
            'category_id' => rand(1, 4)
        ];
    }
}