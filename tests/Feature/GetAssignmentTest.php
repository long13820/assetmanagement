<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\User;
use Database\Seeders\AssetSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GetAssignmentTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_assignment_by_id()
    {
        $admin = User::factory()->create(['type' => "Admin"]);
        Sanctum::actingAs($admin);

        $user = User::factory()->create();
        $asset = Asset::factory()->create(
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

        $assignment = Assignment::factory()->create([
            'admin_id' => $admin->id,
            'user_id' => $user->id,
            'asset_id' => $asset->id,
        ]);

        $response = $this->get(route('assignments.show', $assignment->id));
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);
    }
}