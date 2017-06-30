<?php
namespace App\Controllers;

use App\DTOs\TaskDTO;
use App\Exceptions\RecordAlreadyExistsException;
use App\Models\User;
use App\Services\TaskService;

class TaskController extends Controller {

    public function getAll() {
        return json_encode((new TaskService)->getAll());
    }

    public function getAllForUser($request, $response, $args) {
        $id = $args['id'];
        $user = User::find($id);
        $tasks = $user->tasks;
        return $response->withJson($tasks, 200);
    }

    public function add($request, $response, $args) {
        $result = false;
        $task = null;
        if(!$this->auth->check()) {
            return $response->withJson([
                'result' => $result,
                'message' => 'Необходимо авторизоватья'
            ], 200);
        }

        $taskName = $request->getParam('task');
        $taskService = new TaskService();
        try {
            $task = $taskService->persist(
                new TaskDTO(0, $taskName, 0, $this->auth->user()->id)
            );
            if(!empty($task)) {
                $result = true;
            }
        } catch (RecordAlreadyExistsException $e) {
            return $response->withJson([
                'result' => $result,
                'message' => "Такая запись уже существует."
            ], 200);
        }

        return $response->withJson(['result' => $result, 'task' => $task], 200);
    }
}