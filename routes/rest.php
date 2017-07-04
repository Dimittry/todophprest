<?php

$app->post('/rest/auth/register', '\App\Controllers\AuthController:register');
$app->post('/rest/auth/signin', '\App\Controllers\AuthController:signin');

$app->group('', function () {

    $this->get('/rest/tasks', '\App\Controllers\TaskController:getAll');
    $this->get('/rest/tasks/user/{id}', '\App\Controllers\TaskController:getAllForUser');
    $this->post('/rest/tasks/update/complete/{taskId}', '\App\Controllers\TaskController:updateCompletedStatus');

    $this->post('/rest/task/edit/shared/', '\App\Controllers\ShareController:editShared');
    $this->post('/rest/task/completed/shared/', '\App\Controllers\ShareController:updateSharedCompletedStatus');
    $this->post('/rest/task/edit/shared/permission/', '\App\Controllers\ShareController:setSharedPermission');

    $this->post('/rest/task/add', '\App\Controllers\TaskController:add');
    $this->post('/rest/task/edit/', '\App\Controllers\TaskController:edit');
    $this->post('/rest/task/delete/', '\App\Controllers\TaskController:delete');
    $this->post('/rest/task/clear/completed/', '\App\Controllers\TaskController:clearCompleted');

    $this->post('/rest/auth/check', '\App\Controllers\AuthController:check');

    $this->get('/rest/auth/logout', '\App\Controllers\AuthController:logout');

    $this->post('/rest/share/', '\App\Controllers\ShareController:share');

})->add(new \App\Middleware\RestAuthMiddleware($container));
