<?php
namespace App\Http\Controllers\Nomina;

use App\Http\Controllers\Controller;
use App\Models\Nomina\Empleado;
use Illuminate\Http\Request;
use App\Models\Project;


class SelectedEmployedController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
           $ced = $request->query('ced');
           $record = Empleado::select('cedula', 'nombre', 'cargo', 'co')
                    ->distinct()
                    ->where('estado', 'A')
                    ->where('cedula', $ced)
                    ->get();
     
            return response()->json([
                'response' =>  $record
            ]);
    }
}
