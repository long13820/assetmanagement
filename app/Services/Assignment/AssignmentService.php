<?php

namespace App\Services\Assignment;

use App\Http\Requests\Assignment\StoreAssignmentRequest;
use App\Http\Traits\ApiResponse;
use App\Repositories\Assignment\AssignmentRepository;

class AssignmentService
{
    use apiResponse;

    protected AssignmentRepository $assignmentRepository;

    public function __construct(AssignmentRepository $assignmentRepository)
    {
        $this->assignmentRepository = $assignmentRepository;
    }

    public function index($request)
    {
        $result = $this->assignmentRepository->index($request);
        return $this->apiResponse($result, 'success', 'Get All Assignment Success');
    }

    public function store($request)
    {
        $result = $this->assignmentRepository->store($request);
        if ($result['status'] == 201) {
            return response()->json([
                "data" => $result,
            ], 201);
        } elseif ($result['status'] == 400) {
            return response()->json([
                "data" => $result
            ], 400);
        }
        return response()->json([
            "data" => $result
        ], 400);
    }

    public function show($id)
    {
        $result = $this->assignmentRepository->show($id);

        return $this->apiResponse($result, 'success', 'Get Assignment Information Success');
    }
}
