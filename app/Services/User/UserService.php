<?php

namespace App\Services\User;

use App\Http\Traits\ApiResponse;
use App\Repositories\User\UserRepository;
use Illuminate\Http\JsonResponse;

class UserService
{
    use apiResponse;

    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUser($request): JsonResponse
    {
        $result = $this->userRepository->getAllUser($request);

        return $this->apiResponse($result, 'success', 'Get All User Success');
    }

    public function getUserById($id): JsonResponse
    {
        $result = $this->userRepository->getUserById($id);

        return $this->apiResponse($result, 'success', 'Get User Information Success');
    }

    public function store($request)
    {
        $result = $this->userRepository->store($request);

        if ($result) {
            return $this->apiResponse([], 'success', 'Create User Successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Create User Unsuccessfully');
        }
    }

    public function updateUser($request, $id): JsonResponse
    {
        $result = $this->userRepository->handleUpdateUser($request, $id);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Update User Successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Update User Unsuccessfully');
        }
    }
}
