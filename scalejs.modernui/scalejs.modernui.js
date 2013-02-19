/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama/panoramaBindingHandler',
    'knockout',
    'knockout.mapping',
    'scalejs.mvvm'
], function (
    panoramaBindingHandler,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    ko.bindingHandlers.panorama = panoramaBindingHandler;
    ko.virtualElements.allowedBindings.panorama = true;
});

