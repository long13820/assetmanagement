<?php

namespace App\Services\Requests;

use App\Http\Traits\ApiResponse;
use App\Repositories\Requests\RequestsRepository;
use Illuminate\Http\JsonResponse;

class RequestsService
{
    use ApiResponse;

    protected RequestsRepository $requestsRepository;

    public function __construct(RequestsRepository $requestsRepository)
    {
        $this->requestsRepository = $requestsRepository;
    }

    public function getAllRequests($request): JsonResponse
    {
        $result = $this->requestsRepository->getAllRequests($request);

        return $this->apiResponse($result, 'success', 'Get All Requests Success');
    }
}
