<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LocationSeeder;
use Database\Seeders\CategorySeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\Asset;
use App\Models\Assignment;

class DisableUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }
    public function testDisableUserSuccessfully()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);

        $this->json("DELETE", "/api/users/1")
            ->assertStatus(200);
    }

    public function testDisableUser()
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
        $this->json("DELETE", "/api/users/1")
            ->assertStatus(200);
    }


    public function testDisableUserWithAssignment()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);

        $this->json("PUT", "/api/check_assignment/1")
            ->assertStatus(200);
          ;  
    }

    public function testCannotDisableUser() {
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
        $this->json("PUT", "/api/check_assignment/1")
            ->assertStatus(200);
          ;  
    }

}
