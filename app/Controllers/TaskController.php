<?php
namespace App\Controllers;

use App\DTOs\TaskDTO;
use App\Exceptions\RecordAlreadyExistsException;
use App\Models\ShareTodo;
use App\Models\Task;
use App\Models\User;
use App\Services\TaskService;
use Respect\Validation\Validator as v;


class TaskController extends Controller {
    const EDITABLE = 1;

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
                'message' => $this->messages->getMessage('notAuth')
            ], 200);
        }

        $taskName = $request->getParam('task');
        try {
            $task = $this->taskService->persist(
                new TaskDTO(0, $taskName, 0, $this->auth->user()->id)
            );
            if(!empty($task)) {
                $result = true;
            }
        } catch (RecordAlreadyExistsException $e) {
            return $response->withJson([
                'result' => $result,
                'message' => $this->messages->getMessage('recordAlreadyExists')
            ], 200);
        }

        return $response->withJson(['result' => $result, 'task' => $task], 200);
    }

    public function edit($request, $response, $args)
    {
        $result = false;
        $validation = $this->validate($request, [
            'idTask' => v::noWhitespace()->notEmpty(),
            'newTaskName' => v::noWhitespace()->notEmpty(),
        ]);

        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => $this->messages->getMessage('failureEditing')], 200);
        }

        $idTask = $request->getParam('idTask');
        $newTaskName = $request->getParam('newTaskName');

        if($task = Task::find($idTask)) {
            $count = $task->update([
                'name' => $newTaskName
            ]);
            $result = true;
        }
        return $response->withJson([
            'result' => $result,
            'message' => $this->messages->getMessage('successfulEditing')
        ], 200);
    }

    public function delete($request, $response, $args)
    {
        $result = false;
        $validation = $this->validate($request, [
            'idTask' => v::noWhitespace()->notEmpty()
        ]);
        if($validation->failed()) {
            return $response->withJson([
                'result' => $result,
                'message' => $this->messages->getMessage('failureDeleting')
            ], 200);
        }

        $result = $this->taskService->delete($request->getParam('idTask'));
        return $response->withJson([
            'result' => $result,
            'message' => $this->messages->getMessage('successfulDeleting')
        ], 200);
    }

    public function updateCompletedStatus($request, $response, $args)
    {
        $taskId = $args['taskId'];
        $status = $request->getParam('status');
        $updatedCount = 0;

        if(!empty($taskId)) {
            $updatedCount  = Task::find($taskId)->update(['completed' => $status]);
        }
        return $response->withJson(['updateCount' => $updatedCount], 200);
    }


    public function clearCompleted($request, $response)
    {
        $result = false;
        if(!$this->auth->check()) {
            return $response->withJson([
                'result' => $result,
                'message' => $this->messages->getMessage('notAuth')
            ], 200);
        }

        Task::where('completed', 1)->where('user_id', $this->auth->user()->id)->delete();
        return $response->withJson([
            'result' => true,
            'message' => $this->messages->getMessage('completedTasksCleared')
        ], 200);
    }



    private function validate($request, $rules) {
        return $this->validator->validate($request, $rules);
    }
}