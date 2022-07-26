<?php

namespace App\Services\Auth;

use App\Http\Traits\ApiResponse;
use App\Repositories\Auth\AuthRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthService
{
    use ApiResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function login($data)
    {
        $result = $this->authRepository->login($data);
        if ($result['status'] == 200) {
            return response()->json([
                "data" => $result,
            ], 200);
        } elseif ($result['status'] == 403) {
            return response()->json([
                "data" => $result
            ], 403);
        }
        return response()->json([
            "data" => $result
        ], 400);
    }

    public function changePassword($data): JsonResponse
    {
        $result = $this->authRepository->changePassword($data);

        if ($result['status'] == 200) {
            return $this->apiResponse([], 'success', $result['message'], $result['status']);
        } elseif ($result['status'] == 403) {
            return $this->apiResponse([], 'fail', $result['message'], $result['status']);
        }

        return $this->apiResponse([], 'fail', $result['message'], $result['status']);
    }

    public function logout(Request $request): JsonResponse
    {
        $result = $this->authRepository->logout($request);

        if ($result['status'] === 200) {
            return $this->apiResponse([], 'success', $result['message'], $result['status']);
        }

        return $this->apiResponse([], 'fail', 'Logout unsuccessfully', 400);
    }

    public function getMe(): JsonResponse
    {
        $result = $this->authRepository->getMe();

        return $this->apiResponse($result, 'success', 'Get Information Successfully');
    }
}
