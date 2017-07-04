TaskTodo.Filter = (function () {

    var configMap = {
        classes : {
            filter : 'filters',
            selected : 'selected'
        }
    };

    var run = function () {
        window.onhashchange = _locationHashChanged;
        _listenFilterChanging();
    };

    var _listenFilterChanging = function () {
        var filterLinks = Helper.getJqueryElementByClass(configMap.classes.filter).find('a');

        filterLinks.on('click', function () {
            filterLinks.removeClass(configMap.classes.selected);
            $(this).addClass(configMap.classes.selected);

        });
    };

    var _locationHashChanged = function () {
        if(location.hash == '#/active') {
            TaskTodo.List.showActiveTasks();
        } else if(location.hash == '#/completed') {
            TaskTodo.List.showCompletedTasks();
        } else {
            TaskTodo.List.showAllTasks();
        }
    };

    return {
        run : run
    };
})();