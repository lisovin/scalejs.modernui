/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './panorama',
    './panoramaBindings',
    'text!./panorama.html',
    'jQuery',
    'knockout'
], function (
    core,
    panorama,
    panoramaBindings,
    panoramaTemplate,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates;

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var options = valueAccessor(),
                myPanorama = panorama(options);

            return {
                name: 'scalejs_panorama_template',
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

