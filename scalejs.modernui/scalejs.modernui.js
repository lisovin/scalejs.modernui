/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama/panoramaBindingHandler',
    'knockout',
    'knockout.mapping'
], function (
    panoramaBindingHandler,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    function buildCore(core) {
        var bindingHandler = panoramaBindingHandler(core);

        ko.bindingHandlers.panorama = bindingHandler;
        ko.virtualElements.allowedBindings.panorama = true;
    }

    return {
        dependencies: ['mvvm'],
        buildCore: buildCore
    };
});

