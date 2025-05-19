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
        'fecha',
        'horaIni',
        'horafin',
        'justificacion'      
    ];
}
