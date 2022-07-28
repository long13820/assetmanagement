<?php

namespace App\Http\Requests\Asset;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class EditAssetRequest extends FormRequest
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
     * @return void
     */
    public function rules()
    {
        return [
            "asset_name" => "max:128",
            "installed_date" => "date_format:Y-m-d",
            "state" => "",
            "specification" => "min:5|max:100",
            "category_id" => "",
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
