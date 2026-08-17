<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Teacher users
        User::create([
            'name' => 'Nimal Perera',
            'email' => 'nimal@kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        User::create([
            'name' => 'Kamala Silva',
            'email' => 'kamala@kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        User::create([
            'name' => 'Sunil Fernando',
            'email' => 'sunil@kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        User::create([
            'name' => 'Priyanka Jayawardena',
            'email' => 'priyanka@kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        // Student users
        User::create([
            'name' => 'Kasun Rajapaksha',
            'email' => 'kasun@student.kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        User::create([
            'name' => 'Dilini Wijesinghe',
            'email' => 'dilini@student.kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        User::create([
            'name' => 'Tharindu Gunasekara',
            'email' => 'tharindu@student.kcc.lk',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
    }
}
