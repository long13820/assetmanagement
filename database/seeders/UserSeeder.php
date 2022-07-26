<?php

namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        User::query()->create([
            "staff_code" => "",
            "first_name" => "To Duc",
            "last_name" => "Phuong",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Admin",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "",
            "location_id" => rand(1,3),
        ]);
        User::query()->create([
            "staff_code" => "",
            "first_name" => "Vo Thanh",
            "last_name" => "Loc",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Ho Tan",
            "last_name" => "Thuan",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Admin",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Hoang Viet",
            "last_name" => "Dinh",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Nguyen Hoang",
            "last_name" => "Long",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Le Quoc",
            "last_name" => "Cuong",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Admin",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Huynh Le Thien",
            "last_name" => "Y",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "female",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Mai Thi Thu",
            "last_name" => "Trang",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "female",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);

        User::query()->create([
            "staff_code" => "",
            "first_name" => "Nhan Than Trong",
            "last_name" => "Huynh",
            "full_name" =>"",
            "date_of_birth" => "2000-01-01",
            "gender" => "male",
            "type" => "Staff",
            "joined_date" => "2022-03-01",
            "password" => "",
            "username" => "" ,
            "location_id" => rand(1,3),
        ]);
    }
}
