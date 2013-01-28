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
        computed = ko.computed,
        isObservable = ko.isObservable,
        unwrap = ko.utils.unwrapObservable;

    addCss('panorama', panoramaCss);

    function panorama() {
        var selectedPage = observable(),
            options = observable(),
            panoramaData;

        function layoutPanorama(elements) {
            tilesLayout.reset(elements);
        }

        function selectPage(page) {
            selectedPage(page);
            if (isObservable(page.isSelected)) {
                page.isSelected(true);
            }
        }

        function deselectPage() {
            var page = selectedPage();
            if (has(page) && isObservable(page.isSelected)) {
                page.isSelected(false);
            }

            selectedPage(undefined);
        }

        panoramaData = computed(function () {
            var opts = options(),
                page = selectedPage(),
                base = page || opts,
                data = merge(base, {
                    selectedPage: selectedPage,
                    selectPage: selectPage,
                    deselectPage: deselectPage,
                    backButtonVisible: has(page)
                });
            // add page.pages to trackable observable so that tiles layout recalculate
            // when pages observable changes
            if (has(page)) {
                unwrap(page.pages);
            }

            return data;
        });

        function wrapValueAccessor(valueAccessor) {
            return function () {
                var value = valueAccessor();
                options(value);

                return {
                    name: 'scalejs_panorama_template',
                    data: panoramaData,
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

        tilesLayout.reset(element);

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

