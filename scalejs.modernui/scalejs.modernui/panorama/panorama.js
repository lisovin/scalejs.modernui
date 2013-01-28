/// <reference path="../scripts/_references.js" />
/*global console,define*/
/*jslint unparam: true*/define([
    'scalejs!core',
    '../utils',
    './panoramaBindings',
    'text!./panorama.html',
    'text!./panorama.css',
    'jQuery',
    'knockout',
    './tilesLayout'
], function (
    core,
    utils,
    panoramaBindings,
    panoramaTemplate,
    panoramaCss,
    $,
    ko,
    tilesLayout
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var addCss = utils.addCss;

    addCss('panorama', panoramaCss);

    function layoutPanorama(elements) {
        tilesLayout.reset(elements);
    }

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var value = valueAccessor();

            return {
                name: 'scalejs_modernui_page_template',
                data: value,
                afterRender: layoutPanorama
            };
        };
    }

    function init(        element,        valueAccessor,        allBindingsAccessor,        viewModel,        bindingContext    ) {
        if ($('#scalejs_modernui_page_template').length === 0) {
            $('#scalejs-templates').append(panoramaTemplate);
        }

        var result = ko.bindingHandlers.template.init(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );

        //startMenu.reset(element);

        return result;
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

    return {
        bindings: panoramaBindings,
        bindingHandler: {
            init: init,
            update: update
        }
    };
});
/*jslint unparam: false*/

