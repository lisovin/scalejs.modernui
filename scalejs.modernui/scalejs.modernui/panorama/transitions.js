/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    'jQuery',
    'knockout',
    'bPopup',
    'scalejs.statechart-scion'
], function (
    core,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var animate = core.effects.animate,
        show = core.effects.show,
        hide = core.effects.hide;

    function render() {
        return function render(complete) {
            this.renderChild();
            complete();
        };
    }

    function busy(opts) {
        var popup;

        return function (complete) {
            var renderChild = this.renderChild,
                subscription;

            subscription = opts.visualState.subscribe(function (newValue) {
                if (newValue === 'busy.closing') {
                    // Since rendering can take a long time - render it before closing popup
                    renderChild();

                    if (popup) {
                        popup.close();
                        popup = null;
                    }

                    subscription.dispose();
                }
            });

            if (!popup) {
                popup = $('#panorama-loading').bPopup({
                    positionStyle: 'fixed',
                    speed: 0,
                    modal: true,
                    modalClose: false,
                    opacity: 0,
                    onOpen: function () {
                        // onOpen fires right begore popup is open so scheduler visualState 
                        setTimeout(function () {
                            opts.visualState('busy.shown');
                        }, 0);
                    },
                    onClose: function () {
                        complete();
                    }
                });

            }
        };
    }

    function slide(opts) {
        return function (complete) {
            var element = this.element;

            animate(element, {
                opacity: 0,
                left: 300
            }, {
                duration: 0,
                done: function () {
                    show(element);
                    setTimeout(function () {
                        animate(element, {
                            opacity: 1,
                            left: 0
                        }, {
                            duration: 400,
                            complete: complete
                        });
                    }, 100);
                }
            });
        };
    }

    function fade(opts) {
        return function (complete) {
            hide(this.element, {
                effect: 'fade',
                duration: 300,
                visibility: 'hidden',
                complete: complete
            });
        };
    }

    return {
        busy: busy,
        fade: fade,
        slide: slide,
        render: render
    };
});
/*jslint unparam: false*/

