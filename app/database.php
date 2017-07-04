<?php
use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$dbSettings = $settings['mode']['db'];
$capsule->addConnection($dbSettings);
$capsule->setAsGlobal();
$capsule->bootEloquent();