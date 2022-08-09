<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AssetSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\Asset;
use App\Models\Assignment;

class GetAssignmentByIdTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }

     /** @test */
    public function getAssignmentById()
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
        Assignment::create([
            "user_id" => 1,
            "asset_id" => 1,
            "admin_id" => 1,
            "assigned_date" => "2022-01-01",
        ]);
        $response = $this->json("GET", "/api/assignments/1");
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
    }

    public function test_getting_assignments_sort_by_asset_code()
    {
        
        Asset::factory()->create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);

        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "api/assignmentsById?size=15&sort[asset_code]=desc");
        $response->assertStatus(200);
        $response->assertJsonStructure(
            [
                "data"
            ]
        );
    }
}
