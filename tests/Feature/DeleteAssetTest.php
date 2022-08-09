<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use Tests\TestCase;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
class DeleteAssetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->seed(LocationSeeder::class);
    }


    public function testDeleteAssetSuccessfully()
    {
        Asset::create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);

        $this->json("DELETE", "/api/assets/1")
            ->assertStatus(200)
            ->assertJson(["success" => true]);
            
    }

    public function testDeleteAssetWithAssignment()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);
        Asset::create([
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

        $this->json("DELETE", "/api/assets/1")
            ->assertStatus(400)
            ->assertJson(["success" => false])
            ;    
    }

    public function testCheckAssignment()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);
        
        $this->json("PUT", "/api/check_asset/1")
            ->assertStatus(400)
            ->assertJson(["success" => false])
            ;    
    }

    public function testCheckWithoutAssignment()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);
        Asset::create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);
        $this->json("PUT", "/api/check_asset/1")
            ->assertStatus(200)
            ->assertJson(["success" => true])
            ;    
    }

    public function testCheckAssignmentExist()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);
        Asset::create([
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
        $this->json("PUT", "/api/check_asset/1")
            ->assertStatus(400)
            ->assertJson(["success" => false])
            ;    
    }

   

}
