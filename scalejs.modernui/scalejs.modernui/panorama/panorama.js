/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './panoramaBindings',
    './panoramaLayout',
    'text!./panorama.html',
    './messageDialog',
    'jQuery',
    'knockout',
    'bPopup',
    'scalejs.mvvm'
], function (
    core,
    panoramaBindings,
    panoramaLayout,
    panoramaTemplate,
    messageDialog,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates;

    function panorama(options, element) {
        var isObservable = ko.isObservable,
            has = core.object.has,
            merge = core.object.merge,
            self;

        function selectPage(page) {
            if (isObservable(options.selectedPage)) {
                options.selectedPage(page);
            }
        }

        function doLayout() {
            setTimeout(panoramaLayout.doLayout, 10);
        }

        self = merge(options, {
            selectPage: selectPage,
            isBackButtonVisible: options.canBack,
            doLayout: doLayout
        });

        if (has(options, 'message')) {
            self.message = messageDialog(options.message, element);
        }

        return self;
    }

    function wrapValueAccessor(valueAccessor, element) {
        return function () {
            var options = valueAccessor(),
                myPanorama = panorama(options, element);

            return {
                name: 'sj_panorama_template',
                data: myPanorama,
                afterRender: myPanorama.doLayout
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
            wrapValueAccessor(valueAccessor, element),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    registerBindings(panoramaBindings);
    registerTemplates(panoramaTemplate);

    return {
        init: init,
        update: update
    };
});
/*jslint unparam: false*/

