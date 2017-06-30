<?php

namespace App\Controllers;


use App\Auth\Auth;
use App\Models\User;
use Respect\Validation\Validator as v;

class AuthController extends Controller
{
    public function check()
    {
        $auth = new Auth();
        $isAuth = $auth->check();
        $user = ($isAuth) ? $auth->user() : null;
        return json_encode(['result' => $isAuth, 'user' => $user]);
    }

    public function register($request, $response)
    {
        $validation = $this->validate($request);
        $result = false;


        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => 'Заполните поля'], 200);
        }
        try {
            $user = User::create([
                'username' => $request->getParam('username'),
                'password' => password_hash($request->getParam('password'), PASSWORD_DEFAULT),
            ]);
            $result = true;
        } catch (\PDOException $e) {
            return $response->withJson(['result' => $result, 'message' => 'Пользовтель с таким именем уже существует.'], 200);
        }

        $this->auth->attempt($user->username, $request->getParam('password'));

        return $response->withJson(['result' => $result, 'user' => $user], 200);
    }

    public function signin($request, $response)
    {
        $user = null;
        $result = false;
        $validation = $this->validate($request);

        if($validation->failed()) {
            return $response->withJson(['result' => $result, 'message' => 'Заполните поля'], 200);
        }

        $auth = $this->auth->attempt($request->getParam('username'), $request->getParam('password'));
        if($auth) {
            $user = $this->auth->user();
            $result = true;
        }
        return $response->withJson(['result' => $result, 'user' => $user, 'tasks' => $user->tasks], 200);
    }

    public function logout($request, $response) {
        $result = $this->auth->logout();
        return $response->withJson(['result' => $result]);
    }

    private function validate($request) {
        return $this->validator->validate($request, [
            'username' => v::noWhitespace()->notEmpty(),
            'password' => v::noWhitespace()->notEmpty(),
        ]);
    }
}