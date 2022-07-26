<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::resource('users', UserController::class);
    Route::get('/me', [AuthController::class, 'getMe']);
    Route::put('/change_password', [AuthController::class, 'changePassword']);
    Route::resource('/assets', AssetController::class);
    Route::resource('/categories', CategoryController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('/assets', AssetController::class);
    Route::resource('/categories', CategoryController::class);
    Route::resource('/assignments', AssignmentController::class);
});
