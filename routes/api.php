<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check endpoint (no auth required)
Route::get('/status', function () {
    $status = [
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'app' => config('app.name'),
        'version' => trim(file_get_contents(base_path('version')) ?: '1.0.0'),
    ];

    // Check database connection
    try {
        DB::connection()->getPdo();
        $status['database'] = 'connected';
    } catch (\Exception $e) {
        $status['database'] = 'error';
        $status['status'] = 'degraded';
    }

    // Check if Octane is running
    $status['server'] = 'octane';

    return response()->json($status, $status['status'] === 'ok' ? 200 : 503);
});

Route::middleware('auth:sanctum')->group(function () {
    // API routes will be defined here
});
