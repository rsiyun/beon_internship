<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DuesTypeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OcupantController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/house', [HomeController::class, 'index']);
    Route::get('/house/all', [HomeController::class, 'getAll']);
    Route::get('/house/{id}', [HomeController::class, 'show']);
    Route::post('/house', [HomeController::class, 'store']);
    Route::put('/house/{id}', [HomeController::class, 'update']);
    Route::post('/house/{id}/ocupant', [HomeController::class, 'addResidentToHouse']);
    Route::patch('/house/{id}/ocupant', [HomeController::class, 'removeResidentFromHouse']);

    Route::post("/dues-type", [DuesTypeController::class, 'store']);
    Route::get("/dues-type", [DuesTypeController::class, 'index']);
    Route::get("/dues-type/all", [DuesTypeController::class, 'getAll']);
    Route::get("/dues-type/{id}", [DuesTypeController::class, 'show']);
    Route::put("/dues-type/{id}", [DuesTypeController::class, 'update']);

    Route::get('/ocupant', [OcupantController::class, 'index']);
    Route::get('/ocupant/all', [OcupantController::class, 'getAll']);
    Route::get('/ocupant/home/{id}', [OcupantController::class, 'getOcupantByHomeId']);
    Route::get('/ocupant/{id}', [OcupantController::class, 'show']);
    Route::post("/ocupant/{id}", [OcupantController::class, 'update']);
    Route::post('/ocupant', [OcupantController::class, 'store']);

    Route::get("/payment", [PaymentController::class, 'index']);
    Route::get("/payment/{id}", [PaymentController::class, 'show']);
    Route::post("/payment", [PaymentController::class, 'store']);
    Route::put("/payment/{id}", [PaymentController::class, 'update']);

    Route::get("/expense", [ExpenseController::class, 'index']);
    Route::get("/expense/{id}", [ExpenseController::class, 'show']);
    Route::post("/expense", [ExpenseController::class, 'store']);
    Route::put("/expense/{id}", [ExpenseController::class, 'update']);

    Route::get("/report", [ReportController::class, 'getMonthlySummary']);
    Route::get("/report/month", [ReportController::class, 'getMonthlyDetail']);

});
