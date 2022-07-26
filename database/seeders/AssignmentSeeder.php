<?php

namespace Database\Seeders;

use App\Models\Assignment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Assignment::query()->create([
            'user_id'=> 1,
            'admin_id'=> 6,
            'asset_id'=> 1,
            'assigned_date' => "2022-03-01",
            'state' => "Accepted",
        ]);

        Assignment::query()->create([
            'user_id'=> 3,
            'admin_id'=> 6,
            'asset_id'=> 5,
            'assigned_date' => "2022-03-05",
            'state' => "Waiting for acceptance",
        ]);
    }
}
