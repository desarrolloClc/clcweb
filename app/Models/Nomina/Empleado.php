<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
   protected $connection = 'biometrico';
    protected $table = 'empleados';

       protected $fillable = [
        'nombre',
        'cargo',
        'cedula',
        'co',
        'estado'      
    ];
}
