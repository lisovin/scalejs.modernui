/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
    //'scalejs!core',
    './transitions',
    'knockout'
], function (
    //core,
    transitions,
    ko
) {
    'use strict';

    var unwrap = ko.utils.unwrapObservable,
        slide = transitions.slide,
        fade = transitions.fade,
        busy = transitions.busy;

    return {
        'transition-manager': function () {
            return {
                transitionManager: {
                    visualState: this.visualState,
                    inTransitions: [
                        busy({
                            visualState: this.visualState
                        }),
                        slide()
                    ],
                    outTransitions: [
                        fade()
                    ]
                }
            };
        },

        'panorama-pages': function () {
            return {
                foreach: this.pages
            };
        },
        'panorama-header-content': function () {
            if (this.headerTemplate) {
                return {
                    template: {
                        name: this.headerTemplate,
                        data: this.header
                    }
                };
            }

            return {
                template: {
                    name: 'panorama_header_default_template',
                    data: this.header
                }
            };
        },

        'panorama-page-content': function (ctx) {
            function afterRender() {
                ctx.$parent.doLayout();
            }

            function renderContent() {
                // non-tiles content
                if (ctx.$data.contentTemplate) {
                    return {
                        template: {
                            name: ctx.$data.contentTemplate,
                            data: ctx.$data.content,
                            afterRender: afterRender
                        }
                    };
                }

                return {
                    render: {
                        text: JSON.stringify(ctx.$data.content),
                        afterRender: afterRender
                    }
                };
            }

            function renderTiles() {
                var tiles = unwrap(ctx.$data.tiles) || [],
                    tileTemplate = unwrap(ctx.$data.tileTemplate) || 'sj_panorama_tile_template';
                /*
                    content = selectableArray(tiles, {
                        selectedItem: ctx.selectedTile,
                        selectionPolicy: 'deselect',
                        afterRender: afterRender
                    });*/

                return {
                    template: {
                        name: tileTemplate,
                        foreach: tiles,
                        afterRender: afterRender
                    }
                };
            }

            if (this.content) {
                return renderContent();
            }

            // tiles
            if (this.tiles) {
                return renderTiles();
            }

            // default
            return {
                text: ctx.$data
            };
        },

        'panorama-page-header': function () {
            return {
                text: this.header
            };
        },

        'panorama-page-selectable': function (data) {
            return {
                click: data.$parent.selectPage
            };
        },
        'panorama-back-button' : function () {
            return {
                click: this.goBack,
                visible: this.isBackButtonVisible
            };
        }
    };
});

