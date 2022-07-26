<?php

namespace App\Http\Requests\User;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class EditUserRequest extends FormRequest
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
            "date_of_birth" => 'date_format:"Y-m-d"|before:-18 years',
            "joined_date" =>
                'date_format:"Y-m-d"|after:' .
                $available_joined_date .
                ($isWeekend ? "|after:" . $this->joined_date : ""),
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
