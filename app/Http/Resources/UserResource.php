<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $arrayData = [
            "id" => $this->id,
            "staff_code" => $this->staff_code,
            "first_name" => $this->first_name,
            "last_name" => $this->last_name,
            "full_name" => $this->full_name,
            "username" => $this->username,
            "date_of_birth" => $this->date_of_birth,
            "gender" => $this->gender,
            "joined_date" => $this->joined_date,
            "type" => $this->type,
            "user_location" => $this->userLocation,
        ];

        if ($request->route()->uri() === 'api/users/{user}') {
            $arrayData['gender'] = $this->gender;
            $arrayData['date_of_birth'] = $this->date_of_birth;
            $arrayData['location_name'] = $this->name;
        }

        return $arrayData;
    }
}
