<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        // Paksa semua request mengirimkan Accept: application/json
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
