<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateRequestUserForReturningAssetTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
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
    public function test_CreateRequestUserForReturningAsset_without_validation()
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

        Assignment::factory()->create([
            'admin_id' => $admin->id,
            'user_id' => $user->id,
            'asset_id' => $asset->id,
            'state' => "Waiting for acceptance",
            'note' => "aaa",
        ]);

        $response = $this->put("api/assignments/10", [
            "state" => "Waiting for returning 1",
        ]);
        $response->assertStatus(500);
    }
    public function test_CreateRequestUserForReturningAsset_Successfully()
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

        Assignment::factory()->create([
            'admin_id' => $admin->id,
            'user_id' => $user->id,
            'asset_id' => $asset->id,
            'state' => "Accepted",
            'note' => "aaa",
        ]);

        $response = $this->put("api/assignments/1", [
            "state" => "Waiting for returning",
        ]);
        $response->assertStatus(200);
    }

    public function test_getReturnRequestId_Successfully()
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

        Assignment::factory()->create([
            'admin_id' => $admin->id,
            'user_id' => $user->id,
            'asset_id' => $asset->id,
            'state' => "Accepted",
            'note' => "aaa",
        ]);

        $response = $this->get("api/showReturnRequestId/" . $admin->id);
        $response->assertStatus(200);
    }
}
