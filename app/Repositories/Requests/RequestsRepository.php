<?php

namespace App\Repositories\Requests;

use App\Http\Resources\RequestResource;
use App\Models\Assignment;

class RequestsRepository
{
    protected int $paginate = 20;

    public function getAllRequests($request)
    {
        $data = Assignment::query()
            ->where('admin_id', '=', auth()->id())
            ->where('state', '=', 'Waiting for returning')
            ->orWhere('state', '=', 'Completed')
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->paginate($this->paginate);

        return RequestResource::collection($data)->response()->getData();
    }
}
