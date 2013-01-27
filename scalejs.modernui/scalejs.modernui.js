/// <reference path="scripts/_references.js" />
/*global define,document*/
define([
    'scalejs.modernui/panorama',
    'jQuery',
    'knockout',
    'knockout.mapping'
], function (
    panorama,
    $,
    ko
) {
	/// <param name="$" value="window.$"/>
	/// <param name="ko" value="window.ko"></param> 
    'use strict';

    function addCss(cssUrl) {
        if (document.createStyleSheet) {
            document.createStyleSheet(cssUrl, 0);
        } else {
            $('head').prepend('<link rel="stylesheet" type="text/css" href="' + cssUrl + '" />');
        }
    }

    // Add stylesheets in the opposite order since we are using prepend to allow
    // the app overwrite styles
    addCss('css/panorama.css');
    addCss('css/theme-dark.css');
    addCss('css/modern.css');

    function buildCore(core) {
        var bindings = {
            'panorama-title': function () {
                return {
                    text: this.title
                };
            },
            'panorama-pages': function () {
                return {
                    foreach: this.pages
                };
            },/*
            'panorama-page': function () {
                return {
                    style: {
                        maxWidth: '1000'
                    }
                };
            },*/
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

        core.mvvm.registerBindings(bindings);

        ko.bindingHandlers.panorama = panorama;
    }

    return {
        dependencies: ['mvvm'],
        buildCore: buildCore
    };
});

