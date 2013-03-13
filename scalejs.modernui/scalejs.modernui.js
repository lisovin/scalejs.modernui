/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama/panorama',
    'scalejs.modernui/panorama/tile',
    'scalejs.modernui/panorama/transitionManager',
    'knockout',
    'knockout.mapping'
], function (
    panorama,
    tile,
    transitionManager,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    ko.bindingHandlers.panorama = panorama;
    ko.bindingHandlers.tile = tile;
    ko.bindingHandlers.transitionManager = transitionManager;

    ko.virtualElements.allowedBindings.panorama = true;
    ko.virtualElements.allowedBindings.tile = true;
    ko.virtualElements.allowedBindings.transitionManager = true;
});

