<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\User;
use Database\Seeders\AssetSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;


class CreateAssignmentTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);

        $admin = User::factory()->create(['type' => "Admin"]);
        Sanctum::actingAs($admin);
        User::factory()->create();
        Asset::factory()->create(
            [
                "asset_code" => "LA0001",
                "asset_name" => "Laptop HP Probook 450 G1",
                "installed_date" => "2000-01-01",
                "state" => "Available",
                "specification" => "sfsdfsdfdsfsdsf",
                "category_id" => rand(1, 3),
                "location_id" => 1,
            ]
        );
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_CreateAssignment_without_validation()
    {
        $response = $this->post("api/assignments", [
            "user_id" => "",
            "asset_id" => "",
            "admin_id" => "",
            "assigned_date" => "",
            "note" => "",
            "state" => "",
        ]);

        $response->assertStatus(422);
        $response->assertJson(["messages" => "Oops... Validate Request"]);
    }
    public function test_CreateAssignment_Successfully()
    {
        $response = $this->post("api/assignments", [
            "user_id" => 1,
            "asset_id" => 1,
            "admin_id" => 1,
            "assigned_date" => "2022-10-10",
            "note" => "do something",
            "state" => "",
        ]);
        $response->assertStatus(201);
        $response->assertJson(["data" => [
            'message' => 'Created assignment successfully.',
            'status' => 201,
        ]]);
    }
    public function test_CreateAssignment_with_previous_AssignedDate()
    {
        $response = $this->post("api/assignments", [
            "user_id" => 1,
            "asset_id" => 1,
            "admin_id" => 1,
            "assigned_date" => "2022-01-01",
            "note" => "do something",
            "state" => "",
        ]);
        $response->assertStatus(422);
    }
}