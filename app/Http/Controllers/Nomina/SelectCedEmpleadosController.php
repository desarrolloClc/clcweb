<?php
namespace App\Http\Controllers\Nomina;

use App\Http\Controllers\Controller;
use App\Models\Nomina\Empleado;
use Illuminate\Http\Request;
use App\Models\Project;


class SelectCedEmpleadosController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
           $record = Empleado::select('id','cedula')
                   ->distinct()
                   ->where('estado', 'A')
                   ->whereNotNull('cedula')
                   ->get();
     
            return response()->json([
                'response' =>  $record
            ]);
    }
}
