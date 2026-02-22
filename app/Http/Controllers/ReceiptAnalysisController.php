<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ReceiptImageParser;
use App\Http\Requests\Transaction\AnalyzeReceiptRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReceiptAnalysisController extends Controller
{
    public function analyze(AnalyzeReceiptRequest $request): JsonResponse
    {
        $planningId = auth()->user()->active_planning_id;

        if (!$planningId) {
            return response()->json([
                'success' => false,
                'error' => 'No hay una planificación activa.',
            ], 422);
        }

        try {
            // Store the image locally
            $file = $request->file('image');
            $filename = 'receipts/' . uniqid('receipt_') . '.' . $file->getClientOriginalExtension();
            $path = Storage::disk('local')->putFileAs('', $file, $filename);
            $fullPath = Storage::disk('local')->path($path);

            Log::info('Receipt analysis starting', [
                'planning_id' => $planningId,
                'filename' => $filename,
                'full_path' => $fullPath,
                'file_exists' => file_exists($fullPath),
                'file_size' => file_exists($fullPath) ? filesize($fullPath) : 0,
                'mime_type' => $file->getMimeType(),
            ]);

            // Parse the receipt with AI
            $agent = ReceiptImageParser::forPlanning($planningId, $fullPath);


            $response = $agent->prompt('Analiza esta imagen de recibo y extrae la información.');

            $data = $response->toArray();


            // Return the parsed data
            return response()->json([
                'success' => true,
                'data' => [
                    'is_valid_receipt' => $data['is_valid_receipt'] ?? false,
                    'amount' => $data['amount'] ?? 0,
                    'description' => $data['description'] ?? '',
                    'merchant' => $data['merchant'] ?? '',
                    'date' => $data['date'] ?? '',
                    'suggested_category_id' => $data['suggested_category_id'] ?? 0,
                    'confidence' => $data['confidence'] ?? 0,
                    'items_summary' => $data['items_summary'] ?? '',
                ],
                'receipt_path' => $filename,
            ]);

        } catch (\Exception $e) {
            Log::error('Receipt analysis failed', [
                'planning_id' => $planningId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al analizar la imagen. Por favor intenta nuevamente.',
            ], 500);
        }
    }
}
