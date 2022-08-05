<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LocationSeeder;
use Database\Seeders\CategorySeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DisableUserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
    public function testDisableUserSuccessfully()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);

        $this->json("DELETE", "/api/users/1")
            ->assertStatus(200);
    }

    public function testDisableUserWithAssignment()
    {
        Sanctum::actingAs(User::factory()->create(["type" => "Admin"]), ["*"]);

        $this->json("PUT", "/api/check_assignment/1")
            ->assertStatus(200);
          ;  
    }

}
