/// <reference path="../scripts/_references.js" />
/*global console,define*/
/*jslint unparam: true*/define([
    './panoramaPage',
    'scalejs!core',
    'knockout'
], function (
    panoramaPage,
    core,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var merge = core.object.merge,
        has = core.object.has;
        //map = core.array.map,
        //observable = ko.observable,
        //computed = ko.computed,
        //isObservable = ko.isObservable,
        //unwrap = ko.utils.unwrapObservable

    function panorama(options, dataContext, previous) {
        var backButtonVisible = has(previous),
            thisPage = panoramaPage(merge(options, {isSelectable: true})),
            self;

        function goToPage(page) {
            var newPanorama;
            if (has(page.pages)) {
                newPanorama = panorama(page, dataContext, self);
                dataContext(newPanorama);
            }
        }

        function goBack() {
            if (has(previous)) {
                dataContext(previous);
            }
        }
        /*
        computed(function () {
            var opts = options(),
                page = selectedPage(),
                base = page || opts,
                actualPages = has(base, 'pages') ? unwrap(base.pages) : undefined,
                pages = has(actualPages) ? map(actualPages, panoramaPage) : [],
                panorama = merge(base, {
                });

            return panorama;
        });*/

        thisPage.isSelected(true);

        self = {
            title: options.title,
            goToPage: goToPage,
            goBack: goBack,
            backButtonVisible: backButtonVisible,
            pages: thisPage.pages
        };

        return self;
    }

    return panorama;
});
/*jslint unparam: false*/

