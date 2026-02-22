@php
    $alerts = $this->alerts ?? [];
@endphp

<div class="space-y-3">
    @forelse($alerts as $alert)
        <div class="flex items-start gap-3 p-3 rounded-lg
            {{ $alert['type'] === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : '' }}
            {{ $alert['type'] === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : '' }}
            {{ $alert['type'] === 'info' ? 'bg-blue-50 dark:bg-blue-900/20' : '' }}
            {{ $alert['type'] === 'success' ? 'bg-green-50 dark:bg-green-900/20' : '' }}
        ">
            <div class="flex-shrink-0">
                @if($alert['type'] === 'danger')
                    <x-heroicon-o-exclamation-triangle class="w-5 h-5 text-red-600" />
                @elseif($alert['type'] === 'warning')
                    <x-heroicon-o-exclamation-circle class="w-5 h-5 text-yellow-600" />
                @elseif($alert['type'] === 'info')
                    <x-heroicon-o-information-circle class="w-5 h-5 text-blue-600" />
                @else
                    <x-heroicon-o-check-circle class="w-5 h-5 text-green-600" />
                @endif
            </div>
            <div>
                <p class="font-medium
                    {{ $alert['type'] === 'danger' ? 'text-red-800 dark:text-red-200' : '' }}
                    {{ $alert['type'] === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : '' }}
                    {{ $alert['type'] === 'info' ? 'text-blue-800 dark:text-blue-200' : '' }}
                    {{ $alert['type'] === 'success' ? 'text-green-800 dark:text-green-200' : '' }}
                ">
                    {{ $alert['title'] }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $alert['message'] }}
                </p>
            </div>
        </div>
    @empty
        <div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <x-heroicon-o-check-circle class="w-5 h-5 text-green-600" />
            <p class="text-green-800 dark:text-green-200">No hay alertas. Todo esta en orden.</p>
        </div>
    @endforelse
</div>
