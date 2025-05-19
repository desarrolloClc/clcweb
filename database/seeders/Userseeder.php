<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class Userseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    //     Permission::create(['name' => 'ver usuarios']);
    //     Permission::create(['name' => 'crear usuarios']);
    //     Permission::create(['name' => 'editar usuarios']);
    //     Permission::create(['name' => 'eliminar usuarios']);

    //     Permission::create(['name' => 'ver medidores']);
    //     Permission::create(['name' => 'crear medidores']);
    //     Permission::create(['name' => 'editar medidores']);
    //     Permission::create(['name' => 'eliminar medidores']);

      
    //    $adminUser = User::query()->create([
    //     'name'=>'admin',
    //     'email'=>'admin@clc.com.co',
    //     'password'=>'12345678',
    //     'email_verified_at'=>now()
    // ]);

    //     $roleAdmin = Role::create(['name' => 'superAdmin']);
    //     $adminUser->assignRole($roleAdmin);
    //     $permissionAdmin = Permission::query()->pluck('name');
    //     $roleAdmin->syncPermissions($permissionAdmin);
        
    //     $userMedidor = User::query()->create([
    //         'name'=>'Sandra',
    //         'email'=>'sandra@clc.com.co',
    //         'password'=>'12345678',
    //         'email_verified_at'=>now()
    //     ]);

    //     $roleMedidor = Role::create(['name'=>'medidor']);
    //     $userMedidor->assignRole($roleMedidor);
    //     $roleMedidor->syncPermissions(['ver medidores']);

      Permission::create(['name' => 'ver asistencia']);

        $userTalentoHumano = User::query()->create([
            'name'=>'Adriana Maria Henao Valencia',
            'email'=>'ahenao@clcgas.com.co',
            'password'=>'12345678',
            'email_verified_at'=>now()
        ]);

        $roleTalentoHumano = Role::create(['name'=>'talento_humano']);
        $userTalentoHumano->assignRole($roleTalentoHumano);
        $roleTalentoHumano->syncPermissions(['ver asistencia']);

        $role = Role::findByName('superAdmin');
        $role->givePermissionTo('ver asistencia');

      


    }
}
