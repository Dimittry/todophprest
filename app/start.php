<?php
define('INC_ROOT', dirname(__DIR__));

require INC_ROOT . '/vendor/autoload.php';


use Noodlehaus\Config;
use Slim\App;

session_cache_limiter(false);
session_start();

ini_set('display_errors', 'On');



$app = new App([
    'settings' => [
        'displayErrorDetails' => true,
        'mode' => Config::load(INC_ROOT . "/app/config/" . file_get_contents(INC_ROOT . '/mode.php') . ".php"),
    ]
]);
$container = $app->getContainer();
$settings = $container->get('settings');

require 'database.php';
require '../routes/routes.php';

$container['view'] = function ($container) {
    $view = new \Slim\Views\Twig(INC_ROOT . "/resources/views/");

    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

    return $view;
};

$container['db'] = function ($container) use($capsule) {
    return $capsule;
};

$container['validator'] = function ($container) {
    return new \App\Validation\Validator();
};

$container['auth'] = function ($container) {
    return new \App\Auth\Auth;
};


//
//$container['user'] = function ($container) {
//    return new \App\Models\User();
//};


//var_dump($app->getContainer()->get('user')->create([
//    'username' => "vasya",
//    'password' => "pupkin"
//]));

