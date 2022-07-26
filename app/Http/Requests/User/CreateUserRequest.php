<?php

namespace App\Http\Requests\User;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
        $available_joined_date = Carbon::parse($this->date_of_birth)
            ->addYears(18)
            ->subDays(1);
        $isWeekend = Carbon::parse($this->joined_date)->isWeekend();
        return [
            "first_name" => "required|max:128",
            "last_name" => 'required|regex:/^[a-zA-Z\s]*$/|max:128',
            "date_of_birth" => 'required|date_format:"Y-m-d"|before:-18 years',
            "gender" => "required",
            "joined_date" =>
                'required|date_format:"Y-m-d"|after:' .
                $available_joined_date .
                ($isWeekend ? "|after:" . $this->joined_date : ""),
            "type" => "required",
            "location_id" => "required"
        ];
    }

    /**
     * Set custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            "required" => ":Attribute is required!",
            "date_of_birth.date_format" => "Invalid date",
            "joined_date.date_format" => "Invalid date",
            "date_of_birth.before:-18 years" => "User must be >= 18 years old",
        ];
    }
}
