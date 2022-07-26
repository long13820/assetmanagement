<?php

namespace App\Http\Requests\Asset;

use Illuminate\Foundation\Http\FormRequest;

class CreateAssetRequest extends FormRequest
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
            "asset_name" => "required|max:128",
            "installed_date" =>
                'required|date_format:"Y-m-d"',
            "state" => "required",
            "specification" => "required|string|min:5|max:100",
            "category_id" => "required",
        ];
    }

    /**"
     * Set custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            "required" => ":Attribute is required!",
        ];
    }
}
