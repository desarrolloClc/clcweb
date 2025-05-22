<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    protected $connection = 'biometrico';
    protected $table = 'control_asistencia';

       protected $fillable = [
        'cedula',
        'nombre',
        'cargo',
        'co',
        'fechaIn',
        'fechaSal',
        'horaini',
        'horafin',
        'justificacion',
        'Reduccion_HJL',
        'tiempo_break'      
    ];
}
