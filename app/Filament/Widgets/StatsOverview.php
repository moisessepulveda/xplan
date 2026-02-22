<?php

namespace App\Filament\Widgets;

use App\Models\AppSetting;
use App\Models\Planning;
use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $totalPlannings = Planning::count();
        $totalTransactions = Transaction::count();

        $newUsersThisWeek = User::where('created_at', '>=', now()->startOfWeek())->count();

        $transactionsThisMonth = Transaction::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            Stat::make('Total Usuarios', $totalUsers)
                ->description("{$activeUsers} activos")
                ->descriptionIcon('heroicon-m-user-group')
                ->chart([7, 3, 4, 5, 6, $newUsersThisWeek])
                ->color('success'),

            Stat::make('Planificaciones', $totalPlannings)
                ->description('Total creadas')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('info'),

            Stat::make('Transacciones', number_format($totalTransactions))
                ->description("{$transactionsThisMonth} este mes")
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning'),

            Stat::make('Registro', AppSetting::isRegistrationEnabled() ? 'Habilitado' : 'Deshabilitado')
                ->description('Estado del registro')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color(AppSetting::isRegistrationEnabled() ? 'success' : 'danger'),
        ];
    }
}
