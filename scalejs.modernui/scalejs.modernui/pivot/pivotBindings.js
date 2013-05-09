/// <reference path="../scripts/_references.js" />
/*global console,define*/
/*jslint unparam: true*/
define(['scalejs!core'], function (core) {
    'use strict';

    return {
        'pivot': function (context) {
            return {
                css: context.$data.pivotWidth ? 'page-control span' + context.$data.pivotWidth : 'page-control span8'
            };
        },
        'pages': function (context) {
            return {
                foreach: context.$data.pivotItems
            };
        },
        'pages-content': function (context) {
            return {
                foreach: context.$data.pivotItems,
                style: context.$data.pivotContentCss
            };
        },
        'page-header-css': function (context) {
            //context.$parent should be array of pages (context.$data.pages)
            //context.parentContext.$parent should be options given to binding || $root
            return {
                css: context.$root.selectedPivotItem() === context.$data ? 'active' : '',
                click: function () {
                    context.$root.selectedPivotItem(context.$data);
                }
            };
        },
        'page-content-html-css': function (context) {
            //context.$parent should be array of pages (context.$data.pages)
            //context.parentContext.$parent should be options given to binding || $root
            var binding = { css: context.$root.selectedPivotItem() === context.$data ? 'frame active' : 'frame' };

            if (context.$data.contentHtml) {
                binding.html = context.$data.contentHtml;
            } else {
                binding.template = { name: context.$data.contentTemplate, foreach: context.$data.content };
            }

            return binding;
        }
    };
});

