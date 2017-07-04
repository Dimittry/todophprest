var TaskTodo = (function () {
    var run = function () {
        TaskTodo.Auth.checkAuth().done(function (data) {
            TaskTodo.NewItem.run();
            TaskTodo.List.run();
            TaskTodo.Dialog.run();
            TaskTodo.Nav.run();
            TaskTodo.Filter.run();
            if(!data.result) {
            }
        });
    };

    return {
        run : run
    };
})();