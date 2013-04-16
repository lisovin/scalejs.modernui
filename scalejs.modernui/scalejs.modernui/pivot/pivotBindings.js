/// <reference path="../scripts/_references.js" />
/*global console,define*/
/*jslint unparam: true*/
define(['scalejs!core'], function (core) {
    'use strict';

    return {
        'pages': function () {
            return {
                foreach: this.pages
            };
        },
        'page-header-css': function (context) {
            //context.$parent should be array of pages (this.pages)
            //context.parentContext.$parent should be options given to binding || $root
            return {
                css: context.$root.selectedPage() === this ? 'active' : '',
                click: function () {
                    context.$root.selectedPage(this);
                }
            };
        },
        'page-content-html-css': function (context) {
            //context.$parent should be array of pages (this.pages)
            //context.parentContext.$parent should be options given to binding || $root
            var binding = { css: context.$root.selectedPage() === this ? 'frame active' : 'frame' };

            if (this.contentHtml) {
                binding.html = this.contentHtml;
            } else {
                binding.template = { name: this.contentTemplate, foreach: this.content };
            }

            return binding;
        }
    };
});

