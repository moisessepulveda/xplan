<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! AppSetting::isRegistrationEnabled()) {
            return redirect()->route('login')
                ->with('error', 'El registro de nuevos usuarios está temporalmente deshabilitado.');
        }

        return $next($request);
    }
}
