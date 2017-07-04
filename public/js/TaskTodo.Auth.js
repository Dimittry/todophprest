TaskTodo.Auth = (function(){

    var configMap = {
        paths : {
            authCheck: '/rest/auth/check',
            register : '/rest/auth/register',
            signin : '/rest/auth/signin',
            logout : '/rest/auth/logout'
        }
    };

    var stateMap = {
        isAuth : false,
        user : null
    };

    var register = function (username, password) {
        return $.post(configMap.paths.register, {username : username, password : password}, function (data) {
            if(data.result) {
                _updateStateAfterAuth(data);
            }
            Messanger.show(data.message, data.result);
        }, 'json');
    };

    var signin = function (username, password) {
        return $.post(configMap.paths.signin, {username : username, password : password}, function (data) {
            if(data.result) {
                _updateStateAfterAuth(data);
            }
            Messanger.show(data.message, data.result);
        }, 'json');
    };

    var logout = function () {
        return $.get(configMap.paths.logout, function (data) {
            if(data.result) {
                _resetAuth();
                TaskTodo.Nav.configureNav();
                TaskTodo.List.cleatTasks();
                TaskTodo.List.reloadTasks();
                TaskTodo.List.redrawActiveTasksCounter();
            }
        });
    };

    var checkAuth = function () {
        return $.post(configMap.paths.authCheck, function (data) {
            stateMap.isAuth = data.result;
            if(isAuth()) {
                stateMap.user = data.user;
            }
        }, 'json');
    };

    var isAuth = function () {
        return stateMap.isAuth;
    };

    var getUser = function () {
        return stateMap.user;
    };

    var _updateStateAfterAuth = function (data) {
        _updateAuth(true, data.user);
        TaskTodo.List.addTasks(data.tasks);
        TaskTodo.Nav.configureNav();
        TaskTodo.List.redrawActiveTasksCounter();
    };

    var _updateAuth = function (isAuth, user) {
        stateMap.isAuth = isAuth;
        stateMap.user = user;
    };

    var _resetAuth = function () {
        stateMap.isAuth = false;
        stateMap.user = null;
    };

    return {
        register : register,
        signin : signin,
        logout : logout,
        checkAuth : checkAuth,
        isAuth : isAuth,
        getUser : getUser
    };
})();
