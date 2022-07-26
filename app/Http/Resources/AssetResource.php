<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class AssetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable
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
