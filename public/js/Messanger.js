var Messanger = (function () {
    var configMap = {
        messageId : 'message',
        negativeClass : 'negative'
    };

    var jqueryMap = {
        message : Helper.getJqueryElementById(configMap.messageId)
    };

    var show = function (message, isSuccess) {
        _message(message);
        if(!isSuccess) {
            _negative();
        }
        jqueryMap.message.show();
        setTimeout(function () {
            jqueryMap.message.hide();
        }, 3000);
    };

    var _message = function (message) {
        jqueryMap.message.html(message);
    };

    var _negative = function () {
        jqueryMap.message.addClass(configMap.negativeClass);
    };

    return {
        show : show
    };
})();