<?php

namespace App\Http\Resources\Request;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RequestCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($item, $key) {
                return [
                    "no" => $key + 1,
                    "id" => $item->id,
                    "asset_id" => $item->asset_id,
                    "asset_name" => $item->asset->asset_name,
                    "asset_code" => $item->asset->asset_code,
                    "requested_by" => $item->requested_id !== null ? $item->request->username : null,
                    "accepted_by" => $item->user->username,
                    "assigned_date" => $item->assigned_date,
                    "state" => $item->state,
                    "returned_date" => $item->returned_date,
                ];
            }),
            'meta' => [
                'current_page' => $this->currentPage(),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'per_page' => $this->perPage(),
                'to' => $this->lastItem(),
                'total' => $this->total(),
            ]
        ];
    }
}
