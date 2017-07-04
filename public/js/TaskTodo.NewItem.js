TaskTodo.NewItem = (function ($) {
    var configMap = {
        classes : {
            newTodoField : "new-todo"
        },
        enterCode : 13,
        paths : {
            add : '/rest/task/add',
            update : 'rest/task/update'
        }
    };

    var jqueryMap = {
        newTodoField : null
    };

    var run = function () {
        _setJqueryMap();
        _listenNewTodoAdding();
    };

    var _setJqueryMap = function () {
        jqueryMap = {
            newTodoField : _getElementByClass(configMap.classes.newTodoField)
        };
    };

    var _listenNewTodoAdding = function () {
        $(_getClassName(configMap.classes.newTodoField)).on('keyup', function (e) {
            if(e.keyCode == configMap.enterCode) {
                var elem = $(this);
                if(!elem.val()) return;
                _addItem(elem);
                elem.val('');
            }
        });
    };

    var _addItem = function (inputElem) {
        var task = inputElem.val();
        if(TaskTodo.Auth.isAuth()) {
            $.post(configMap.paths.add, {task : task}, function (data) {
                if(data.result) {
                    TaskTodo.List.addTask(data.task)
                    TaskTodo.List.redrawActiveTasksCounter();
                }
            }, 'json');
        } else {
            TaskTodo.List.addTask({
                id : TaskTodo.List.getTasksCount(),
                name : task,
                completed : 0
            });
            TaskTodo.List.redrawActiveTasksCounter();
        }

    };

    var _getElementByClass = function (className) {
        return Helper.getJqueryElementByClass(className);
    }

    var _getClassName = function (className) {
        return Helper.getClassName(className);
    }

    return {
        run : run
    };
})(jQuery);
