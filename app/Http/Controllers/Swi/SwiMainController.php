<?php

namespace App\Http\Controllers\Swi;

use App\Http\Controllers\Controller;
use App\Models\Swin\SwiMain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SwiMainController extends Controller
{
   public function index(Request $request)
   {
      // $records = SwiMain::all();

      ////////////////////////////////
      $swiContent = SwiMain::query();


      # Capturing the total count before applying filters
      $totalCount = $swiContent->count();

      if ($request->filled('search')) {
         $search     = $request->search;
         $searchyear = $request->searchyear;
         $searchmesSui = $request->searchmesSui;

         $swiContent->where(
            fn($query) =>
            $query->where('ano', '=', "$searchyear")
               ->where('mes', 'like', "%{$searchmesSui}%")
               ->where(function ($query) use ($search) {
                  $query->where('nomb_dep', 'like', "%{$search}%")
                     ->orWhere('nomb_empresa', 'like', "%{$search}%");
               })
         );
      } elseif ($request->filled('searchyear')) {
         $searchyear = $request->searchyear;

         $swiContent->where(
            fn($query) =>
            $query->where('ano', '=', "$searchyear")


         );
      } elseif ($request->filled('searchmesSui') && $request->filled('searchyearMes')) {
         $searchmesSui = $request->searchmesSui;
         $searchyearMes   = $request->searchyearMes;

         $swiContent->where(
            fn($query) =>
            $query->where('mes', '=', "$searchmesSui")
               ->where('ano', '=', "$searchyearMes")
         );
      } else {
         $swiContent->where(
            fn($query) =>
            $query->where('ano', '=', "2025")
         );
      }

      # Filtered Count
      $filteredCount = $swiContent->count();

      $perPage = (int) ($request->perPage ?? 10);

      
      # Fetch All the Records
      if ($perPage === -1) {     
         $allrecords = $swiContent->latest()->get()->map(fn($record) => [
            'id'                           => $record->id,
            'mes'                           => $record->mes,
            'ano'                           => $record->ano,
            'cod_empresa'                   => $record->cod_empresa,
            'nomb_empresa'                  => $record->nomb_empresa,
            'cod_dep'                       => $record->cod_dep,
            'nomb_dep'                      => $record->nomb_dep,
            'cod_municipio'                 => $record->cod_municipio,
            'nomb_municipio'                => $record->nomb_municipio,
            'grupo'                         => $record->grupo,
            'zona'                          => $record->zona,
            'cant_vend_d_punto_vent_kg'     => $record->cant_vend_d_punto_vent_kg,
            'cant_vend_tanq_D_kg'           => $record->cant_vend_tanq_D_kg,
            'cant_tot_vend_min_k'           => $record->cant_tot_vend_min_k,
            'granel'                        => $record->granel,
            'cilindros'                     => $record->cilindros,
            'suma'                          => $record->suma,
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
         
         $rows = $swiContent->get();
       
         $records = $swiContent->orderBy('ano')->paginate($perPage)->withQueryString();
         $records->getCollection()->transform(fn($record) => [
            'id'                           => $record->id,
            'mes'                           => $record->mes,
            'ano'                           => $record->ano,
            'cod_empresa'                   => $record->cod_empresa,
            'nomb_empresa'                  => $record->nomb_empresa,
            'cod_dep'                       => $record->cod_dep,
            'nomb_dep'                      => $record->nomb_dep,
            'cod_municipio'                 => $record->cod_municipio,
            'nomb_municipio'                => $record->nomb_municipio,
            'grupo'                         => $record->grupo,
            'zona'                          => $record->zona,
            'cant_vend_d_punto_vent_kg'     => $record->cant_vend_d_punto_vent_kg,
            'cant_vend_tanq_D_kg'           => $record->cant_vend_tanq_D_kg,
            'cant_tot_vend_min_k'           => $record->cant_tot_vend_min_k,
            'granel'                        => $record->granel,
            'cilindros'                     => $record->cilindros,
            'suma'                          => $record->suma,
         ]);
      }
      //   dd($records);
      return Inertia::render('comercial/swi/swi', [
         'records'      => $records,
         'filters'       => $request->only(['search', 'perPage']),
         'totalCount'    => $totalCount,
         'filteredCount' => $filteredCount,
         'rows' =>$rows
      ]);
   }

   public function importExcel(Request $request)
   {
      return Inertia::render('comercial/swi/swiImportExcel');
   }

   public function store(Request $request)
   {
      $datos = $request->all();

      foreach ($datos as $item) {
         $registro = [
            'mes' => (string) $item['mes'],
            'ano' => (string) $item['ano'],
            'cod_empresa' => (string) $item['cod_empresa'],
            'nomb_empresa' => (string) $item['nomb_empresa'],
            'cod_dep' => (string) $item['cod_dep'],
            'nomb_dep' => (string) $item['nomb_dep'],
            'cod_municipio' => (string) $item['cod_municipio'],
            'nomb_municipio' => (string) $item['nomb_municipio'],
            'grupo' => (string) $item['grupo'],
            'zona' => (string) $item['zona'],
            'cant_vend_d_punto_vent_kg' => isset($item['cant_vend_d_punto_vent_kg']) ? (int) $item['cant_vend_d_punto_vent_kg'] : null,
            'cant_vend_tanq_D_kg' => isset($item['cant_vend_tanq_D_kg']) ? (int) $item['cant_vend_tanq_D_kg'] : null,
            'cant_tot_vend_min_k' => isset($item['cant_tot_vend_min_k']) ? (int) $item['cant_tot_vend_min_k'] : null,
            'granel' => isset($item['granel']) ? (int) $item['granel'] : null,
            'cilindros' => isset($item['cilindros']) ? (int) $item['cilindros'] : null,
            'suma' => isset($item['suma']) ? (int) $item['suma'] : null,

         ];

         // Guardar en la BD
         SwiMain::insert($registro);
      }


      return response()->json([
         'status' => 'ok'
      ]);
   }
}
