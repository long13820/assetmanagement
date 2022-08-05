<?php

namespace Tests\Feature;

use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\User;
class CreateCategoryTest extends TestCase
{
   public function setUp(): void
   {
    parent::setUp();
    $this->seed(LocationSeeder::class);
   }

   /** @test */
   public function testCreateCategorySuccessfully()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $category = [
            'category_name' => "Magic Mouse",
            'category_prefix' => "MM",
        ];

        $this->json('POST', '/api/categories', $category)
            ->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJson(['data' => $category]);
    }

    public function test_create_category_fail()
    {
        Sanctum::actingAs(User::factory()->create(), ["*"]);
        $category = [
            'category_name' => "",
            'category_prefix' => "MM",
        ];

        $this->json('POST', '/api/categories', $category)
            ->assertStatus(409);
    }

   /** @test */
   public function test_get_all_categories()
   {
       Sanctum::actingAs(User::factory()->create([
           "first_name" => "To Duc",
           "last_name" => "Phuong",
           "date_of_birth" => "2000-01-01",
           "joined_date" => "2020-01-01",
           "type" => "Staff",
           "location_id" => 1,
       ]));
       $response = $this->json("GET", "/api/categories");
       $response->assertStatus(200);
       $response->assertJson(["status" => "success"]);
           
   }

}
