<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\User;
use Database\Seeders\AssetSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GetAssignmentsTest extends TestCase
{

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
        $this->seed(CategorySeeder::class);

        $admin = User::factory()->create(['type'=>"Admin"]);
        Sanctum::actingAs($admin);
    }
    /** @test */
    public function test_can_get_assignments()
    {
        
        $response = $this->get(route('assignments.index'));
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);
       
    }

    public function test_can_get_assignments_view()
    {
        
        $response = $this->get(route('assignments.index'));
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);
       
    }

    public function test_can_get_assignments_sort()
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

        $response = $this->json(
            "GET",
            "api/assignments?sort[id]=asc&sort[created_at]=desc"
        );
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);  
       
    }


    public function test_can_get_assignments_with_filter()
    {
        $response = $this->json(
            "GET",
            "/api/assignments?&filter[state]=&filter[assigned_date]=&filter[asset_id]="
        );
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);
    }

    public function test_can_get_assignments_with_filter_returned_dated()
    {
        $response = $this->json(
            "GET",
            "/api/assignments?&filter[state]=&filter[returned_date]=&filter[asset_id]="
        );
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
        $response->assertJsonStructure(["status", "data"]);
    }

    public function test_can_get_assignments_with_sort()
    {
        $sortBy = [
            'asset_code' => "&sort[asset_code]",
            'assigned_to' => "&sort[assigned_to]",
            'assigned_by' => "&sort[assigned_by]",
            'assigned_date' => "&sort[assigned_date]",
        ];

        foreach ($sortBy as $sortCase){
            $response = $this->json(
                "GET",
                "/api/assignments?".$sortCase
            );
            $response->assertStatus(200);
            $response->assertJson(["status" => "success"]);
            $response->assertJsonStructure(["status", "data"]);
        }
    }
    public function test_getting_assignments_by_search()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assignments?size=5&search[assignedTo]=adminhm"
        );
        $response->assertStatus(500);
    }

    public function test_assignments_by_search_assetName()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assignments?search=Laptop"
        );
        $response->assertStatus(500);
    }

    public function test_assignments_by_search_username()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/assignments?search=phuongtd"
        );
        $response->assertStatus(500);
    }

    public function test_getting_assignments_sort_by_id_asc()
    {
       
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "/api/assignments?&sort[id]=asc");
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
        
    }

    public function test_getting_assignments_sort_by_id_desc()
    {
       
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "/api/assignments?&sort[id]=desc");
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }


}
