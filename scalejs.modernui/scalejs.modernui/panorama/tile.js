/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './tileBindings',
    'text!./tile.html',
    'jQuery',
    'knockout',
    'scalejs.mvvm'
], function (
    core,
    tileBindings,
    tileTemplate,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates;


    function tile(options) {
        var //has = core.object.has,
            merge = core.object.merge,
            observable = ko.observable,
            self;

        function selectTile() {
            self.selected(true);
        }

        self = merge({
            // tile
            selectTile: selectTile,
            selected: observable(),
            width: 1,
            height: 1,
            // content
            content: undefined,
            contentTemplate: undefined,
            bgColor: undefined,
            // brand
            showBrand: true,
            brandName: undefined,
            brandHtml: undefined,
            brandBadge: undefined,
            brandBgColor: undefined
        }, options);

        return self;
    }

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var options = valueAccessor(),
                myTile = tile(options);

            return {
                name: 'sj_panorama_tile_template',
                data: myTile
            };
        };
    }

    function init(        element,        valueAccessor,        allBindingsAccessor,        viewModel,        bindingContext    ) {
        return { 'controlsDescendantBindings' : true };
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        return ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    registerBindings(tileBindings);
    registerTemplates(tileTemplate);

    return {
        init: init,
        update: update
    };
});
/*jslint unparam: false*/

