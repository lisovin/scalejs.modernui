/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './messageDialogBindings',
    'jQuery',
    'knockout',
    'bPopup'
], function (
    core,
    messageDialogBindings,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var registerBindings = core.mvvm.registerBindings,
        // members
        popupOpts,
        popup; // only one popup per panorama

    registerBindings(messageDialogBindings);

    return function messageDialog(panorama, messageOptions, element) {
        var unwrap = ko.utils.unwrapObservable,
            computed = ko.computed;
            //observable = ko.observable;

        computed({
            read: function () {
                var opts = unwrap(messageOptions);

                if (opts) {
                    if (!popup) {
                        popupOpts = {
                            positionStyle: 'fixed',
                            modalClose: false,
                            opacity: 0.4,
                            onClose: function () {
                                // timeout to give popup a chance to close first so that default
                                // popup options (e.g. css) isn't shown
                                setTimeout(function () {
                                    // set popup to null before close caused by messageOptions update
                                    // to undefined is invoked. No need to close popup twice.
                                    popup = null;
                                    messageOptions(undefined);
                                }, 0);
                            }
                        };

                        popup = $('#panorama-message').bPopup(popupOpts);
                    }
                    // Popup close button click is bound to onClose
                    opts.onClose = function () {
                        popup.close();
                    };
                }
            },
            disposeWhenNodeIsRemoved: element
        });
    };
});
/*jslint unparam: false*/

