<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
    
    /** @test */
    public function testCreateUser()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $user = [
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "gender" => "Male",
            "joined_date" => "2022-01-05",
            "type" => "Staff",
            "location_id" => 1,
        ];

        $this->json("POST", "/api/users", $user)
            ->assertStatus(200)
            ->assertJson(["status" => true]);
    }
    /** @test */
    public function testUserUnder_18YearsOld()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $user = [
            "first_name" => "VO Thanh",
            "last_name" => "Loc",
            "date_of_birth" => "2022-01-01",
            "gender" => "Male",
            "joined_date" => "2022-04-01",
            "type" => "Staff",
            "location_id" => 1,
        ];

        $this->json("POST", "/api/users", $user)
            ->assertStatus(422);
            
    }
     /** @test */
    public function testRequiredFieldsForCreateAsset()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $user = [
            "first_name" => "",
            "last_name" => "",
            "date_of_birth" => "",
            "gender" => "",
            "joined_date" => "",
            "type" => "",
        ];
        $this->json("POST", "/api/users",$user)
            ->assertStatus(422);
    }
}
