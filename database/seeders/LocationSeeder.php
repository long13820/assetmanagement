<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Location::create([
            "name" => "Ho Chi Minh",
            "location_code" => "HCM",
        ]);
        Location::create([
            "name" => "Ha Noi",
            "location_code" => "HN",
        ]);
        Location::create([
            "name" => "Da Nang",
            "location_code" => "ĐN",
        ]);

    }
}
