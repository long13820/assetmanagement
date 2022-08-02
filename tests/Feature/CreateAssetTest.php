<?php

namespace Tests\Feature;

use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\CategorySeeder;

class CreateAssetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }
    public function testCreateAssetSuccessfully()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $assets = [
            "asset_name" => "New asset",
            "category_id" => 1,
            "specification" => "This is a specification",
            "installed_date" => "2022-03-26",
            "state" => "Available",
            "location_id" => 1,
        ];

        $this->json("POST", "/api/assets", $assets)
            ->assertStatus(200)
            ->assertJson(["success" => true]);
    }

    public function test_get_category_by_id()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "/api/assets/1");
        $response->assertStatus(200);
    }
}