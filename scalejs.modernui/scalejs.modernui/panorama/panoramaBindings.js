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
        'panorama-page-content': function (data) {
            return {
                render: this.renderer
                /*
                template: {
                    name: this.template,
                    afterRender: data.$parent.doLayout
                }*/
            };
        },
        'panorama-page-selectable': function (data) {
            return {
                click: data.$parent.selectPage
            };
        },
        'panorama-back-button' : function () {
            return {
                'click': this.goBack,
                'visible': this.isBackButtonVisible
            };
        }
    };

});

