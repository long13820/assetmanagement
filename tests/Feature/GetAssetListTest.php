<?php

namespace Tests\Feature;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Database\Seeders\AssetSeeder;
use Database\Seeders\CategorySeeder;
use Laravel\Sanctum\Sanctum;

class GetAssetListTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
    }

    public function test_getting_assets_by_filter()
    {
        
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assets?page=1&size=15&location=1&filter[category]=1,2,3"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

    public function test_getting_assets_sort_by_id()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assets?page=1&size=15&filter[state]=1&location=1&sort[id]=asc"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

    public function test_assignments_by_search()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assets?search=Laptop"
        );
        $response->assertStatus(500);
    }
}
