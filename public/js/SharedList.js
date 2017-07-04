var SharedList = (function () {
    const ENTER_KEY = 13;
    var configMap = {
        classes : {
            task : 'view',
            editing : 'editing',
            todoList : 'todo-list',
            checkbox : 'toggle',
            completed : 'completed'
        },
        paths : {
            editShared : '/rest/task/edit/shared/',
            changeCompleted : '/rest/task/completed/shared/'
        }
    };
    var jqueryMap = {};

    var run = function () {
        _setJqueryMap();
        _listenToggleClick();
        _editTask().run();
    };

    var _setJqueryMap = function () {
        jqueryMap.body = $('body');
        jqueryMap.task = Helper.getJqueryElementByClass(configMap.classes.task);
        jqueryMap.todoList = Helper.getJqueryElementByClass(configMap.classes.todoList);
    };

    var _editTask = function () {
        var prevValue;
        var run = function () {
            _listenForEdit();
        };

        var _listenForEdit = function () {
            jqueryMap.body.on('dblclick', Helper.getClassName(configMap.classes.task) + " label", function () {
                var elem = $(this).parent();
                var input = elem.next();
                elem.parent().addClass(configMap.classes.editing);
                input.focus();
                prevValue = input.val();
            });
            jqueryMap.body.on('keyup blur', Helper.getClassName(configMap.classes.task)  + ' + input', function (event) {
                if((event.type === 'keyup' && event.keyCode === ENTER_KEY) || event.type !== 'keyup') {
                    var input = $(this);
                    var parent = input.parent();
                    parent.removeClass(configMap.classes.editing);
                    if(input.val() !== prevValue) {
                        _saveEdit(parent.data('taskid'), input.val(), parent);
                    }
                }
            });
        };

        var _saveEdit = function (id, val, parent) {
            $.post(
                configMap.paths.editShared,
                {
                    idTask : id,
                    newTaskName : val,
                    idUser : jqueryMap.todoList.data('userid')
                },
                function (data) {
                    if(data.result) {
                        _changeOrigTaskName(parent, val);
                    }
                    Messanger.show(data.message, data.result);
                }
            );

        };

        var _changeOrigTaskName = function (parent, val) {
            parent.find(Helper.getClassName(configMap.classes.task) + ' label').html(val);
        };

        return {
            run : run
        };
    };

    var _listenToggleClick = function () {
        jqueryMap.body.on('click', Helper.getClassName(configMap.classes.checkbox), function () {
            var checkbox = $(this);
            var li = checkbox.parents('li');
            var taskId = li.data('taskid');
            var completed = 0;
            if(checkbox.is(':checked')) {
                li.addClass(configMap.classes.completed);
                completed = 1;
            } else {
                li.removeClass(configMap.classes.completed);
            }

            $.post(
                configMap.paths.changeCompleted,
                {taskId : taskId, userId : jqueryMap.todoList.data('userid'), completed : completed},
                function (data) {
                    Messanger.show(data.message, data.result);
                }
            );
        });
    };

    return {
        run : run
    };
})();