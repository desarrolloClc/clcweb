<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectFormRequest;
use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projectsQuery = Project::query();

        # Capturing the total count before applying filters
        $totalCount = $projectsQuery->count();

        if ($request->filled('search')) {
            $search = $request->search;

            $projectsQuery->where(fn($query) =>
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('framework', 'like', "%{$search}%")
                   
            );
        }

        # Filtered Count
        $filteredCount = $projectsQuery->count();

        $perPage = (int) ($request->perPage ?? 10);

        # Fetch All the Records
        if ($perPage === -1) {
            $allprojects = $projectsQuery->latest()->get()->map(fn($project) => [
                'id'                           => $project->id,
                'name'                         => $project->name,
                'framework'                    => $project->framework,           
                'created_at'                   => $project->created_at->format('d M Y'),
            ]);

            $projects = [
                'data'     => $allprojects,
                'total'    => $filteredCount,
                'per_page' => $perPage,
                'from'     => 1,
                'to'       => $filteredCount,
                'links'    => [],
            ];

        } else {
            $projects = $projectsQuery->latest()->paginate($perPage)->withQueryString();
            $projects->getCollection()->transform(fn($project) => [
                'id'                           => $project->id,
                'name'                         => $project->name,
                'framework'                  => $project->framework,              
                'created_at'                   => $project->created_at->format('d M Y'),
            ]);
        }

        return Inertia::render('comercial/index', [
            'projects'      => $projects,
            'filters'       => $request->only(['search', 'perPage']),
            'totalCount'    => $totalCount,
            'filteredCount' => $filteredCount,
        ]);

     
 
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('comercial/medidores');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectFormRequest $request)
    {
        try {
            $project = Project::create([
                'name'=> $request->name,
                'framework'=> $request->framework
            ]);
            if($project){
                return redirect()->route('projects.index')->with('success', 'project creado exitosamente.');
            } 
            return redirect()->back();
          
        } catch (Exception $e) {
            Log::error('Project no fue creado'.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('comercial/medidores', [
            'project' => $project,
            'isEdit'  => true,]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
       
        try {
            if ($project) {
                $project->name        = $request->name;
                $project->framework = $request->framework;           

                $project->save();

                return redirect()->route('projects.index')->with('success', 'project updated successfully.');
            }
            return redirect()->back()->with('error', 'Unable to update project. Please try again!');

        } catch (Exception $e) {
            Log::error('project update failed: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        try {
            if ($project) {
                $project->delete();

                return redirect()->back()->with('success', 'project deleted successfully.');
            }
            return redirect()->back()->with('error', 'Unable to delete project. Please try again!');

        } catch (Exception $e) {
            Log::error('project deletion failed: ' . $e->getMessage());
        }
    }

 
}
