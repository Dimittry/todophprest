<?php
/**
 * Created by PhpStorm.
 * User: Dimon
 * Date: 28.06.2017
 * Time: 23:58
 */

namespace App\DTOs;


class TaskDTO
{
    private $id;
    private $name;
    private $completed;
    private $userId;

    /**
     * TaskDTO constructor.
     * @param $id
     * @param $name
     * @param $completed
     */
    public function __construct($id = 0, $name = '', $completed = 0, $userId)
    {
        $this->id = $id;
        $this->name = $name;
        $this->completed = $completed;
        $this->userId = $userId;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function isCompleted()
    {
        return $this->completed;
    }

    /**
     * @param mixed $completed
     */
    public function setCompleted($completed)
    {
        $this->completed = $completed;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }



    public function isNew()
    {
        return ($this->id == 0);
    }

}