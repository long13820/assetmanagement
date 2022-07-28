<?php

namespace App\Repositories\Assignment;

use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;

class AssignmentRepository
{
    protected int $paginate = 20;

    public function index($request)
    {
        $data = Assignment::filter($request)
            ->sort($request)
            ->search($request)
            ->paginate($this->paginate);

        return AssignmentResource::collection($data)->response()->getData();
    }

    public function store($request)
    {
        $assignment = Assignment::create([
            'user_id' => $request->user_id,
            'asset_id' => $request->asset_id,
            'admin_id' => $request->admin_id,
            'assigned_date' => $request->assigned_date,
            'note' => $request->note,
        ]);
        if ($assignment) {
            $result = [
                'message' => 'Created assignment successfully.',
                'status' => 201,
            ];
        } else {
            $result = [
                'message' => 'Failed',
                'status' => 400,
            ];
        }
        return $result;
    }

    public function show($id): AssignmentResource
    {
        $data = Assignment::query()
            ->find($id);

        return AssignmentResource::make($data);
    }
}
