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
                render: this.content
                // _TODO: call layout of panorama after render is done
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

