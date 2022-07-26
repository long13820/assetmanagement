<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\EditUserRequest;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\User\CreateUserRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return $this->userService->getAllUser($request);
    }

    public function create()
    {
        //
    }

    public function store(CreateUserRequest $request)
    {
        $validated = $request->validated();
        return $this->userService->store($validated);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        return $this->userService->getUserById($id);
    }

    public function edit($id)
    {
        //
    }

    public function update(EditUserRequest $request, $id): JsonResponse
    {
        return $this->userService->updateUser($request, $id);
    }

    public function destroy($id)
    {
        //
    }
}
