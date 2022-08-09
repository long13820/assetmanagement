<?php

namespace App\Http\Resources\Assignment;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AssignmentCollection extends ResourceCollection
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
                    'no' => $key + 1,
                    "id" => $item->id,
                    "asset_id" => $item->asset_id,
                    "asset_code" => $item->asset->asset_code,
                    "asset_name" => $item->asset->asset_name,
                    "specification" => $item->asset->specification,
                    "assigned_to" => $item->user->username,
                    "assigned_by" => $item->admin->username,
                    "assigned_by_id" => $item->admin->id,
                    "assigned_date" => $item->assigned_date,
                    "category_name" => $item->category_name,
                    "returned_date" => $item->returned_date,
                    "returned_id" => $item->returned_id,
                    "state" => $item->state,
                    "note" => $item->note,
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
