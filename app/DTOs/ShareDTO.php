<?php
/**
 * Created by PhpStorm.
 * User: Dimon
 * Date: 28.06.2017
 * Time: 23:58
 */

namespace App\DTOs;


class ShareDTO
{
    private $id;
    private $ownerId;
    private $clientId;
    private $editable;
    private $ownerName;
    private $clientName;

    /**
     * ShareDTO constructor.
     * @param int $id
     * @param $ownerId
     * @param $clientId
     * @param int $editable
     * @param string $ownerName
     * @param string $clientName
     */
    public function __construct($id=0, $ownerId, $clientId, $editable = 0, $ownerName = '', $clientName = '')
    {
        $this->id = $id;
        $this->ownerId = $ownerId;
        $this->clientId = $clientId;
        $this->editable = $editable;
        $this->ownerName = $ownerName;
        $this->clientName = $clientName;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getOwnerId()
    {
        return $this->ownerId;
    }

    /**
     * @param mixed $ownerId
     */
    public function setOwnerId($ownerId)
    {
        $this->ownerId = $ownerId;
    }

    /**
     * @return mixed
     */
    public function getClientId()
    {
        return $this->clientId;
    }

    /**
     * @param mixed $clientId
     */
    public function setClientId($clientId)
    {
        $this->clientId = $clientId;
    }

    /**
     * @return int
     */
    public function getEditable()
    {
        return $this->editable;
    }

    /**
     * @param int $editable
     */
    public function setEditable($editable)
    {
        $this->editable = $editable;
    }

    /**
     * @return string
     */
    public function getOwnerName()
    {
        return $this->ownerName;
    }

    /**
     * @param string $ownerName
     */
    public function setOwnerName($ownerName)
    {
        $this->ownerName = $ownerName;
    }

    /**
     * @return string
     */
    public function getClientName()
    {
        return $this->clientName;
    }

    /**
     * @param string $clientName
     */
    public function setClientName($clientName)
    {
        $this->clientName = $clientName;
    }

    public function isNew()
    {
        return ($this->id == 0);
    }

}