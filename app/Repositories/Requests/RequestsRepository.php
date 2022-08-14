<?php

namespace App\Repositories\Requests;

use App\Http\Resources\Request\RequestCollection;
use App\Models\Assignment;

class RequestsRepository
{
    protected int $paginate = 20;

    public function getAllRequests($request)
    {
        $data = Assignment::query()
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->where('admin_id', '=', auth()->id())
            ->whereIn('state', array('Waiting for returning', 'Completed'))
            ->paginate($this->paginate);

        if ($request->has('sort.id')) {
            $list = new RequestCollection($data);
            $dataCollection = collect($list);

            foreach ($request->query("sort") as $value) {
                if ($value === 'asc') {
                    return [
                        'data' => $dataCollection['data']->sortBy('no')->values()->all(),
                        'meta' => $dataCollection['meta'],
                    ];
                } elseif ($value === 'desc') {
                    return [
                        'data' => $dataCollection['data']->sortByDesc('no')->values()->all(),
                        'meta' => $dataCollection['meta'],
                    ];
                }
            }
        }
        return new RequestCollection($data);
    }
}
