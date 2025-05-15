<?php

namespace App\Models\Swin;

use Illuminate\Database\Eloquent\Model;

class SwiMain extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'DimSwiMain';

    protected $fillable = [
        'mes',
        'ano',
        'cod_empresa',
        'nomb_empresa',
        'cod_dep',
        'nomb_dep',
        'cod_municipio',
        'nomb_municipio',
        'grupo',
        'zona',
        'cant_vend_d_punto_vent_kg',
        'cant_vend_tanq_D_kg',
        'cant_tot_vend_min_k',
        'granel',
        'cilindros',
        'suma',
    ];

}
