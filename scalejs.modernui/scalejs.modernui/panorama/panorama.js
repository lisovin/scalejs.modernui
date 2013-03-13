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
    'scalejs.mvvm',
    'scalejs.effects-jqueryui'
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
        registerTemplates = core.mvvm.registerTemplates,
        isObservable = ko.isObservable;

    function panorama(options, element) {
        var has = core.object.has,
            merge = core.object.merge,
            //transitions,
            self;

        function selectPage(page) {
            if (isObservable(options.selectedPage)) {
                options.selectedPage(page);
            }
        }

        function doLayout() {
            // Do we need timeout here?
            setTimeout(panoramaLayout.doLayout, 10);
        }

        //function afterRender() {
            /*
            var panoramaDiv = ko.virtualElements.childNodes(element).filter(function (e) {
                return e.className && e.className.split(' ').indexOf("panorama") >= 0;
            })[0];

            transitions.bind(options.visualState, panoramaDiv);*/
        //    transitions.start();
        //}

        self = merge(options, {
            selectPage: selectPage,
            isBackButtonVisible: options.canBack,
            doLayout: doLayout
            //afterRender: afterRender
        });

        if (has(options, 'message')) {
            self.message = messageDialog(options.message, element);
        }
        /*
        transitions = transitionManager({
            visualState: options.visualState,
            element: element,
            inTransitions: [
                busy({
                    visualState: options.visualState,
                    shown: function () {
                        isInDom(true);
                    }
                }),
                slide()
            ],
            outTransitions: [
                fade()
            ]
        });*/

        return self;
    }

    function wrapValueAccessor(valueAccessor, element) {
        return function () {
            var options = valueAccessor(),
                myPanorama = panorama(options, element);

            return {
                name: 'panorama_template',
                data: myPanorama,
                afterRender: myPanorama.afterRender
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

