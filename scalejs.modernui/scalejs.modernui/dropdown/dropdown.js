/*global define*/
/*jslint unparam: true*/
define([
    'scalejs!core',
    'jQuery',
    './dropdownBindings',
    'scalejs.mvvm',
    'dropdown'
], function (
    core,
    $,
    dropdownBindings
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings;

    registerBindings(dropdownBindings);

    /*jslint unparam: true*/
    function init(
        element
    ) {
        $(element).Dropdown();
    }

    return {
        init: init
    };

});