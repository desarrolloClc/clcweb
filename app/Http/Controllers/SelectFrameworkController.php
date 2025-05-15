<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class SelectFrameworkController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $proy = $request->query('proy');
        $project = Project::where('framework',$proy)->get();
        // echo json_encode($project);
            return response()->json([
                'response' =>  $project
            ]);
    }
}
