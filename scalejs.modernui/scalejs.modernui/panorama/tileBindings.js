/// <reference path="../scripts/_references.js" />
/*global console,define*/
define(['scalejs!core'], function (core) {
    'use strict';

    var get = core.object.get;

    return {
        'panorama-tile': function () {
            function dimensionCss(n, suffix) {
                if (n === 2) { return 'double' + suffix; }
                if (n === 3) { return 'triple' + suffix; }
                if (n === 4) { return 'quadro' + suffix; }
            }

            function widthCss(n) {
                return dimensionCss(n, '');
            }

            function heightCss(n) {
                return dimensionCss(n, '-vertical');
            }

            var classes = [
                    widthCss(this.width),
                    heightCss(this.height),
                    this.bgColor ? 'bg-color-' + this.bgColor : undefined,
                    this.selected() ? 'selected' : undefined
                ],
                css = classes
                    .filter(function (css) { return css; })
                    .reduce(function (classes, css) { return classes + ' ' + css; });

            return {
                css: css
            };
        },
        /*
        'panorama-tile-content': function (context) {
            if (has(context, '$data', 'content')) {
                return {
                    template: {
                        name: 'sj_panorama_tile_content_template',
                        data: context.$data.content
                    }
                };
            }
        },*/

        'panorama-tile-content': function (context) {
            return {
                template: {
                    name: get(context,
                              '$data.contentTemplate',
                              'sj_panorama_tile_content_default_html_template'),
                    data: context.$data.content
                }
            };
        },

        'panorama-tile-content-default-html': function (context) {
            return {
                text: JSON.stringify(context.$data)
            };
        },

        'panorama-tile-brand-css': function () {
            var css = this.bgColor ? 'bg-color-' + this.brandBgColor : undefined;

            return {
                css: css
            };
        },

        'panorama-tile-brand-icon': function () {
            return {
                attr: {
                    src: this.brandIcon
                }
            };
        },

        'panorama-tile-brand-name': function () {
            return {
                text: this.brandName
            };
        },

        'panorama-tile-brand-html': function () {
            return {
                html: this.brandHtml
            };
        },
        'panorama-tile-brand-badge': function () {
            return {
                html: this.brandBadge
            };
        }
    };
});

