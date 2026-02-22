@php
    $reportGenerator = app(\App\Services\ReportGenerator::class);
    $historical = $reportGenerator->getIncomeVsExpenses($getRecord()->id, 6);
    $currency = $getRecord()->currency;
@endphp

<div>
    {{-- Tabla de datos historicos --}}
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b dark:border-gray-700">
                    <th class="text-left py-2 px-4">Mes</th>
                    <th class="text-right py-2 px-4 text-green-600">Ingresos</th>
                    <th class="text-right py-2 px-4 text-red-600">Gastos</th>
                    <th class="text-right py-2 px-4">Balance</th>
                    <th class="text-right py-2 px-4">Tendencia</th>
                </tr>
            </thead>
            <tbody>
                @foreach($historical['data'] ?? [] as $index => $month)
                    @php
                        $prevBalance = $index > 0 ? ($historical['data'][$index - 1]['balance'] ?? 0) : ($month['balance'] ?? 0);
                        $trend = ($month['balance'] ?? 0) - $prevBalance;
                    @endphp
                    <tr class="border-b dark:border-gray-700">
                        <td class="py-2 px-4 font-medium">{{ $month['month_label'] ?? '' }}</td>
                        <td class="py-2 px-4 text-right text-green-600">
                            {{ number_format($month['income'] ?? 0, 0, ',', '.') }}
                        </td>
                        <td class="py-2 px-4 text-right text-red-600">
                            {{ number_format($month['expense'] ?? 0, 0, ',', '.') }}
                        </td>
                        <td class="py-2 px-4 text-right font-medium {{ ($month['balance'] ?? 0) >= 0 ? 'text-blue-600' : 'text-red-600' }}">
                            {{ number_format($month['balance'] ?? 0, 0, ',', '.') }}
                        </td>
                        <td class="py-2 px-4 text-right">
                            @if($index > 0)
                                @if($trend > 0)
                                    <span class="text-green-500 flex items-center justify-end gap-1">
                                        <x-heroicon-s-arrow-up class="w-4 h-4" />
                                        {{ number_format(abs($trend), 0, ',', '.') }}
                                    </span>
                                @elseif($trend < 0)
                                    <span class="text-red-500 flex items-center justify-end gap-1">
                                        <x-heroicon-s-arrow-down class="w-4 h-4" />
                                        {{ number_format(abs($trend), 0, ',', '.') }}
                                    </span>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            @else
                                <span class="text-gray-400">-</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <td class="py-2 px-4 font-bold">Promedio</td>
                    <td class="py-2 px-4 text-right font-bold text-green-600">
                        {{ number_format($historical['average_income'] ?? 0, 0, ',', '.') }}
                    </td>
                    <td class="py-2 px-4 text-right font-bold text-red-600">
                        {{ number_format($historical['average_expense'] ?? 0, 0, ',', '.') }}
                    </td>
                    <td colspan="2" class="py-2 px-4 text-right font-bold">
                        {{ number_format(($historical['average_income'] ?? 0) - ($historical['average_expense'] ?? 0), 0, ',', '.') }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
