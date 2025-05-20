<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\Nomina\AsistenciaController;
use App\Http\Controllers\Nomina\SelectCedEmpleadosController;
use App\Http\Controllers\Nomina\SelectedEmployedController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SelectFrameworkController;
use App\Http\Controllers\Swi\SwiMainController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');
   return redirect('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [MenuController::class,'dashboard'])->name('dashboard');

});

Route::group(['middleware' => ['permission:ver swi']], function () {
    Route::get('framework', SelectFrameworkController::class);
    Route::resource('projects',ProjectController::class);
    Route::get('swi',[SwiMainController::class,'index'])->name('swi.index');
    Route::post('swi',[SwiMainController::class,'store']);
    Route::get('swiExcel',[SwiMainController::class,'importExcel'])->name('swi.importExcel');
});

Route::group(['middleware' => ['permission:ver asistencia']], function () {
    Route::get('asistencia',[AsistenciaController::class,'index'])->name('asistencia.index');
    Route::post('asistencia',[AsistenciaController::class,'store'])->name('asistencia.store');
    Route::get('asistencia/{id}/edit',[AsistenciaController::class,'edit'])->name('asistencia.edit');
    Route::put('/asistencia/{id}', [AsistenciaController::class, 'update'])->name('asistencia.update');
    Route::delete('/asistencia/{id}', [AsistenciaController::class, 'destroy'])->name('asistencia.destroy');
    Route::get('asistencia/create',[AsistenciaController::class,'create'])->name('asistencia.create');   
    Route::get('cedulas-empleados/{centroOperativo}', SelectCedEmpleadosController::class);
    Route::get('cedula-empleado', SelectedEmployedController::class);
});

Route::group(['middleware' => ['role:superAdmin']], function () {
    Route::get('/admin/users',[MenuController::class,'adminUsers'])->name('adminUsers');
    
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
