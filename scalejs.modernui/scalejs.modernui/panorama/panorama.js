/*global define, setTimeout */
define([
    './panoramaLayout',
    'scalejs!core',
    'knockout'
], function (
    layout,
    core,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    return function (options) {
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
            setTimeout(layout.doLayout, 10);
        }

        isBackButtonVisible = has(options, 'canBack') && options.canBack;

        self = merge(options, {
            selectPage: selectPage,
            isBackButtonVisible: isBackButtonVisible,
            doLayout: doLayout
        });

        return self;
    };
});
