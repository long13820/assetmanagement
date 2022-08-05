<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Database\Seeders\CategorySeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EditAssetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }

    public function testUpdateAssetSuccessfully()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        Asset::factory()->create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);
        $assets = [
            "asset_name" => "New asset",

        ];
        $response =  $this->json("PUT", "/api/assets/1", $assets);
        $response->assertStatus(200);
    }

    public function test_get_asset_by_id()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "/api/assets/1");
        $response->assertStatus(200);
    }

    
}
