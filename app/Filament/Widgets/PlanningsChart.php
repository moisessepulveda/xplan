<?php

namespace App\Filament\Widgets;

use App\Models\Planning;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class PlanningsChart extends ChartWidget
{
    protected ?string $heading = 'Planificaciones Creadas';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $labels[] = $month->locale('es')->isoFormat('MMM');
            $data[] = Planning::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Planificaciones',
                    'data' => $data,
                    'backgroundColor' => '#10b981',
                    'borderColor' => '#10b981',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
