<?php

namespace App\Middleware;


class AuthMiddleware extends Middleware
{
    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function __invoke($request, $response, $next)
    {
        if(!$this->container->auth->check()) {
            return $response->withRedirect('/');
        }
        $response = $next($request, $response);
        return $response;
    }
}