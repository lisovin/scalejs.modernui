/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama/panorama',
    'scalejs.modernui/tiles/tiles',
    'scalejs.modernui/pivot/pivot',
    'scalejs.modernui/dropdown/dropdown',
    'scalejs.modernui/accordion/accordion',
    'knockout',
    'knockout.mapping'
], function (
    panorama,
    tiles,
    pivot,
    dropdown,
    accordion,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    ko.bindingHandlers.panorama = panorama;
    ko.bindingHandlers.tiles = tiles;
    ko.bindingHandlers.pivot = pivot;
    ko.bindingHandlers.dropdown = dropdown;
    ko.bindingHandlers.accordion = accordion;

    ko.virtualElements.allowedBindings.panorama = true;
    ko.virtualElements.allowedBindings.tiles = true;
});

