TaskTodo.Dialog = (function ($) {
    var configMap = {
        ids : {
            dialogForm : 'dialog-form',
            signIn : 'sign-in',
            signUp : 'sign-up',
            username : 'name',
            password : 'password'
        },
        classes : {
            dialogTitle : 'ui-dialog-title',
            sign : 'sign'
        },
        titles : {
            signIn : "Sign In",
            signUp : "Sign Up"
        }
    };
    var stateMap = {
        dialogSettings : {
            title : "",
            buttonCaption : "",
            handler : function () {}
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
        _listenSignButtonsClick();
    };

    var _setJqueryMap = function () {
        jqueryMap.dialog = Helper.getJqueryElementById(configMap.ids.dialogForm);

        jqueryMap.form = jqueryMap.dialog.find( "form" ).on( "submit", function( event ) {
            event.preventDefault();
            stateMap.dialogSettings.handler();
        });
        jqueryMap.username = Helper.getJqueryElementById(configMap.ids.username);
        jqueryMap.password = Helper.getJqueryElementById(configMap.ids.password);
    };

    var _listenSignButtonsClick = function () {
        Helper.getJqueryElementByClass(configMap.classes.sign).on( "click", function() {
            var elem = $(this);
            _initDialog(_getDialogSettings(elem.attr('id')));
            jqueryMap.dialog.dialog( "open" );
        });
    };

    var _initDialog = function (settings) {
        jqueryMap.dialog.dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Confirm": settings.handler,
                Cancel: function() {
                    jqueryMap.dialog.dialog( "close" );
                }
            },
            close: function() {
                jqueryMap.form[0].reset();
            }
        });

        Helper.getJqueryElementByClass(configMap.classes.dialogTitle).attr('title', settings.title).html(settings.title);
    };

    var _getDialogSettings = function (actionType) {
        if(actionType == configMap.ids.signIn) {
            return {
                title : configMap.titles.signIn,
                handler : _signIn
            };
        }
        return {
            title : configMap.titles.signUp,
            handler : _signUp
        };
    };

    var _signIn = function () {
        TaskTodo.Auth.signin(jqueryMap.username.val(), jqueryMap.password.val()).done(function (data) {
            if(data.result) {
                jqueryMap.dialog.dialog('close');
                TaskTodo.Nav.configureNav();
            }
        });
    };

    var _signUp = function () {
        TaskTodo.Auth.register(jqueryMap.username.val(), jqueryMap.password.val()).done(function (data) {
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