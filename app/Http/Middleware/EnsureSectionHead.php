<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSectionHead
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user || $user->role !== 'teacher' || !$user->teacher?->is_section_head) {
            abort(403, 'Unauthorized – you are not a section head.');
        }
        return $next($request);
    }
}
