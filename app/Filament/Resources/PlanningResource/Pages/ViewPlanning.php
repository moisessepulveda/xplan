<?php

namespace App\Filament\Resources\PlanningResource\Pages;

use App\Filament\Resources\PlanningResource;
use App\Models\Category;
use App\Models\Transaction;
use App\Services\DefaultCategoriesService;
use App\Services\ReportGenerator;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewPlanning extends ViewRecord
{
    protected static string $resource = PlanningResource::class;

    public array $financialData = [];

    public array $historicalData = [];

    public array $alerts = [];

    public function mount(int|string $record): void
    {
        parent::mount($record);

        $this->loadFinancialData();
    }

    protected function loadFinancialData(): void
    {
        $reportGenerator = app(ReportGenerator::class);
        $planningId = $this->record->id;

        $this->financialData = $reportGenerator->getDashboardStats($planningId);
        $this->historicalData = $reportGenerator->getIncomeVsExpenses($planningId, 6);
        $this->alerts = $this->generateAlerts($planningId, $reportGenerator);
    }

    protected function generateAlerts(int $planningId, ReportGenerator $reportGenerator): array
    {
        $alerts = [];

        // Alerta de presupuestos excedidos
        $budgetData = $reportGenerator->getBudgetVsReal($planningId);
        if (! empty($budgetData['data'])) {
            foreach ($budgetData['data'] as $line) {
                if (isset($line['percentage']) && $line['percentage'] > 100) {
                    $alerts[] = [
                        'type' => 'danger',
                        'icon' => 'heroicon-o-exclamation-triangle',
                        'title' => 'Presupuesto excedido',
                        'message' => "{$line['category_name']}: {$line['percentage']}% del presupuesto usado",
                    ];
                }
            }
        }

        // Alerta de categorias sin uso (ultimos 3 meses)
        $unusedCategories = $this->getUnusedCategories($planningId);
        if (count($unusedCategories) > 0) {
            $alerts[] = [
                'type' => 'warning',
                'icon' => 'heroicon-o-archive-box',
                'title' => 'Categorias sin uso',
                'message' => count($unusedCategories).' categorias sin transacciones en los ultimos 3 meses',
            ];
        }

        // Alerta de transacciones pendientes de aprobacion
        $pendingCount = Transaction::where('planning_id', $planningId)
            ->where('pending_approval', true)
            ->count();

        if ($pendingCount > 0) {
            $alerts[] = [
                'type' => 'info',
                'icon' => 'heroicon-o-clock',
                'title' => 'Transacciones pendientes',
                'message' => "{$pendingCount} transacciones esperando aprobacion",
            ];
        }

        return $alerts;
    }

    protected function getUnusedCategories(int $planningId): array
    {
        $threeMonthsAgo = now()->subMonths(3)->startOfMonth();

        return Category::where('planning_id', $planningId)
            ->where('is_archived', false)
            ->whereDoesntHave('transactions', function ($query) use ($threeMonthsAgo) {
                $query->where('date', '>=', $threeMonthsAgo);
            })
            ->pluck('name')
            ->toArray();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('add_missing_categories')
                ->label('Agregar Categorias Faltantes')
                ->icon('heroicon-o-plus-circle')
                ->color('warning')
                ->requiresConfirmation()
                ->action(function () {
                    $service = app(DefaultCategoriesService::class);
                    $added = $service->createMissingCategories($this->record, $this->record->creator_id);

                    Notification::make()
                        ->title('Categorias agregadas')
                        ->body("Se agregaron {$added} categorias faltantes.")
                        ->success()
                        ->send();
                }),
        ];
    }
}
