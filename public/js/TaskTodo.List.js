TaskTodo.List = (function ($) {
    var configMap = {
        classes : {
            list : 'todo-list',
            activeCounter : 'todo-count',
            checkbox : 'toggle',
            completed : 'completed',
            clearCompleted : 'clear-completed',
            footer : 'footer',
            main : 'main',
            taskItem : 'view',
            editing : 'editing',
            destroy : 'destroy',
            toggleAll : 'toggle-all'
        },
        paths : {
            loadList : '/rest/tasks/user/',
            updateCompleteStatus : '/rest/tasks/update/complete/',
            clearCompleted : '/rest/task/clear/completed/'

        },
        task : {
            completed : 1,
            uncompleted : 0
        }
    };

    var stateMap = {
        tasks : [],
        counters : {
            incompleteTasks : 0
        }
    };

    var jqueryMap = {};

    var run = function () {
        _setJqueryMap();
        _loadTasks();
        _listenToogleClick();
        _listenClearCompletedClick();
        _listenToggleAll();
        _editTask().run();
        _destroyTask().run();
    };

    var addTasks = function (tasks) {
        stateMap.tasks = tasks;
        _drawTasks();
    };

    var reloadTasks = function () {
        _drawTasks();
    };

    var addTask = function (task) {
        stateMap.tasks.push(task);
        _drawTasks();
    };

    var clearTasks = function () {
        stateMap.tasks = [];
    };

    var getTasksCount = function () {
        return stateMap.tasks.length;
    };

    var showActiveTasks = function () {
        _drawTasks(stateMap.tasks.filter(function (task) {
            return task.completed == 0;
        }));
    };

    var showCompletedTasks = function () {
        _drawTasks(_getCompletedTasks());
    };

    var showAllTasks = function () {
        _drawTasks(stateMap.tasks);
    };

    var redrawActiveTasksCounter = function () {
        _recountActiveTasks();
        Helper.getJqueryElementByClass(configMap.classes.activeCounter)
            .find('strong').html(stateMap.counters.incompleteTasks);
    };

    var _editTask = function () {
        var pathToSave = '/rest/task/edit/';
        var prevValue;
        var run = function () {
            _listenForEdit();
        };

        var _listenForEdit = function () {
            const ENTER_KEY = 13;
            jqueryMap.body.on('dblclick', Helper.getClassName(configMap.classes.taskItem), function () {
                var elem = $(this);
                var input = elem.next();
                elem.parent().addClass(configMap.classes.editing);
                input.focus();
                prevValue = input.val();
            });
            jqueryMap.body.on('keyup blur', Helper.getClassName(configMap.classes.taskItem)  + ' + input', function (event) {
                if((event.type === 'keyup' && event.keyCode === ENTER_KEY) || event.type !== 'keyup') {
                    var input = $(this);
                    var parent = input.parent();
                    parent.removeClass(configMap.classes.editing);
                    if(input.val() !== prevValue) {
                        _saveEdit(parent.data('id'), input.val(), parent);
                    }
                }
            });
        };

        var _saveEdit = function (id, val, parent) {
            if(TaskTodo.Auth.isAuth()) {
                $.post(pathToSave, {idTask : id, newTaskName : val});
            }
            _changeOrigTaskName(parent, val);
        };

        var _changeOrigTaskName = function (parent, val) {
              parent.find(Helper.getClassName(configMap.classes.taskItem) + ' label').html(val);
        };

        return {
            run : run
        };
    };

    var _destroyTask = function () {
        var pathToDelete = '/rest/task/delete/';
        var run = function () {
            _listenForDelete();
        };

        var _listenForDelete = function () {
            jqueryMap.body.on('click', Helper.getClassName(configMap.classes.destroy), function () {
                var elem = $(this);
                var row = elem.parents('li');
                _deleteTask(row);
            });
        };

        var _deleteTask = function (row) {
            if(TaskTodo.Auth.isAuth()) {
                $.post(pathToDelete, {idTask: row.data('id')}, function (data) {
                    if (data.result) {
                        _deleteFromStateList(row.data('id'));
                    }
                });
            } else {
                _deleteFromStateList(row.data('id'));
            }
        };

        var _deleteFromStateList = function (id) {
            var index = stateMap.tasks.map(function (task) { return task.id;}).indexOf(id);
            stateMap.tasks.splice(index, 1);
            _drawTasks();
        };

        return {
            run : run
        };
    };

    var _getCompletedTasks = function () {
        return stateMap.tasks.filter(function (task) {
            return task.completed == 1;
        });
    };

    var _recountActiveTasks = function () {
        stateMap.counters.incompleteTasks = stateMap.tasks.reduce(function (count, current) {
            return (!current.completed) ? count + 1 : count;
        }, 0);
    };


    var _changeCompleteStatusOnServer = function (idTask, status) {
        return $.post(configMap.paths.updateCompleteStatus + idTask, {status : status}, function (data) {
            if(data.updateCount) {
                _updateCompleteStatusById(idTask, status);
            }
        });
    };

    var _updateCompleteStatusById = function (idTask, status) {
        stateMap.tasks = stateMap.tasks.map(function (task) {
            if(task.id === idTask) {
                task.completed = status;
            }
            return task;
        });
        redrawActiveTasksCounter();

    };

    var _listenClearCompletedClick = function () {
        Helper.getJqueryElementByClass(configMap.classes.clearCompleted).on('click', function () {
            if(TaskTodo.Auth.isAuth()) {
                _clearCompletedTasksOnServer();
            }
            _clearCompletedTasksInMemory();
            _drawTasks();
        });
    };

    var _listenToogleClick = function () {
        jqueryMap.body.on('click', Helper.getClassName(configMap.classes.checkbox), function () {
            var checkbox = $(this);
            var li = checkbox.parents('li');
            var idTask = li.data('id');
            var completed = 0;
            if(checkbox.is(':checked')) {
                li.addClass(configMap.classes.completed);
                completed = 1;
            } else {
                li.removeClass(configMap.classes.completed);
            }
            if(TaskTodo.Auth.isAuth()) {
                _changeCompleteStatusOnServer(idTask, completed).done(function () {
                    _checkBlocksVisibility();
                });
            } else {
                _updateCompleteStatusById(idTask, completed);
                _checkBlocksVisibility();
            }
        });
    };

    var _listenToggleAll = function () {
        jqueryMap.body.on('click', 'label[for="toggle-all"]', function () {
            Helper.getJqueryElementByClass(configMap.classes.checkbox).each(function () {
                $(this).click();
            });
        });
    };

    var _clearCompletedTasksOnServer = function () {
        return $.post(configMap.paths.clearCompleted);
    };

    var _clearCompletedTasksInMemory = function () {
        stateMap.tasks = stateMap.tasks.filter(function (task) {
            return task.completed == 0;
        });
    };

    var _loadTasks = function () {
        var tasks;
        if(TaskTodo.Auth.isAuth()) {
            $.get(configMap.paths.loadList+TaskTodo.Auth.getUser().id, function (tasks) {
                if(tasks) {
                    stateMap.tasks = tasks;
                    _drawTasks();
                    redrawActiveTasksCounter();

                }
            }, 'json');
        } else if(tasks = JSON.parse(localStorage.getItem('tasks'))) {
            stateMap.tasks = tasks;
            _drawTasks();
        }
    };

    var _drawTasks = function (tasks) {
        tasks = tasks || stateMap.tasks;
        var html = "";
        for(var i = 0; i < tasks.length; i++) {
            html += _drawTask(tasks[i]);
        }
        Helper.getJqueryElementByClass(configMap.classes.list).html(html);
        _checkBlocksVisibility();
        redrawActiveTasksCounter();
    };

    var _drawTask = function (task) {
        var itemStyle = '';
        var isChecked = '';
        if(task.completed === configMap.task.completed) {
            itemStyle = 'class="completed"';
            isChecked = 'checked';
        }
        var html = "";
        html += '<li ' + itemStyle + ' data-id="' + task.id + '">';
        html += '<div class="view">';
        html += '<input class="toggle" type="checkbox" ' + isChecked + '>';
        html += '<label>' + task.name + '</label>';
        html += '<button class="destroy"></button>';
        html += '</div>';
        html += '<input class="edit" value="' + task.name + '">';
        html += '</li>';
        return html;
    }

    var _checkBlocksVisibility = function () {
        if(!getTasksCount()) {
            jqueryMap.main.hide();
            jqueryMap.footer.hide();
        }  else {
            jqueryMap.main.show();
            jqueryMap.footer.show();
        }
        if(_getCompletedTasks().length) {
            jqueryMap.clearCompleted.show();
        } else {
            jqueryMap.clearCompleted.hide();
        }
    };

    var _setJqueryMap = function () {
        jqueryMap.main = Helper.getJqueryElementByClass(configMap.classes.main);
        jqueryMap.footer = Helper.getJqueryElementByClass(configMap.classes.footer);
        jqueryMap.clearCompleted = Helper.getJqueryElementByClass(configMap.classes.clearCompleted);
        jqueryMap.body = $('body');
    };

    return {
        run : run,
        addTasks : addTasks,
        addTask : addTask,
        getTasksCount : getTasksCount,
        reloadTasks : reloadTasks,
        showActiveTasks : showActiveTasks,
        showCompletedTasks : showCompletedTasks,
        showAllTasks : showAllTasks,
        cleatTasks : clearTasks,
        redrawActiveTasksCounter : redrawActiveTasksCounter
    }

})(jQuery);