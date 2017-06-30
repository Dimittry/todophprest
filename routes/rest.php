<?php

$app->get('/rest/tasks', '\App\Controllers\TaskController:getAll');
$app->get('/rest/tasks/user/{id}', '\App\Controllers\TaskController:getAllForUser');

$app->post('/rest/task/add', '\App\Controllers\TaskController:add');

$app->post('/rest/auth/check', '\App\Controllers\AuthController:check');

$app->post('/rest/auth/register', '\App\Controllers\AuthController:register');
$app->post('/rest/auth/signin', '\App\Controllers\AuthController:signin');
$app->get('/rest/auth/logout', '\App\Controllers\AuthController:logout');
//$app->post('/rest/task/add', function($req, $resp, $args) {
//    print_r($req->getParam('task'));
//});