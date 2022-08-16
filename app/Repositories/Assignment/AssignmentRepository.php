<?php

namespace App\Repositories\Assignment;

use App\Http\Resources\Assignment\AssignmentCollection;
use App\Http\Resources\Assignment\AssignmentResource;
use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AssignmentRepository
{
    protected int $paginate = 18;

    public function index($request)
    {
        $data = Assignment::query()
            ->join('user', 'admin_id', '=', 'user.id')
            ->where('user.location_id', '=', auth()->user()->location_id)
            ->select(DB::raw('ROW_NUMBER() OVER(ORDER BY assignment.assigned_date DESC) AS Row, assignment.*'))
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->where('state', '!=', 'Completed')
            ->paginate($this->paginate);

        return new AssignmentCollection($data);
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

    public function show($id)
    {
        $data = Assignment::query()
            ->find($id);
        return AssignmentResource::make($data);
    }

    public function handleUpdateAssignment($request, $id)
    {
        $assignment = Assignment::query()->where('id', '=', $id)->first();
        if ($request->state !== 'Accepted') {
            $assignment->update($request->all());
        } else {
            if ($assignment->user_id === auth()->user()->id) {
                $assignment->update($request->all());
            } else {
                $assignment = [];
            }
        }
        return $assignment;
    }

    public function getAllAssignment($request)
    {
        $data = Assignment::query()
            ->join('asset', 'asset.id', '=', 'assignment.asset_id')
            ->join('categories', 'asset.category_id', '=', 'categories.id')
            ->select("assignment.*", "categories.category_name")
            ->sort($request)
            ->filter($request)
            ->where([
                ["user_id", "=", auth()->user()->id],
                ["assigned_date", '<=', Carbon::now('Asia/Ho_Chi_Minh')->toDateString()]
            ])
            ->whereIn(
                'assignment.state',
                array("Waiting for acceptance", "Accepted", "Waiting for returning", "Completed")
            )
            ->paginate($this->paginate);

        return AssignmentResource::collection($data)->response()->getData();
    }

    public function getReturnRequestId($idAdmin)
    {
        $data = Assignment::query()
            ->where('assignment.admin_id', $idAdmin)
            ->whereNotNull('assignment.returned_id')
            ->orderBy('assignment.returned_id', 'desc')
            ->first();
        return $data;
    }

    public function deleteAssignment($request, $id)
    {
        $assignment = Assignment::query()->where('id', '=', $id)->first();
        $assignment->delete($request->all());
        return $assignment;
    }
}
