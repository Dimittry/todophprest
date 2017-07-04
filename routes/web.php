<?php
$app->get('/', function($request, $response, $args) {
    return $this->view->render($response, 'index.php');
});

$app->group('', function () {

    $this->get('/share/', '\App\Controllers\ShareController:getShareLists');
    $this->get('/share/{id}', '\App\Controllers\ShareController:showSharedList');

})->add(new \App\Middleware\AuthMiddleware($container));
