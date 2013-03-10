/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {
    'use strict';

    var has = core.object.has,
        unwrap = ko.utils.unwrapObservable,
        selectableArray = core.mvvm.selectableArray,
        renderable = core.mvvm.renderable;

    return {
        'panorama-pages': function () {
            return {
                foreach: this.pages
            };
        },
        'panorama-header-content': function () {
            if (has(this, 'header', 'template')) {
                return {
                    render: this.header
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
                var content = unwrap(ctx.$data.content);
                if (content) {
                    content.afterRender = afterRender;
                }

                return {
                    render: content
                };
            }

            function renderTiles() {
                var tiles = unwrap(ctx.$data.tiles) || [],
                    tileTemplate = unwrap(ctx.$data.tileTemplate) || 'sj_panorama_tile_template',
                    renderableTiles = tiles.map(renderable(tileTemplate)),
                    content = selectableArray(renderableTiles, {
                        selectedItem: ctx.selectedTile,
                        selectionPolicy: 'deselect'
                    });
                content.afterRender = afterRender;

                return {
                    render: content
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

