/// <reference path="../scripts/_references.js" />
/*global console,define*/
define(function () {
    'use strict';

    return {
        'title': function () {
            return {
                text: this.title
            };
        },
        'subtitle': function () {
            return {
                text: 'My subtitle'
            };
        },
        'panorama-pages': function () {
            return {
                foreach: this.pages
            };
        },
        'panorama-page-content': function () {
            return {
                template: {
                    name: this.template
                }
            };
        },
        'selectable': function (data) {
            return {
                click: data.$parent.selectPage
            };
        },
        'selected-page' : function () {
            return {
                'with': this.selectedPage
            }
        }
    };

});

