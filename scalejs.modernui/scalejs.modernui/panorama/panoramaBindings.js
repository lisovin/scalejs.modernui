﻿/// <reference path="../scripts/_references.js" />
/*global console,define*/
define([
    'knockout'
], function (ko) {
    var unwrap = ko.utils.unwrapObservable;

    return {
        'panorama-page': function () {
            return {
                css: this.css
            };
        },
        'panorama-page-region': function () {
            var pages = unwrap(this.pages);

            if (!pages || pages.length === 0) {
                return;
            }

            return {
                render: {
                    template: {
                        name: "panorama_page_template",
                        foreach: pages
                    },
                    transitions: this.transitions
                },
                attr: {
                    style: 'visibility:hidden'
                }
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
            function renderContent() {
                if (ctx.$data.contentTemplate || ctx.$parent.pageTemplate) {
                    return {
                        template: {
                            name: ctx.$data.contentTemplate || ctx.$parent.pageTemplate,
                            data: ctx.$data.content
                        }
                    };
                }

                return {
                    render: {
                        text: JSON.stringify(ctx.$data.content)
                    }
                };
            }

            if (!ctx.$data) {
                return;
            }

            if (this.content) {
                return renderContent();
            }

            // tiles
            if (this.tiles) {
                return {
                    tiles: {
                        data: this.tiles,
                        template: ctx.$parent.tileTemplate || 'sj_panorama_tile_template'
                    },
                    unitWidth: this.unitWidth,
                    pageHeight: this.pageHeight
                };
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
        'panorama-back-button': function () {
            return {
                click: this.goBack,
                visible: this.canBack
            };
        }
    };
});
