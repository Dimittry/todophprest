<?php
/**
 * Created by PhpStorm.
 * User: Dimon
 * Date: 03.07.2017
 * Time: 15:51
 */

namespace App\Middleware;


class Middleware
{
    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }
}