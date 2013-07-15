/// <reference path="../scripts/_references.js" />
/*global console,define*/
define(['scalejs!core'], function (core) {
    'use strict';

    var get = core.object.get;

    return {
        'panorama-tile': function (ctx) {
            var unitWidth = ctx.$parentContext.$parentContext.$parent.unitWidth
            return {
                style: {
                    width: this.width * unitWidth - 10,
                    height: this.height * unitWidth - 10,
                    position: 'absolute',
                    backgroundColor: this.color
                },
                css: 'bg-color-' + this.bgColor,
                click: this.selectTile
            };
        },

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

