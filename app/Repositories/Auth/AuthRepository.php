<?php

namespace App\Repositories\Auth;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthRepository
{
    public function login($request)
    {
        $user = User::query()->where('username', $request->username)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('asset_management_system')->plainTextToken;
                $data = [
                    'token' => $token,
                    'message' => "Login successfully",
                    'status' => 200
                ];
            } else {
                $data = [
                    'message' => "Wrong password",
                    'status' => 403
                ];
            }
        } else {
            $data = [
                'message' => "Username dose not exist",
                'status' => 400
            ];
        }

        return $data;
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logout successfully',
            'status' => 200,
        ];
    }

    public function changePassword($data)
    {
        $userId = auth()->user()->id;

        if ($userId) {
            $user = User::query()->where('id', $userId)->first();
            if (Hash::check($data->old_password, $user->password)) {
                User::query()->where('id', $userId)->update([
                    'password' => Hash::make($data->new_password),
                    'password_change_at' => Carbon::now('Asia/Ho_Chi_Minh')->toDateTimeString(),
                ]);
                $result = [
                    'message' => 'Change password successfully',
                    'status' => 200,
                ];
            } else {
                $result = [
                    'message' => "Old password not correct",
                    'status' => 403,
                ];
            }
        } else {
            $result = [
                'message' => 'User does not exist',
                'status' => 400,
            ];
        }

        return $result;
    }

    public function getMe(): ?Authenticatable
    {
        return Auth::user();
    }
}
