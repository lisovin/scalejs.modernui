/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
//    'scalejs!core',
    'knockout'
], function (
//    core,
    ko
) {
    /// <param name="ko" value="window.ko" />
    'use strict';

    var unwrap = ko.utils.unwrapObservable;

    return {
        'panorama-message': function (ctx) {
            var messageOptions = unwrap(ctx.$data.message);

            if (messageOptions) {
                return {
                    template: {
                        name: messageOptions.template,
                        data: messageOptions
                    }
                };
            }

        }
    };
});

