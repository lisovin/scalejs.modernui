/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    './panorama',
    './panoramaBindings',
    './panoramaLayout',
    'text!./panorama.html',
    'text!./panorama.css',
    '../utils',
    'jQuery',
    'knockout'
], function (
    panorama,
    panoramaBindings,
    panoramaLayout,
    panoramaTemplate,
    panoramaCss,
    utils,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var addCss = utils.addCss,
        observable = ko.observable,
        computed = ko.computed,
        unwrap = ko.utils.unwrapObservable,
        data = observable();

    addCss('panorama', panoramaCss);

    // Ensure the layout is recalculated when pages changes
    computed(function () {
        var actualData = unwrap(data);
        if (actualData) {
            unwrap(actualData.pages);
            // do layout later (after pages rendered)
            setTimeout(panoramaLayout.doLayout, 0);
        }
    });

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var options = valueAccessor();
            // if data is not set yet, then it's the top-most panorama, so create it
            // next level panoramas will be created by panorama itself when user navigates
            // around the panorama view
            if (!data()) {
                data(panorama(options, data));
            }
            return {
                name: 'scalejs_panorama_template',
                data: data,
                afterRender: panoramaLayout.reset
            };

        };
    }

    function init(        element,        valueAccessor,        allBindingsAccessor,        viewModel,        bindingContext    ) {
        if ($('#scalejs_modernui_page_template').length === 0) {
            $('#scalejs-templates').append(panoramaTemplate);
        }

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

    return {
        bindings: panoramaBindings,
        bindingHandler: {
            init: init,
            update: update
        }
    };
});
/*jslint unparam: false*/

