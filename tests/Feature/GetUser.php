<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;

class GetUser extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
    /** @test */
    public function test_get_user_by_id()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $response = $this->json("GET", "/api/users");
        $response->assertStatus(200);
        $response->assertJson(["success" => true]);
        $response->assertJsonStructure(["success", "data"]);
    }
}
