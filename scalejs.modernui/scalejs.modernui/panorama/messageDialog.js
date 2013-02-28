/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
define([
    'scalejs!core',
    './messageDialogBindings',
    'jQuery',
    'knockout',
    'bPopup',
    'scalejs.statechart-scion'
], function (
    core,
    messageDialogBindings,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var registerBindings = core.mvvm.registerBindings,
        statechart = core.state.builder.statechart,
        state = core.state.builder.state,
        get = core.object.get;

    registerBindings(messageDialogBindings);

    return function messageDialog(messageOptions, element) {
        var unwrap = ko.utils.unwrapObservable,
            computed = ko.computed,
            merge = core.object.merge,
            popupStatechart;

        function createPopup(opts) {
            var spec = merge({
                positionStyle: 'fixed',
                modalClose: true,
                opacity: 0.4,
                onClose: function () { popupStatechart.send('closed'); }
            }, opts);

            return $('#panorama-message').bPopup(spec);
        }

        popupStatechart = statechart(
            state('popup',
                // Popup closed
                state('closed')
                .on('showing.dialog').goto('dialog')
                .on('showing.bar').goto('bar')
                .on(function () { return this.isShowDialogPending; }).goto('dialog')
                .on(function () { return this.isShowBarPending; }).goto('bar'),

                // Popup shown
                state('shown',
                    // Message bar
                    state('bar')
                    .onEntry(function () {
                        this.isShowBarPending = false;
                        this.popup = createPopup({
                            position: [0, 0],
                            modal: false
                        });
                    })
                    .on('showing.dialog').goto(function () {
                        this.isShowDialogPending = true;
                        this.raise({name: 'closing'});
                    }),

                    // Message dialog
                    state('dialog')
                    .onEntry(function () {
                        this.isShowDialogPending = false;
                        this.popup = createPopup({
                            position: [0, 'auto'],
                            modal: true
                        });
                    })
                    .on('showing.bar').goto('bar', function () {
                        this.isShowBarPending = true;
                        this.raise({name: 'closing'});
                    }))
                .on('closing').goto(function () { this.popup.close(); })
                .on('closed').goto('closed'))
        );

        popupStatechart.start();

        return computed({
            read: function () {
                var opts = unwrap(messageOptions),
                    result = merge({
                        css: '',
                        contentCss: 'span10',
                        buttonsCss: null,
                        title: null,
                        content: null,
                        buttons: [],
                        template: get(opts, 'critical', false)
                            ? 'panorama_message_dialog_template' : 'panorama_message_bar_template'
                    }, opts);

                result.contentCss = 'span' + (10 - Math.ceil(3 * result.buttons.length / 2));
                result.buttonsCss = 'span' + Math.ceil(3 * result.buttons.length / 2);
                result.buttons.forEach(function (b) {
                    var delegate = b.action;
                    b.action = function () {
                        popupStatechart.send('closing');
                        delegate();
                    };
                });

                if (opts) {
                    popupStatechart.send(opts.critical ? 'showing.dialog' : 'showing.bar');
                } else {
                    popupStatechart.send('closing');
                }

                return result;
            },
            disposeWhenNodeIsRemoved: element
        });
    };
});

