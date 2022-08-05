<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GetAssetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);

        $admin = User::factory()->create(['type'=>"Admin"]);
        Sanctum::actingAs($admin);
    }

    public function test_getting_assets_sort_by_asset_name()
    {
       
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assets?page=1&size=15&filter[state]=1&location=1&sort[asset_name]=asc"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

    public function test_getting_assets_filter_category()
    {
       
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assets?page=1&size=15&filter[category]=Laptop"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

    
}
