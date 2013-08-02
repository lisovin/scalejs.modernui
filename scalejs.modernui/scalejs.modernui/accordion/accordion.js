/*global define*/
/*jslint unparam: true*/
define([
    'scalejs!core',
    'jQuery',
    './accordionBindings',
    'scalejs.mvvm',
    'accordion'
], function (
    core,
    $,
    accordionBindings
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings;

    registerBindings(accordionBindings);

    /*jslint unparam: true*/
    function init(
        element
    ) {
        $(element).Accordion();
    }

    return {
        init: init
    };

});