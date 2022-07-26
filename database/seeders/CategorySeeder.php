<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Category::query()->create([
            "category_name" => "Laptop",
            "category_prefix" => "LA",
        ]);
        Category::query()->create([
            "category_name" => "Monitor",
            "category_prefix" => "MO"
        ]);
        Category::query()->create([
            "category_name" => "Personal Computer",
            "category_prefix" => "PC"
        ]);
        Category::query()->create([
            "category_name" => "Bluetooth Mouse",
            "category_prefix" => "BM"
        ]);
    }
}
