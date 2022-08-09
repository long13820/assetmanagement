<?php

namespace App\Http\Resources\Assignment;

use Illuminate\Http\Resources\Json\JsonResource;

class HistoryAssignmentResource extends JsonResource
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
            'assigned_to' => $this->user->username,
            'assigned_by' => $this->admin->username,
            'assigned_date' => $this->assigned_date,
            'returned_date' => $this->returned_date,
            'state' => $this->state,
        ];
    }
}
