<?php
/**
 * Created by PhpStorm.
 * User: Dimon
 * Date: 04.07.2017
 * Time: 0:54
 */

namespace App\Middleware;


class RestAuthMiddleware extends Middleware
{
    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function __invoke($request, $response, $next)
    {
        if(!$this->container->auth->check()) {
            return $response->withJson(['result' => false, 'message' => $this->container->messages->getMessage('notAuth')]);
        }
        $response = $next($request, $response);
        return $response;
    }
}