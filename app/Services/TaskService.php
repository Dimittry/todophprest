<?php
namespace App\Services;

use App\DTOs\TaskDTO;
use App\Exceptions\RecordAlreadyExistsException;
use App\Models\Task;

class TaskService {


    public function getAll()
    {
        return Task::all()->sortBy('created_at');
    }

    public function persist(TaskDTO $taskDTO)
    {
        return ($taskDTO->isNew()) ? $this->add($taskDTO) : $this->update($taskDTO);
    }

    public function delete($id)
    {
        return Task::find($id)->delete();
    }

    private function add($taskDTO)
    {
        $task = new Task;
        $existedTask = Task::where('name', $taskDTO->getName())->first();
        if($existedTask != null) {
            throw new RecordAlreadyExistsException();
        }
        return $task->create([
            'name' => $taskDTO->getName(),
            'user_id' => $taskDTO->getUserId(),
            'completed' => $taskDTO->isCompleted()
        ]);
    }

    private function update($taskDTO)
    {
        return Task::where('id', $taskDTO->getId())
            ->update([
                'name' => $taskDTO->getName(),
                'completed' => $taskDTO->isCompleted()
            ]);
    }
}