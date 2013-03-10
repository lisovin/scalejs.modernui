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
        builder = core.state.builder.builder({ logStatesEnteredAndExited: true }),
        statechart = builder.statechart,
        state = builder.state,
        animate = core.effects.animate,
        show = core.effects.show,
        hide = core.effects.hide,
        unwrap = ko.utils.unwrapObservable,
        isObservable = ko.isObservable,
        computed = ko.computed;
        //is = core.type.is;

    function visualStateManager(options) {
        var self,
            loadingPopup,
            panoramaDiv;

        function afterRender(element) {
            panoramaDiv = ko.virtualElements.childNodes(element).filter(function (e) {
                return e.className && e.className.split(' ').indexOf("panorama") >= 0;
            })[0];
        }

        function showLoadingPopup() {
            if (!loadingPopup) {
                loadingPopup = $('#panorama-loading').bPopup({
                    positionStyle: 'fixed',
                    speed: 0,
                    modal: true,
                    modalClose: false,
                    opacity: 0
                });
            }
        }

        function closeLoadingPopup() {
            if (loadingPopup) {
                loadingPopup.close();
                loadingPopup = null;
            }
        }

        function animateShowing(complete) {
            animate(panoramaDiv, {
                opacity: 0,
                left: 300
            }, {
                duration: 0,
                done: function () {
                    show(panoramaDiv);
                    setTimeout(function () {
                        animate(panoramaDiv, {
                            opacity: 1,
                            left: 0
                        }, {
                            duration: 400,
                            complete: complete
                        });
                    }, 100);
                }
            });
        }

        function animateHiding(complete) {
            hide(panoramaDiv, {
                effect: 'fade',
                duration: 300,
                visibility: 'hidden',
                complete: complete
            });
        }

        function onLoading() {
            showLoadingPopup();
        }

        function onShowing(raiseLater) {
            closeLoadingPopup();
            animateShowing(function () {
                raiseLater('shown');
            });
        }

        function onHiding(raiseLater) {
            animateHiding(function () {
                raiseLater('hidden');
            });
        }

        function onExiting(raiseLater) {
            animateHiding(function () {
                raiseLater('exited');
            });
        }

        self = {
            afterRender: afterRender,
            onLoading: onLoading,
            onShowing: onShowing,
            onHiding: onHiding,
            onExiting: onExiting
        };

        return self;
    }

    function panorama(options, element) {
        var has = core.object.has,
            merge = core.object.merge,
            panoramaStatechart,
            vsm,
            self;

        function selectPage(page) {
            if (isObservable(options.selectedPage)) {
                options.selectedPage(page);
            }
        }

        function doLayout() {
            setTimeout(panoramaLayout.doLayout, 10);
        }

        function afterRender() {
            vsm.afterRender(element);
            panoramaStatechart.start();
            if (isObservable(options.visualState)) {
                computed({
                    read: function () {
                        var state = unwrap(options.visualState);

                        if (state === 'showingLoading') {
                            panoramaStatechart.send('hiding', { afterHidden: 'loading' });
                            return;
                        }

                        if (state === 'loaded') {
                            panoramaStatechart.send('loaded');
                            return;
                        }

                        if (state === 'exiting') {
                            panoramaStatechart.send('exiting');
                            return;
                        }
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }
        }

        function updateVisualState(newState) {
            // update visual state later (to make sure we are not in statechart step)
            if (isObservable(options.visualState)) {
                setTimeout(function () {
                    options.visualState(newState);
                }, 0);
            }
        }

        self = merge(options, {
            selectPage: selectPage,
            isBackButtonVisible: options.canBack,
            doLayout: doLayout,
            afterRender: afterRender
        });

        if (has(options, 'message')) {
            self.message = messageDialog(options.message, element);
        }

        /*jslint white:true*/
        panoramaStatechart = statechart(
            state('panorama',
                // Hidden
                state('hidden')
                    .onEntry(function () {
                        updateVisualState('hidden');
                     })
                     .onExit(function () {
                         delete this.afterHidden;
                     })
                     .on('loading').goto('loading')
                     .on('hiding', function (e) { return e.data.afterHidden === 'loading'; }).goto('loading')
                     .on(function () { return this.afterHidden === 'loading'; }).goto('loading')
                     .on(function () { return this.afterHidden === 'showing'; }).goto('showing')
                     .on('loaded').goto('showing'),

                // Loading 
                state('loading')
                    .onEntry(function () {
                        vsm.onLoading();
                        updateVisualState('shownLoading');
                     })
                     .on('loaded').goto('showing'),

                // Showing
                state('showing')
                    .onEntry(function () {
                        vsm.onShowing(this.send.bind(this));
                    })
                    .on('shown').goto('shown'),

                // Shown
                state('shown')
                    .on('hiding').goto('hiding', function (e) {
                        this.afterHidden = e.data.afterHidden;
                    })
                    .on('loading').goto('loading')
                    .on('exiting').goto('exiting'),

                // Hiding
                state('hiding')
                    .onEntry(function () {
                        vsm.onHiding(this.send.bind(this));
                    })
                    .on('hidden').goto('hidden'),

                // Exiting
                state('exiting')
                    .onEntry(function () {
                        vsm.onExiting(this.send.bind(this));
                    })
                    .on('exited').goto('exited'),
                    
                // Exited
                state('exited')
                    .onEntry(function () {
                        updateVisualState('exited');
                    }))
        );
        /*jslint white:false*/

        vsm = visualStateManager(options, panoramaStatechart);

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

