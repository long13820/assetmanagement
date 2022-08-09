<?php

namespace App\Http\Resources\Assignment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            "id" => $this->id,
            "asset_id" => $this->asset_id,
            "user_id" => $this->user_id,
            "full_name" => $this->user->full_name,
            "asset_code" => $this->asset->asset_code,
            "asset_name" => $this->asset->asset_name,
            "specification" => $this->asset->specification,
            "assigned_to" => $this->user->username,
            "assigned_by" => $this->admin->username,
            "assigned_by_id" => $this->admin->id,
            "assigned_date" => $this->assigned_date,
            "category_name" => $this->category_name,
            "returned_date" => $this->returned_date,
            "returned_id" => $this->returned_id,
            "state" => $this->state,
            "note" => $this->note,
        ];
    }
}
