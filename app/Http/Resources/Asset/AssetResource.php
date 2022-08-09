<?php

namespace App\Http\Resources\Asset;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
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
            "id" => $this->id,
            "asset_code" => $this->asset_code,
            'category_id' => $this->category_id,
            'category_name' => $this->category_name,
            "asset_name" => $this->asset_name,
            "specification" => $this->specification,
            "installed_date" => $this->installed_date,
            "state" => $this->state,
        ];
    }
}
