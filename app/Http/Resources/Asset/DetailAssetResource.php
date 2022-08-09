<?php

namespace App\Http\Resources\Asset;

use App\Http\Resources\Assignment\HistoryAssignmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailAssetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'asset_code' => $this->asset_code,
            'asset_name' => $this->asset_name,
            'specification' => $this->specification,
            'category_name' => $this->category_name,
            'category_id' => $this->category_id,
            'installed_date' => $this->installed_date,
            'state' => $this->state,
            'name' => $this->name,
            'assignment' => HistoryAssignmentResource::collection($this->assignment),
        ];
    }
}
