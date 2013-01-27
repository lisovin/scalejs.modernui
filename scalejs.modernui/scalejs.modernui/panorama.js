/// <reference path="../scripts/_references.js" />
/*global console,define*/
/*jslint unparam: true*/define([
    'scalejs!core',
    'text!./panorama.html',
    'jQuery',
    'knockout',
    // ensure load
    './start-menu'
], function (
    core,
    panoramaTemplate,
    $,
    ko,
    startMenu
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    //var unwrap = ko.utils.unwrapObservable;

    function layoutPanorama() {
        startMenu.tuneUpStartMenu();
    }

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var value = valueAccessor();

            return {
                name: 'scalejs_modernui_page_template',
                data: value,
                afterRender: startMenu.reset
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
        init: init,
        update: update
    };
});
/*jslint unparam: false*/

