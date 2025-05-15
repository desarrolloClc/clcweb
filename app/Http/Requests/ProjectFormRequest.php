<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
           'name'=>'required|string|max:255',
           'framework'=>'required|string'
        ];
    }

    public function messages(): array
    {
        return [
           'name.required'=>'Digite un nombre',
           'name.max'=>'El nombre debe tener maximo 255 caracteres',
           'framework.required'=>'Seleccione un framework'
        ];
    }
}
