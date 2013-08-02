/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout,window*/
/*jslint unparam: true*/define([
    'scalejs!core',
    './panoramaBindings',
    'text!./panorama.html',
    './messageDialog',
    'jQuery',
    'knockout',
    'bPopup',
    'scalejs.mvvm',
    'dropdown'
], function (
    core,
    panoramaBindings,
    panoramaTemplate,
    messageDialog,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';
    var registerBindings = core.mvvm.registerBindings,
        registerTemplates = core.mvvm.registerTemplates,
        isObservable = ko.isObservable,
        unwrap = ko.utils.unwrapObservable,
        toEnumerable = core.linq.enumerable.from,
        has = core.object.has;

    function wrapValueAccessor(valueAccessor, element) {
        return function () {
            var panorama = valueAccessor();

            function setupSelectPage() {
                //triggered when clicked on header
                panorama.selectPage = panorama.selectPage || function (page) {
                    if (isObservable(panorama.selectedPage)) {
                        panorama.selectedPage(page);
                    }
                };
            }

            function setupPages() {
                //the user may or may not specify a pages observabl when specifying tiles...
                //if they don't, we need to make one since we layout tiles via pages.
                if (!has(panorama, 'pages')) {
                    panorama.pages = ko.observableArray();
                }
            }

            function setupTiles() {
                var pages;
                //group the tiles into pages, if there is no "group by" specified, we make a single page...
                function groupTilesToPages(tiles) {

                    if (!has(panorama, 'groupBy')) {
                        return [{ tiles: tiles }];
                    }

                    //straightforward linq grouping of tiles are passed to the pages...
                    return toEnumerable(tiles)
                        .groupBy(panorama.groupBy)
                        .select(function (tileGroup) {
                            return {
                                header: tileGroup.key(),
                                tiles: tileGroup.getSource()
                            };
                        })
                        .toArray();
                }

                if (has(panorama, 'tiles')) {
                    if (isObservable(panorama.tiles)) {
                        ko.computed({
                            read: function () {
                                pages = groupTilesToPages(unwrap(panorama.tiles));
                                panorama.pages(pages);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    } else {
                        pages = groupTilesToPages(unwrap(panorama.tiles));
                        panorama.pages(pages);
                    }
                }
            }

            function setupMessageDialog() {
                if (has(panorama, 'message')) {
                    if (!isObservable(panorama.message)) {
                        throw new Error('`message` property of panorama must be an observable');
                    }
                    panorama.messageOptions = messageDialog(panorama.message, element);
                }
            }

            setupSelectPage();
            setupPages();
            setupTiles();
            setupMessageDialog();

            panorama.loaded = ko.observable(false);

            return {
                name: 'panorama_template',
                data: panorama
            };
        };
    }

    function init(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        var panorama = valueAccessor(),
            unitWidth = panorama.unitWidth || 150,
            result = ko.bindingHandlers.template.update(
                element,
                wrapValueAccessor(valueAccessor, element),
                allBindingsAccessor,
                viewModel,
                bindingContext
            );

        function doLayout() {
            //TODO: query for this -> move outside of function (only needs to be done once)
            var pageRegionWidth = 120, //.page-region-content padding-left value
                $tilesContainers = $('.tiles-container');

            if ($tilesContainers.length > 0) {
                $tilesContainers.each(function (index, tileContainer) {
                    var context = ko.contextFor(tileContainer.children[0] || tileContainer).$parentContext,
                        page = has(context.$data.layout) ? context.$data : ko.contextFor(tileContainer).$data,
                        width = has(page.layout) ? page.layout(unitWidth) : 0;

                    pageRegionWidth += width + 80;

                    $(tileContainer).width(width);
                });

                pageRegionWidth += "px";
            } else {
                pageRegionWidth = "auto";
            }

            if (has(panorama.tiles()) && panorama.tiles().length > 0) {
                $('.page-region-content').css('width', pageRegionWidth);
            } else {
                $('.page-region-content').css('width', 'auto');
            }

            panorama.loaded(true);
        }

        ko.computed({
            read: function () {
                panorama.loaded(false);
                setTimeout(doLayout, 0);
                return unwrap(panorama.pages);
            },
            disposeWhenNodeIsRemoved: element
        });


        //TODO: why is setTimeout needed?
        $(window).resize(function () {
            setTimeout(doLayout, 0);
        });

        return result;
    }

    registerBindings(panoramaBindings);
    registerTemplates(panoramaTemplate);

    return {
        init: init
    };
});
/*jslint unparam: false*/

