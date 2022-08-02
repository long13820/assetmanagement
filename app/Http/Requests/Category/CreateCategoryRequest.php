<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
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
            "category_name" => "required"
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
