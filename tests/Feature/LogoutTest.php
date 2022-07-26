<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;

class UserLogoutTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }

    /** @test */
    function logout_without_logged_in()
    {
        $response = $this->json("POST", "api/logout");
        $response->assertStatus(401);
        $response->assertJson(["message" => "Unauthenticated."]);
    }

    /** @test */
    function logout_with_authen()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->post("/api/logout");
        $response->assertStatus(200);
    }
}
