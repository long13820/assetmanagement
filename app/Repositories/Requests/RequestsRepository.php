<?php

namespace App\Repositories\Requests;

use App\Http\Resources\Request\RequestCollection;
use App\Models\Assignment;
use Illuminate\Support\Facades\DB;

class RequestsRepository
{
    protected int $paginate = 20;

    public function getAllRequests($request)
    {
        $data = Assignment::query()
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->where('admin_id', '=', auth()->user()->id)
            ->whereIn('state', array('Waiting for returning', 'Completed'))
            ->select(DB::raw('ROW_NUMBER() OVER(ORDER BY assignment.updated_at DESC) AS Row, assignment.*'))
            ->paginate($this->paginate);

        return new RequestCollection($data);
    }
}
