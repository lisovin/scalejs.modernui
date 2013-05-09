/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
    //'scalejs!core',
    'knockout'
], function (
    //core,
    ko
) {
    'use strict';

    var unwrap = ko.utils.unwrapObservable;

    return {
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
                if (ctx.$data.contentTemplate || ctx.$parent.pageTemplate) {
                    return {
                        template: {
                            name: ctx.$data.contentTemplate || ctx.$parent.pageTemplate,
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

            /*jslint unparam:true*/
            function renderTiles() {
                var tiles = unwrap(ctx.$data.tiles) || [],
                    tileTemplate = unwrap(ctx.$data.tileTemplate) || 'sj_panorama_tile_template',
                    lastTile = tiles[tiles.length - 1];
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

                        afterRender: function (nodes, item) {
                            if (item === lastTile) {
                                afterRender();
                            }
                        }
                    }
                };
            }
            /*jslint unparam:false*/

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

