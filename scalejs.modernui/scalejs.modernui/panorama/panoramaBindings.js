/// <reference path="../scripts/_references.js" />
/*global console,define*/
define(function () {
    'use strict';

     return {
        'panorama-title': function () {
            return {
                text: this.title
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
        'panorama-page-title': function () {
            return {
                text: this.title
            };
        }
    };

});

