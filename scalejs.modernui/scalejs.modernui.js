/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/utils',
    'scalejs.modernui/panorama/panoramaBindingHandler',
    'text!css/modern.css',
    'knockout',
    'knockout.mapping'
], function (
    utils,
    panorama,
    modernCss,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    var addCss = utils.addCss;

    addCss('modern', modernCss);

    function buildCore(core) {
        core.mvvm.registerBindings(panorama.bindings);

        ko.bindingHandlers.panorama = panorama.bindingHandler;
    }

    return {
        dependencies: ['mvvm'],
        buildCore: buildCore
    };
});

