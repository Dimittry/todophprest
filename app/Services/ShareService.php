<?php
namespace App\Services;

use App\Exceptions\RecordAlreadyExistsException;
use App\Exceptions\ShareException;
use App\Exceptions\UserNotFoundException;
use App\Models\ShareTodo;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class ShareService extends Service {

    public function share($username)
    {
        $shareUser = User::where('username', $username)->first();
        if(empty($shareUser)) {
            throw new UserNotFoundException($this->messages->getMessage('userNotFound'));
        }

        $shareTodo = ShareTodo::where('owner_id', $this->auth->user()->id)
                ->where('client_id', $shareUser->id)
                ->first();
        if(!empty($shareTodo)) {
            throw new RecordAlreadyExistsException($this->messages->getMessage('alreadyShared'));
        }

        $owner = $this->auth->user();
        if($owner->id == $shareUser->id) {
            throw new ShareException($this->messages->getMessage('cantShareToMyself'));
        }

        $result = ShareTodo::create([
            'owner_id' => $owner->id,
            'client_id' =>$shareUser->id
        ]);

        return !empty($result);
    }

    /**
     * С которыми поделились.
     * @return mixed
     */
    public function getSharedUsers()
    {

        return $this->getUsers(
            'owner_id',
            $this->auth->user()->id,
            function ($item){
                return $item->client_id;
            }
        );
    }

    public function getSharedUsersWithNames($ownerId)
    {
        $db = $this->db;
        return $db::table('users')
            ->join('share_todos', 'users.id', '=', 'share_todos.client_id')
            ->select('share_todos.*', 'users.username')
            ->where('share_todos.owner_id', $ownerId)
            ->get();
    }


    /**
     * Которые поделились с нами.
     */
    public function getSharingUsers($clientId)
    {
        return $this->getUsers(
            'client_id',
            $clientId,
            function ($item){
                return $item->owner_id;
            }
        );
    }

    public function getSharedRecord($ownerId, $clientId)
    {
        return ShareTodo::where('client_id', $clientId)
            ->where('owner_id', $ownerId);
    }

    private function getUsers($field, $id, $callback)
    {
        $sharedUserIds = $this->getUserIdsById($field, $id, $callback);
        return User::whereIn('id', $sharedUserIds)->get();
    }

    private function getUserIdsById($field, $id, $callback)
    {
        return ShareTodo::where($field, $id)->get()->map($callback)->all();
    }
}