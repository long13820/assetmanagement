<?php

namespace Tests\Feature;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;

class GetUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
 
    /** @test */
    public function test_get_user_by_id()
    {
        Sanctum::actingAs(User::factory()->create([
        "full_name" => "",
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]));
        $response = $this->json("GET", "/api/users/1");
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
            
    }
    /** @test */
    public function test_get_user_profile()
    {
        Sanctum::actingAs(User::factory()->create([
        "full_name" => "",
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]));
        $response = $this->json("GET", "/api/me");
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
            
    }

    /** @test */
    public function test_get_all_users()
    {
        Sanctum::actingAs(User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]));
        $response = $this->json("GET", "/api/users");
        $response->assertStatus(200);
        $response->assertJson(["status" => "success"]);
            
    }

    /** @test */
    public function test_getting_users_by_sort()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json(
            "GET",
            "/api/users?&page=1&sort[first_name]=desc&filter[type]=Admin"
        );
        $response->assertStatus(200);
        $response->assertJsonStructure(["data"]);
    }
}
