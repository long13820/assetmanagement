<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\User;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }
    /** @test */
    public function test_login_with_valid_credentials()
    {
        User::factory()->create([
            "first_name" => "Phuong",
            "last_name" => "To Duc",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);
        $response = $this->post("api/login", [
            "username" => "phuongtd",
            "password" => "phuongtd@01012000",
        ]);

        $response->assertStatus(200);
    }
    /** @test */
    public function test_login_with_invalid_credentials()
    {
        $response = $this->post("api/login", [
            "username" => "adasdasdasd",
            "password" => "213124123",
        ]);

        $response->assertStatus(400);
    }
    public function test_login_with_wrong_password()
    {
        $response = $this->post("api/login", [
            "username" => "phuongtd",
            "password" => "phnguoas12@1102",
        ]);

        $response->assertStatus(400);
    }
    public function test_login_with_wrong_username()
    {
        $response = $this->post("api/login", [
            "username" => "phuongtoddd",
            "password" => "phuongtd@01012000",
        ]);

        $response->assertStatus(400);
    }

    /** @test */
    public function test_login_without_input()
    {
        $response = $this->post("api/login", [
            "username" => "",
            "password" => "",
        ]);
        $response->assertStatus(422);
    }
}