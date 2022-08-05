<?php

namespace Tests\Feature;

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
}
