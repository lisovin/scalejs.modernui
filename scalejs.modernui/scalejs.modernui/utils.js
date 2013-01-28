/// <reference path="../scripts/_references.js" />
/*global console,define*/
define(function () {
    'use strict';

    function addCss(name, css) {
        if (!$('#' + name).length) {
            $('head').prepend('<style id="' + name + '"></style>');
        }
        $('#' + name).text(css);
    }

    return {
        addCss: addCss
    }
});

