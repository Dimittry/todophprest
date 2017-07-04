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
