var Share = (function () {
    const ENTER_KEY = 13;
    var configMap = {
        classes : {
            input : 'new-todo',
            editAllowCheckbox : 'edit-allow'
        },
        paths : {
            editAllow : '/rest/task/edit/shared/permission/'
        }
    };
    var jqueryMap = {};

    var run = function () {
        _setJqueryMap();
        _listenForAllowEdit();
        _share().run();
    };

    var _setJqueryMap = function () {
        jqueryMap.body = $('body');
        jqueryMap.input = Helper.getJqueryElementByClass(configMap.classes.input);
    };

    var _share = function () {
        var pathToShare = '/rest/share/'
        var run = function () {
            _listenShare();
        };

        var _listenShare = function () {
            jqueryMap.body.on('keyup', Helper.getClassName(configMap.classes.input), function (e) {
                if(e.keyCode === ENTER_KEY) {
                    _sendShare($(this).val());
                }
            });
        };

        var _sendShare = function (username) {
            return $.post(pathToShare, {username : username}, function (data) {
                jqueryMap.input.val("");
                Messanger.show(data.message, data.result);
                if(data.result) {
                    setTimeout(function () {
                        location.reload();
                    }, 3000);
                }

            }, 'json');
        };

        return {run : run};
    };

    var _listenForAllowEdit = function () {
        jqueryMap.body.on('change', Helper.getClassName(configMap.classes.editAllowCheckbox), function () {
            var checkbox = $(this);
            var li = checkbox.parents('li');
            var clientId = li.data('clientid');
            $.post(configMap.paths.editAllow, {clientId : clientId, isChecked : checkbox.is(':checked')}, function (data) {
                Messanger.show(data.message, data.result);
            });
        });
    };

    return {
        run : run
    };
})();