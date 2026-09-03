<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
});



Route::get('/login', function () {
    return view('.login'); // Make sure you have resources/views/auth/login.blade.php
})->name('login');

Route::get('/teacher-dashboard', function () {
    return view('teacherDashboard');
});

Route::get('/leave-request', function () {
    return view('leaveRequest');
})->name('leave.request');
