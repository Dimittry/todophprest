TaskTodo.Nav = (function () {
    var configMap = {
        classes : {
            notauth : 'not-auth',
            auth : 'auth'
        },
        ids : {
            logout : 'logout'
        }
    };

    var jqueryMap = {
        notauth : null,
        auth : null
    };

    var run = function () {
        _setJqueryMap();
        configureNav();
        _listenLogoutClick();
    };

    var configureNav = function () {
        if(TaskTodo.Auth.isAuth()) {
            jqueryMap.notauth.hide();
            jqueryMap.auth.show();
        } else {
            jqueryMap.notauth.show();
            jqueryMap.auth.hide();
        }
    };

    var _setJqueryMap = function () {
        jqueryMap.notauth = Helper.getJqueryElementByClass(configMap.classes.notauth);
        jqueryMap.auth = Helper.getJqueryElementByClass(configMap.classes.auth);
    };

    var _listenLogoutClick = function () {
        Helper.getJqueryElementById(configMap.ids.logout).on('click', function (e) {
            TaskTodo.Auth.logout();
            e.preventDefault();
        });
    };

    return {
        run : run,
        configureNav : configureNav
    }
})();