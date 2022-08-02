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
            "first_name" => "Phuong",
            "last_name" => "To Duc",
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
            "first_name" => "Loc",
            "last_name" => "Vo Thanh",
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
            "first_name" => "Thuan",
            "last_name" => "Ho Tan",
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
            "first_name" => "Dinh",
            "last_name" => "Hoang Viet",
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
            "first_name" => "Long",
            "last_name" => "Nguyen Hoang",
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
            "first_name" => "Cuong",
            "last_name" => "Le Quoc",
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
            "first_name" => "Y",
            "last_name" => "Huynh Le Thien",
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
            "first_name" => "Trang",
            "last_name" => "Mai Thi Thu",
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
            "first_name" => "Huynh",
            "last_name" => "Nhan Than Trong",
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
