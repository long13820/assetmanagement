<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Category;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Asset::create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G1",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => rand(1, 3),
        ]);
        Asset::create([
            "asset_code" => "LA0002",
            "asset_name" => "Laptop HP Probook 450 G2",
            "installed_date" => "2000-01-01",
            "state" => "Not Available",
            "specification" => "sfsdfsdfdsfsdsfsdfs",
            "category_id" => rand(1, 3),
        ]);

        Asset::create([
            "asset_code" => "",
            "asset_name" => "Monitor Dell Ultrasharp",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsfsdfs",
            "category_id" => rand(1, 3),
        ]);

        Asset::create([
            "asset_code" => "",
            "asset_name" => "Monitor Dell Ultrasharp 1",
            "installed_date" => "2000-01-01",
            "state" => "Not Available",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);

        Asset::create([
            "asset_code" => "",
            "asset_name" => "Personal Computer",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);

        Asset::create([
            "asset_code" => "",
            "asset_name" => "Personal Computer 2",
            "installed_date" => "2000-01-01",
            "state" => "Not Available",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);
        Asset::create([
            "asset_code" => "",
            "asset_name" => "Personal Computer 1",
            "installed_date" => "2000-01-01",
            "state" => "Waiting for recycling",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);
        Asset::create([
            "asset_code" => "",
            "asset_name" => "Personal Computer 2",
            "installed_date" => "2000-01-01",
            "state" => "Recycled",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);
        Asset::create([
            "asset_code" => "",
            "asset_name" => "Personal Computer 3",
            "installed_date" => "2000-01-01",
            "state" => "Assigned",
            "specification" => "sfsdfsdfdsfsdsfsdfssdf",
            "category_id" => rand(1, 3),
        ]);
    }
}
