<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assignment\StoreAssignmentRequest;
use App\Services\Assignment\AssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    protected AssignmentService $assignmentService;

    public function __construct(AssignmentService $assignmentService)
    {
        $this->assignmentService = $assignmentService;
    }
    public function index(Request $request)
    {
        return $this->assignmentService->index($request);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return void
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreAssignmentRequest $request
     * @return JsonResponse
     */
    public function store(StoreAssignmentRequest $request): JsonResponse
    {
        return $this->assignmentService->store($request);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        return $this->assignmentService->show($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return void
     */
    public function edit(int $id): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return void
     */
    public function update(Request $request, int $id): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return void
     */
    public function destroy($id): void
    {
        //
    }
}
