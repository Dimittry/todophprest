<?php
use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$dbSettings = $settings['mode']['db'];
//$capsule->addConnection([
//    'driver' => $dbSettings['driver'],
//    'host' => $dbSettings['host'],
//    'database' => $dbSettings['database'],
//    'username' => $dbSettings['username'],
//    'password' => $dbSettings['password'],
//    'charset' => $dbSettings['charset'],
//    'colation' => $dbSettings['colation'],
//    'prefix' => $dbSettings['prefix'],
//]);
$capsule->addConnection($dbSettings);
$capsule->bootEloquent();