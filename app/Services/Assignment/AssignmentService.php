<?php

namespace App\Services\Assignment;

use App\Http\Requests\Assignment\StoreAssignmentRequest;
use App\Http\Traits\ApiResponse;
use App\Repositories\Assignment\AssignmentRepository;
use Illuminate\Http\JsonResponse;

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

    public function updateAssignment($request, $id): JsonResponse
    {
        $result = $this->assignmentRepository->handleUpdateAssignment($request, $id);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Update Assignment Successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Update Assignment Unsuccessfully');
        }
    }

    public function showById($request)
    {
        $result = $this->assignmentRepository->getAllAssignment($request);

        return $this->apiResponse($result, 'success', 'Get user assignment successfully');
    }

    public function deleteAssignment($request, $id): JsonResponse
    {
        $result = $this->assignmentRepository->deleteAssignment($request, $id);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Deleted Assignment Successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Deleted Assignment Unsuccessfully');
        }
    }

    public function getReturnRequestId($request)
    {
        $result = $this->assignmentRepository->getReturnRequestId($request);

        return $this->apiResponse($result, 'success', 'Get returnId assignment successfully');
    }
}
