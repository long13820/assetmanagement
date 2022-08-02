<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EditUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
    
    /** @test */
    public function testEditUser()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $user = [
            "date_of_birth" => "1999-01-02",
            "gender" => "Female",
            "type" => "Admin",
            "location_id" => "1",
        ];
        $this->json("PUT", "/api/users/1", $user)
            ->assertStatus(200);
            
    }

        public function testUserUnder18YearsOld()
        {
            Sanctum::actingAs(User::factory()->create(), ["*"]);
            $user = [
                "date_of_birth" => "2020-01-02 00:00:00",
                "gender" => "Female",
                "is_admin" => 0,
                "joined_date" => "2022-01-01 00:00:00",
            ];

            $this->json("PUT", "/api/users/1", $user)
                ->assertStatus(422);
        }
   
}
