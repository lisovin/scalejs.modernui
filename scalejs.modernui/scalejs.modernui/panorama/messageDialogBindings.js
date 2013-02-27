/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {
    /// <param name="ko" value="window.ko" />
    'use strict';

    var get = core.object.get,
        unwrap = ko.utils.unwrapObservable,
        observable = ko.observable;

    return {
        'panorama-message-css': function (ctx) {
            var messageOptions = unwrap(get(ctx, '$data.message', observable())),
                css;

            switch (get(messageOptions, 'kind', 'info')) {
            case 'error':
                css = 'error-bar';
                break;
            case 'warning':
                css = 'warning-bar';
                break;
            case 'info':
                css = 'info-bar';
                break;
            default:
                css = 'info-bar';
            }

            return {
                css: css
            };
        }
    };
});

