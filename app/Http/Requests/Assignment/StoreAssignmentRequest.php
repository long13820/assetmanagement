<?php

namespace App\Http\Requests\Assignment;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class StoreAssignmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'user_id' => 'required',
            'asset_id' => 'required',
            'assigned_date' => 'required|after_or_equal:' . Carbon::now()->toDateString(),
            'admin_id' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'User ID is required',
            'asset_id.required' => 'Asset ID is required',
            'assigned_date.required' => 'Assigned date is required',
            'admin_id.required' => 'admin id is required',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = (new ValidationException($validator))->errors();
        throw new HttpResponseException(response()->json(
            [
                'error' => $errors,
                'status_code' => 422,
                'messages' => 'Oops... Validate Request',
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY
        ));
    }
}
