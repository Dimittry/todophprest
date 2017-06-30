(function (window) {
	'use strict';

	var TaskTodo = (function () {
		var run = function () {
			TaskTodo.Auth.checkAuth().done(function (data) {
                TaskTodo.NewItem.run();
                TaskTodo.List.run();
                TaskTodo.Dialog.run();
                TaskTodo.Nav.run();
                if(!data.result) {
				}
            });
        };

		return {
			run : run
		};
    })();

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
            $.post(configMap.paths.add, {task : task}, function (data) {
                console.log("Added data");
                console.log(data);
                if(data.result) {
                    TaskTodo.List.addTask(data.task)
					TaskTodo.List.redrawActiveTasksCounter();
                }
            }, 'json');
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

	TaskTodo.List = (function ($) {
		var configMap = {
			classes : {
				list : 'todo-list',
				activeCounter : 'todo-count'
			},
            paths : {
                loadList : '/rest/tasks/user/',

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

		var redrawActiveTasksCounter = function () {
            _recountActiveTasks();
			Helper.getJqueryElementByClass(configMap.classes.activeCounter)
				.find('strong').html(stateMap.counters.incompleteTasks);
        };

		var _recountActiveTasks = function () {
			stateMap.counters.incompleteTasks = stateMap.tasks.reduce(function (count, current) {
				return (!current.completed) ? count + 1 : count;
			}, 0);
            console.log('tasks incompleteTasks');
            console.log(stateMap.counters.incompleteTasks);
        };

        var _loadTasks = function () {
            var tasks;
            console.log("Load tasks");
            if(TaskTodo.Auth.isAuth()) {
                console.log('tasks');
                $.get(configMap.paths.loadList+TaskTodo.Auth.getUser().id, function (tasks) {
                    console.log('tasks response');
                    console.log(tasks);
                    if(tasks) {
                        stateMap.tasks = tasks;
                        _drawTasks();
                        redrawActiveTasksCounter();

                    }
                }, 'json');
            } else if(tasks = JSON.parse(localStorage.getItem('tasks'))) {
                console.log("Load tasks: localStorage");
                stateMap.tasks = tasks;
                _drawTasks();
            }
        };

        var _drawTasks = function () {
			var html = "";
			for(var i = 0; i < stateMap.tasks.length; i++) {
				html += _drawTask(stateMap.tasks[i]);
			}
			Helper.getJqueryElementByClass(configMap.classes.list).html(html);
        };

		var _drawTask = function (task) {
			var itemStyle = '';
			var isChecked = '';
			if(task.completed === configMap.task.completed) {
				itemStyle = 'class="completed"';
				isChecked = 'checked';
			}
			var html = "";
            html += '<li ' + itemStyle + '>';
            html += '<div class="view">';
			html += '<input class="toggle" type="checkbox" ' + isChecked + '>';
			html += '<label>' + task.name + '</label>';
            html += '<button class="destroy"></button>';
			html += '</div>';
			html += '<input class="edit" value="' + task.name + '">';
			html += '</li>';
			return html;
        }

		var run = function () {
			_loadTasks();
        };

		return {
			run : run,
            addTasks : addTasks,
			addTask : addTask,
			reloadTasks : reloadTasks,
			cleatTasks : clearTasks,
            redrawActiveTasksCounter : redrawActiveTasksCounter
		}

    })(jQuery);

	TaskTodo.Dialog = (function ($) {
		var configMap = {
			ids : {
				dialogForm : 'dialog-form',
				signIn : 'sign-in',
				username : 'name',
				password : 'password'
			}
		};
		var jqueryMap = {
			dialog : null,
			form : null,
			username : null,
			password : null
		};

		var run = function () {
            _setJqueryMap();
            _listenSignInButtonClick();
        };

		var _setJqueryMap = function () {
            jqueryMap.dialog = Helper.getJqueryElementById(configMap.ids.dialogForm).dialog({
                autoOpen: false,
                height: 400,
                width: 350,
                modal: true,
                buttons: {
                    "Sign in": _signIn,
                    Cancel: function() {
                        jqueryMap.dialog.dialog( "close" );
                    }
                },
                close: function() {
                    jqueryMap.form[0].reset();
                }
            });

            jqueryMap.form = jqueryMap.dialog.find( "form" ).on( "submit", function( event ) {
                event.preventDefault();
                _signIn();
            });

            jqueryMap.username = Helper.getJqueryElementById(configMap.ids.username);
            jqueryMap.password = Helper.getJqueryElementById(configMap.ids.password);
        };

		var _listenSignInButtonClick = function () {
            Helper.getJqueryElementById(configMap.ids.signIn).on( "click", function() {
                jqueryMap.dialog.dialog( "open" );
            });
        };

		var _signIn = function () {
			console.log('sign in');
			TaskTodo.Auth.signin(jqueryMap.username.val(), jqueryMap.password.val()).done(function (data) {
				if(data.result) {
					jqueryMap.dialog.dialog('close');
					TaskTodo.Nav.configureNav();
				}
            });
        };

		return {
			run : run
		};
    })(jQuery);

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
            console.log("Register");
            return $.post(configMap.paths.register, {username : username, password : password}, function (data) {
                console.log("Register response");
                if(data.result) {
					console.log("Register success");
				}
            }, 'json');
        };

		var signin = function (username, password) {
            return $.post(configMap.paths.signin, {username : username, password : password}, function (data) {
                console.log("Signin response");
                console.log(data)
                if(data.result) {
                    _updateAuth(true, data.user);
                    TaskTodo.List.addTasks(data.tasks);
                    TaskTodo.Nav.configureNav();
                    TaskTodo.List.redrawActiveTasksCounter();
                }
            }, 'json');
        };

		var logout = function () {
			return $.get(configMap.paths.logout, function (data) {
				console.log("Logout response");
				console.log(data);
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
            console.log("checkAuth");
            return $.post(configMap.paths.authCheck, function (data) {
                console.log("checkAuth: getResponse");
                console.log(data);

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
			console.log(jqueryMap);
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
					console.log('logout click');
					TaskTodo.Auth.logout();
                    e.preventDefault();
                });
        };

		return {
			run : run,
            configureNav : configureNav
		}
    })();

	var Helper = {
		getClassName : function (className) {
			return "." + className;
        },

        getIdName : function (id) {
            return "#" + id;
        },

		getJqueryElementByClass : function (className) {
            return $(this.getClassName(className));
        },

        getJqueryElementById : function (id) {
            return $(this.getIdName(id));
        }
    };

	TaskTodo.run();
})(window);
