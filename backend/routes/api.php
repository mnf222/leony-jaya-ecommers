<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('upcoming', [ProductController::class, 'upcoming']);
        Route::get('dropped', [ProductController::class, 'dropped']);
        Route::get('{product:slug}', [ProductController::class, 'show']);
    });

    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/', [OrderController::class, 'index']);
        Route::get('{order:order_number}', [OrderController::class, 'show']);
    });
});

Route::get('/health', fn () => response()->json(['status' => 'ok']));
