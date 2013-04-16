
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

    /*
    pivot: {
                pages: [{
                    header: 'My page 1',
                    contentHtml: '<h1>Test</h1>',
                    content: {},
                    contentTemplate: ''
                }],
                selectedPage: this.selectedPage
            }

    */

    /*jslint unparam: true*/
    function init(
        element,
        valueAccessor,
        allBindingsAccessor
    ) {
        var b = allBindingsAccessor(),
            opts = b.pivot,
            pages = opts.pages;

        registerBindings(pivotBindings);
        registerTemplates(pivotTemplate);

        //if user didn't give us an observable to store selectedPage then make our own
        if (!opts.selectedPage) {
            opts.selectedPage = observable(pages()[0]);
        }

        //if user provides empty observable for selectedPage then set it with the first one
        if (!opts.selectedPage()) {
            opts.selectedPage(pages()[0]);
        }

        ko.applyBindingsToNode(element, { template: 'pivot_template' }, opts);

        return { controlsDescendantBindings: true };
    }
    /*jslint unparam: false*/

    return {
        init: init
    };

});