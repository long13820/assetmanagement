<?php

namespace App\Repositories\User;

use App\Http\Resources\UserResource;
use App\Models\User;

class UserRepository
{
    protected int $paginate = 20;

    public function getAllUser($request)
    {
        $data = User::query()
            ->select(
                "id",
                "user.staff_code",
                "user.type",
                "user.last_name",
                "user.first_name",
                "user.full_name",
                "user.username",
                "user.joined_date"
            )
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->where("id", "!=", auth()->id())
            ->where("location_id", "=", auth()->user()->location_id)
            ->paginate($this->paginate);

        return UserResource::collection($data)->response()->getData();
    }

    public function userProfile($request)
    {
        return $request->user();
    }

    public function store($request)
    {
        $request['full_name'] = "";
        $request['staff_code'] = "";
        $request['username'] = "";
        $request["password"] = "";
        $user = User::create($request);
        return User::find($user["id"]);
    }

    public function getUserById($id): UserResource
    {
        $data = User::query()
            ->find($id);

        return UserResource::make($data);
    }

    public function handleUpdateUser($request, $id)
    {
        $user = User::query()->where('id', '=', $id)->first();
        $user->update($request->all());
        return $user;
    }
}
