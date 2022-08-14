<?php

namespace Tests\Feature;

use Database\Seeders\LocationSeeder;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\CategorySeeder;

class CreateCategoryTest extends TestCase
{
   public function setUp(): void
   {
    parent::setUp();
    $this->seed(LocationSeeder::class);
    $this->seed(CategorySeeder::class);
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
    Sanctum::actingAs(User::factory()->create(), ["*"]);
    $response = $this->json("GET", "/api/categories");
    $response->assertStatus(200);
    $response->assertJson(["status" => "success"]);
           
   }

}
