<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Project::query()->create([
            'name'=>'Next',
            'framework'=>'Next.js'           
        ]);

        Project::query()->create([
            'name'=>'SvelteKit',
            'framework'=>'SvelteKit'           
        ]);
        Project::query()->create([
            'name'=>'Astro',
            'framework'=>'Astro'           
        ]);
        Project::query()->create([
            'name'=>'Nuxt',
            'framework'=>'Nuxt.js'           
        ]);
    }
}
