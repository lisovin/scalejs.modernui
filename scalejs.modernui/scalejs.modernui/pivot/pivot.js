
/*global define,console*/
/*jslint unparam: true*/
define([
    'scalejs!core',
    './pivotBindings',
    'text!./pivot.html',
    'jQuery',
    'knockout',
    'scalejs.mvvm'
], function (
    core,
    pivotBindings,
    pivotTemplate,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates,
        observable = ko.observable;

    /*jslint unparam: true*/
    function init(
        element,
        valueAccessor,
        allBindingsAccessor
    ) {
        var b = allBindingsAccessor(),
            opts = b.pivot,
            pivotItems = opts.pivotItems;

        registerBindings(pivotBindings);
        registerTemplates(pivotTemplate);

        //if user didn't give us an observable to store selectedPage then make our own
        if (!opts.selectedPivotItem) {
            opts.selectedPivotItem = observable(pivotItems()[0]);
        }

        //if user provides empty observable for selectedPage then set it with the first one
        if (!opts.selectedPivotItem()) {
            opts.selectedPivotItem(pivotItems()[0]);
        }

        ko.applyBindingsToNode(element, { template: 'pivot_template' }, opts);

        return { controlsDescendantBindings: true };
    }
    /*jslint unparam: false*/

    return {
        init: init
    };

});