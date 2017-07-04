<?php

namespace App\Messages;

class Message
{
    protected $messages = [];

    function __construct($lang)
    {
        $messages = include(INC_ROOT . "/app/Messages/" . $lang . ".php");
        if($messages !== false && is_array($messages)) {
            $this->messages = $messages;
        }
    }

    public function getMessage($key)
    {
        return empty($this->messages[$key]) ? "" : $this->messages[$key];
    }
}