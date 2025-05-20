<?php

namespace App\Http\Controllers\Nomina;

use App\Http\Controllers\Controller;
use App\Models\Nomina\Asistencia;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsistenciaController extends Controller
{
    public function index(Request $request)
    {
        $asistencia = Asistencia::query();

        $totalCount = $asistencia->count();

        //filtros
        if ($request->filled('search')) {
            $search     = $request->search;

            $asistencia->where(
                fn($query) =>
                $query->where('cedula', 'like', "%{$search}%")
                    ->orWhere('fecha', 'like', "%{$search}%")

            );
        }

        # Filtered Count
        $filteredCount = $asistencia->count();

        $perPage = (int) ($request->perPage ?? 10);

        # Fetch All the Records
        if ($perPage === -1) {
            $allrecords = $asistencia->latest()->get()->map(fn($record) => [
                'id'                           => $record->id,
                'cedula'                       => $record->cedula,
                'nombre'                       => $record->nombre,
                'cargo'                        => $record->cargo,
                'co'                           => $record->co,
                'fecha'                        => $record->fecha,
                'horaini'                      => $record->horaini,
                'horafin'                      => $record->horafin,
                'justificacion'                => $record->justificacion
            ]);

            $records = [
                'data'     => $allrecords,
                'total'    => $filteredCount,
                'per_page' => $perPage,
                'from'     => 1,
                'to'       => $filteredCount,
                'links'    => [],
            ];
        } else {
            $records = $asistencia->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();
            $records->getCollection()->transform(fn($record) => [
                'id'                           => $record->id,
                'cedula'                       => $record->cedula,
                'nombre'                       => $record->nombre,
                'cargo'                        => $record->cargo,
                'co'                           => $record->co,
                'fecha'                        => $record->fecha,
                'horaini'                      => $record->horaini,
                'horafin'                      => $record->horafin,
                'justificacion'                => $record->justificacion
            ]);
        }
        //   dd($records);
        return Inertia::render('nomina/entradaSalida/asistencia', [
            'records'      => $records,
            'filters'       => $request->only(['search', 'perPage']),
            'totalCount'    => $totalCount,
            'filteredCount' => $filteredCount,
        ]);
    }

    public function create()
    {
        return Inertia::render('nomina/entradaSalida/create');
    }

    public function store(Request $request)
    {

        $datos =  $request->validate([
            'cedula' => 'required|string',
            'nombre' => 'required|string',
            'cargo' => 'required|string',
            'co' => 'required|string',
            'fecha' => 'required|date',
            'horaini' => 'required|string',
            'horafin' => 'required|string',
            'justificacion' => 'string|nullable',
          
        ], [
            'cedula.required'        => 'La cédula es obligatoria.',
            'nombre.required'        => 'El nombre es obligatorio.',
            'cargo.required'         => 'El cargo es obligatorio.',
            'co.required'            => 'El centro operativo es obligatorio.',
            'fecha.required'         => 'La fecha es obligatoria.',
            'fecha.date'             => 'La fecha no es válida.',
            'horaini.required'       => 'La hora de inicio es obligatoria.',
            'horaini.date_format'    => 'La hora de inicio debe estar en formato HH:MM.',
            'horafin.required'       => 'La hora de finalización es obligatoria.',
            'horafin.date_format'    => 'La hora de finalización debe estar en formato HH:MM.',

        ]);

        Asistencia::create($datos);


        return redirect()->route('asistencia.index')->with('success', 'Registro creado exitosamente.');
    }

    public function edit($id)
    {
        $registro = Asistencia::findOrFail($id);
        return Inertia::render('nomina/entradaSalida/create', [
            'registro' => $registro,
            'isEdit'  => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated =  $request->validate([
            'cedula' => 'required|string',
            'nombre' => 'required|string',
            'cargo' => 'required|string',
            'co' => 'required|string',
            'fecha' => 'required|date',
            'horaini' => 'required|string',
            'horafin' => 'required|string',
            'justificacion' => 'string|nullable',
          
        ], [
            'cedula.required'        => 'La cédula es obligatoria.',
            'nombre.required'        => 'El nombre es obligatorio.',
            'cargo.required'         => 'El cargo es obligatorio.',
            'co.required'            => 'El centro operativo es obligatorio.',
            'fecha.required'         => 'La fecha es obligatoria.',
            'fecha.date'             => 'La fecha no es válida.',
            'horaini.required'       => 'La hora de inicio es obligatoria.',
            // 'horaini.date_format'    => 'La hora de inicio debe estar en formato HH:MM.',
            'horafin.required'       => 'La hora de finalización es obligatoria.',
            // 'horafin.date_format'    => 'La hora de finalización debe estar en formato HH:MM.',

        ]);
        $asistencia = Asistencia::findOrFail($id);
        $asistencia->update($validated);
         return redirect()->route('asistencia.index')->with('success', 'se actualizo correctamente.');
     
      
    }

    public function destroy($id){
        $asistencia = Asistencia::findOrFail($id);
        $asistencia->delete();
        return redirect()->route('asistencia.index')->with('success', 'se elimino correctamente.');
    }
}
