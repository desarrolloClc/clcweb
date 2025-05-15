<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function adminUsers():Response
    {
        return Inertia::render('admin/users');
    }

    public function dashboard():Response
    {
        return Inertia::render('dashboard');
        
    }

    public function medidores():Response
    {
        return Inertia::render('comercial/medidores');
    }
}
