/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama/panorama',
    'scalejs.modernui/panorama/tile',
    'scalejs.modernui/pivot/pivot',
    'knockout',
    'knockout.mapping'
], function (
    panorama,
    tile,
    pivot,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    ko.bindingHandlers.panorama = panorama;
    ko.bindingHandlers.tile = tile;
    ko.bindingHandlers.pivot = pivot;

    ko.virtualElements.allowedBindings.panorama = true;
    ko.virtualElements.allowedBindings.tile = true;
});

