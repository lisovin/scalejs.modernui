/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './panoramaBindings',
    './panoramaLayout',
    'text!./panorama.html',
    'jQuery',
    'knockout',
    'scalejs.mvvm'
], function (
    core,
    panoramaBindings,
    panoramaLayout,
    panoramaTemplate,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates;

    function panorama(options) {
        var isObservable = ko.isObservable,
            has = core.object.has,
            merge = core.object.merge,
            self,
            isBackButtonVisible = false;

        function selectPage(page) {
            if (isObservable(options.selectedPage)) {
                options.selectedPage(page);
            }
        }

        function doLayout() {
            setTimeout(panoramaLayout.doLayout, 10);
        }

        isBackButtonVisible = has(options, 'canBack') && options.canBack;

        self = merge(options, {
            selectPage: selectPage,
            isBackButtonVisible: isBackButtonVisible,
            doLayout: doLayout
        });

        return self;
    }

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var options = valueAccessor(),
                myPanorama = panorama(options);

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
            wrapValueAccessor(valueAccessor),
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

