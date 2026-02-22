@php
    $reportGenerator = app(\App\Services\ReportGenerator::class);
    $stats = $reportGenerator->getDashboardStats($getRecord()->id);
    $quickStats = $reportGenerator->getQuickStats($getRecord()->id);
    $currency = $getRecord()->currency;
@endphp

<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    {{-- Ingresos del Mes --}}
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <div class="flex items-center gap-2">
            <x-heroicon-o-arrow-trending-up class="w-5 h-5 text-green-600" />
            <span class="text-sm text-green-600 font-medium">Ingresos</span>
        </div>
        <p class="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">
            {{ number_format($stats['month_income'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
    </div>

    {{-- Gastos del Mes --}}
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <div class="flex items-center gap-2">
            <x-heroicon-o-arrow-trending-down class="w-5 h-5 text-red-600" />
            <span class="text-sm text-red-600 font-medium">Gastos</span>
        </div>
        <p class="text-2xl font-bold text-red-700 dark:text-red-400 mt-2">
            {{ number_format($stats['month_expense'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
        @if(($quickStats['expense_change'] ?? 0) != 0)
            <p class="text-xs mt-1 {{ $quickStats['expense_change'] > 0 ? 'text-red-500' : 'text-green-500' }}">
                {{ $quickStats['expense_change'] > 0 ? '+' : '' }}{{ $quickStats['expense_change'] }}% vs mes anterior
            </p>
        @endif
    </div>

    {{-- Balance del Mes --}}
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="flex items-center gap-2">
            <x-heroicon-o-scale class="w-5 h-5 text-blue-600" />
            <span class="text-sm text-blue-600 font-medium">Balance</span>
        </div>
        <p class="text-2xl font-bold {{ ($stats['month_balance'] ?? 0) >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400' }} mt-2">
            {{ number_format($stats['month_balance'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
    </div>

    {{-- Uso de Presupuesto --}}
    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <div class="flex items-center gap-2">
            <x-heroicon-o-chart-pie class="w-5 h-5 text-purple-600" />
            <span class="text-sm text-purple-600 font-medium">Presupuesto</span>
        </div>
        <p class="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-2">
            {{ $stats['budget_used'] ?? 0 }}%
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="h-2 rounded-full {{ ($stats['budget_used'] ?? 0) > 100 ? 'bg-red-600' : (($stats['budget_used'] ?? 0) > 80 ? 'bg-yellow-500' : 'bg-purple-600') }}"
                 style="width: {{ min($stats['budget_used'] ?? 0, 100) }}%"></div>
        </div>
    </div>
</div>

{{-- Balance Total y Deudas --}}
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <span class="text-sm text-gray-500">Balance Total en Cuentas</span>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ number_format($stats['total_balance'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <span class="text-sm text-gray-500">Deuda Total (Creditos)</span>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ number_format($stats['total_debt'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <span class="text-sm text-gray-500">Cuentas por Cobrar</span>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ number_format($stats['total_receivable'] ?? 0, 0, ',', '.') }} {{ $currency }}
        </p>
    </div>
</div>
