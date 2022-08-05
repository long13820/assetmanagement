<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "returned_id" => $this->returned_id,
            "asset_name" => $this->asset->asset_name,
            "asset_code" => $this->asset->asset_code,
            "requested_by" => $this->user->username,
            "accepted_by" => $this->admin->username,
            "assigned_date" => $this->assigned_date,
            "state" => $this->state,
            "returned_date" => $this->returned_date,
        ];
    }
}
