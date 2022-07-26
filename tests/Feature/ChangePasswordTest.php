<?php

namespace Tests\Feature;


use App\Models\User;
use Database\Seeders\LocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChangePasswordTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->seed(LocationSeeder::class);
    }


    /** @test*/
    public function test_change_password_with_valid_credentials()
    {

        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);
        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->put('api/change_password', [
                'old_password' => 'phuongtd@01012000',
                'new_password' => 'Phuong31!20001',
            ]);

        $response->assertStatus(200);
    }
    /** @test*/
    public function test_change_password_with_not_login()
    {
        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);
        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->put('api/change_password', [
                'old_password' => 'phuongtd@01012000',
                'new_password' => 'Phuong31!20001',
            ]);

        $response->assertStatus(200);
    }

    // /** @test*/
    public function test_change_password_with_old_password_invalid_credentials()
    {
        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);
        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->put('api/change_password', [
                'old_password' => 'phuongtd@',
                'new_password' => 'A@bcdefgh318469',
            ]);

        $response->assertStatus(403);
    }
    // /** @test*/
    public function test_change_password_with_new_password_invalid_credentials()
    {
        User::factory()->create([
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "date_of_birth" => "2000-01-01",
            "joined_date" => "2020-01-01",
            "type" => "Staff",
            "location_id" => 1,
        ]);
        $response = $this->actingAs(User::find(1))
            ->withSession(['foo' => 'bar'])
            ->put('api/change_password', [
                'old_password' => 'phuongtd@01012000',
                'new_password' => 'abcdefgh318469',
            ]);

        $response->assertStatus(422);
    }
}