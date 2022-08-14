<?php

namespace Tests\Feature;

use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\User;
use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
class AdminViewRequestTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);
      
    }
    public function testAdminViewAllRequests()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);
        $response = $this->json(
            "GET",
            "/api/requests?filter[date]=2022-04-14"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);  
    }

    public function test_admin_can_view_list_request_for_returning_sort_by_id_desc()
    {

        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/requests?sort[id]=desc"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

    public function test_admin_can_view_list_request_for_returning_sort_by_id_asc()
    {

        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/requests?sort[id]=asc"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }

}
