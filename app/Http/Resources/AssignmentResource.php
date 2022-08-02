<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "asset_code" => $this->asset->asset_code,
            "asset_name" => $this->asset->asset_name,
            "specification" => $this->asset->specification,
            "assigned_to" => $this->user->username,
            "assigned_by" => $this->admin->username,
            "assigned_date" => $this->assigned_date,
            "state" => $this->state,
            "note" => $this->note,
        ];
    }
}
