<?php

namespace App\Services;


class Service
{
    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function __get($name)
    {
        if($this->container->{$name}) {
            return $this->container->{$name};
        }
    }
}