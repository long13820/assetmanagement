<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
class AssetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->seed(LocationSeeder::class);
    }

    /** @test */
    public function test_getListAsset_with_not_login_invalid_credentials()
    {
        //Create asset
        Asset::factory()->create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);

        $response =
            $this->withSession(['foo' => 'bar'])
            ->get('/api/assets');
        $response->assertStatus(500);
    }
    /** @test */
    public function test_getListAsset_with_valid_credentials()
    {
        //Create user
        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);

        // Create Asset
        Asset::factory()->create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);

        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->get('/api/assets');
        $response->assertStatus(200);
    }
    /** @test */
    public function test_showDetailAsset_with_valid_credentials()
    {
        //Create user
        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);

        // Create Asset
        Asset::factory()->create([
            "asset_code" => "LA0001",
            "asset_name" => "Laptop HP Probook 450 G10",
            "installed_date" => "2000-01-01",
            "state" => "Available",
            "specification" => "sfsdfsdfdsfsdsf",
            "category_id" => 1,
            "location_id" => 1,
        ]);
        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->get('/api/assets/1');
        $response->assertStatus(200);
    }

    public function testAssignmentResource(){
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
        $response = $this->actingAs(User::find(1))
        ->withSession(['foo' => 'bar'])
        ->get('/api/assets/1');
    $response->assertStatus(200);
    }
}