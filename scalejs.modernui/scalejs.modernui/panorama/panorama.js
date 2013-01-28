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

    var addCss = utils.addCss,
        merge = core.object.merge,
        has = core.object.has,
        observable = ko.observable,
        computed = ko.computed;

    addCss('panorama', panoramaCss);

    function panorama() {
        var selectedPage = observable();

        function layoutPanorama(elements) {
            tilesLayout.reset(elements);
        }

        function selectPage(page) {
            selectedPage(page);
        }

        function deselectPage() {
            selectedPage(undefined);
        }

        function templateSelector() {
            return has(selectedPage()) ? 'scalejs_panorama_page_template' : 'scalejs_panorama_template';
        }

        function wrapValueAccessor(valueAccessor) {
            return function () {
                var value = valueAccessor();

                value = merge(value, { 
                    selectedPage: selectedPage,
                    selectPage: selectPage,
                    deselectPage: deselectPage
                });

                return {
                    name: templateSelector,
                    data: value,
                    afterRender: layoutPanorama
                };
            };
        }

        return {
            wrapValueAccessor: wrapValueAccessor
        };
    }

    function init(        element,        valueAccessor,        allBindingsAccessor,        viewModel,        bindingContext    ) {
        if ($('#scalejs_modernui_page_template').length === 0) {
            $('#scalejs-templates').append(panoramaTemplate);
        }

        var myPanorama = panorama();

        ko.utils.domData.set(element, 'panorama', myPanorama);

        return { 'controlsDescendantBindings' : true };
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        var panorama = ko.utils.domData.get(element, 'panorama');

        return ko.bindingHandlers.template.update(
            element,
            panorama.wrapValueAccessor(valueAccessor),
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

