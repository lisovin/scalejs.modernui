/*global define, setTimeout */
define([
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    return function (options) {
        var observableArray = ko.observableArray,
            observable = ko.observable,
            computed = ko.computed,
            unwrap = ko.utils.unwrapObservable,
            merge = core.object.merge,
            has = core.object.has,
            is = core.type.is,
            pages = observableArray(),
            isSelected = observable(false),
            pagesOrLoader = options.pages,
            page;

        delete options.pages;

        page = merge({
            title: '',
            template: 'panorama_default_template',
            isSelected: isSelected,
            pages: pages
        }, options);

        if (has(pagesOrLoader)) {
            computed(function () {
                if (isSelected()) {
                    // pagesOrLoader can be either a function that returns an array of pages,
                    // or an (observable) array of pages. Handle accordingly all possible cases
                    var actualPagesOrLoader  = unwrap(pagesOrLoader);
                    if (is(actualPagesOrLoader, 'function')) {
                        actualPagesOrLoader(pages);
                    } else if (is(actualPagesOrLoader, 'array')) {
                        pages(actualPagesOrLoader);
                    } else if (has(actualPagesOrLoader)) {
                        pages([actualPagesOrLoader]);
                    } else {
                        pages(undefined);
                    }
                }
            });
        }

        return page;
    };
});
