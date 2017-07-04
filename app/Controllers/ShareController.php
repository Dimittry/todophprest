<?php
namespace App\Controllers;


use App\Models\User;
use App\Models\Task;
use Respect\Validation\Validator as v;


class ShareController extends Controller {
    const EDITABLE = 1;

    public function share($request, $response, $args)
    {
        $result = false;

//        if(!$this->auth->check()) {
//            return $response->withJson(['result' => $result, 'message' => $this->messages->getMessage('notAuth')], 200);
//        }

        $validation = $this->validate($request, [
            'username' => v::noWhitespace()->notEmpty(),
        ]);

        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => $this->messages->getMessage('incorrectUsername')], 200);
        }

        $username = $request->getParam('username');
        $message = $this->messages->getMessage('failureSharing');
        try {
            $result = $this->shareService->share($username);
            if($result) {
                $message = $this->messages->getMessage('successfulSharing');
            }
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        return $response->withJson(['result' => $result, 'message' => $message], 200);
    }

    public function showSharedList($request, $response, $args)
    {
        $userId = $args['id'];
        $user = User::find($userId);
        return $this->view->render($response, 'showSharedTasks.php', [
            'user' => $user
        ]);
    }

    public function getShareLists($request, $response)
    {
        return $this->view->render($response, 'share.php', [
            'sharedUsers' => $this->shareService->getSharedUsersWithNames($this->auth->user()->id),
            'sharingUsers' => $this->shareService->getSharingUsers($this->auth->user()->id)
        ]);
    }

    public function setSharedPermission($request, $response)
    {
        $result = false;

        $validation = $this->validate($request, [
            'clientId' => v::noWhitespace()->notEmpty(),
        ]);

        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => $this->messages->getMessage('incorrectUserId')], 200);
        }

        $clientId = $request->getParam('clientId');
        $isChecked = ($request->getParam('isChecked') === 'false') ? 0 : 1;
        $sharedRecord = $this->shareService->getSharedRecord($this->auth->user()->id, $clientId);
        if($sharedRecord) {
            $sharedRecord->update([
                'editable' => $isChecked
            ]);
            return $response->withJson([
                'result' => $result,
                'message' => $this->messages->getMessage('successfulEditing')
            ], 200);
        }
        return $response->withJson([
            'result' => $result,
            'message' => $this->messages->getMessage('failureEditing')
        ], 200);
    }

    public function updateSharedCompletedStatus($request, $response, $args)
    {
        $taskId = $request->getParam('taskId');
        $userId = $request->getParam('userId');
        $status = $request->getParam('completed');
        $result = false;
        $sharedRecord = $this->shareService->getSharedRecord($userId, $this->auth->user()->id)->first();
        $message = $this->messages->getMessage('actionDisallow');
        if($sharedRecord && ($sharedRecord->editable == self::EDITABLE)) {
            $result  = Task::find($taskId)->update(['completed' => $status]);
            if($result) {
                $message = $this->messages->getMessage('successfulEditing');
            }
        }
        return $response->withJson(['result' => $result, 'message' => $message], 200);
    }

    public function editShared($request, $response)
    {
        $result = false;
        $validation = $this->validate($request, [
            'idTask' => v::noWhitespace()->notEmpty(),
            'newTaskName' => v::noWhitespace()->notEmpty(),
            'idUser' => v::noWhitespace()->notEmpty(),
        ]);

        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => $this->messages->getMessage('failureEditing')], 200);
        }

        $idTask = $request->getParam('idTask');
        $newTaskName = $request->getParam('newTaskName');
        $ownerId = $request->getParam('idUser');

        $sharedRecord = $this->shareService->getSharedRecord($ownerId, $this->auth->user()->id)->first();
        if($sharedRecord && $sharedRecord->editable === self::EDITABLE) {
            if($task = Task::find($idTask)) {
                $task->update([
                    'name' => $newTaskName
                ]);
                $result = true;
            }
            return $response->withJson([
                'result' => $result,
                'message' => $this->messages->getMessage('successfulEditing')
            ], 200);
        }

        return $response->withJson([
            'result' => $result,
            'message' => $this->messages->getMessage('disallowEditing')
        ], 200);
    }

    private function validate($request, $rules) {
        return $this->validator->validate($request, $rules);
    }
}