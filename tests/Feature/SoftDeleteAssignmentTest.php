<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\User;
use Carbon\Factory;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SoftDeleteAssignmentTest extends TestCase
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
        Assignment::factory()->create(
            [
                "user_id" => 1,
            "asset_id" => 1,
            "admin_id" => 1,
            "assigned_date" => "2022-10-10",
            "note" => "do something",
            "state" => "Accepted",
            ]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_Delete_Assignment_Successfully()
    {
        $response= $this->delete("api/assignments/1");
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Deleted Assignment Successfully',
            'status' => 'success',
        ]);
    }
}
