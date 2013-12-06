/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout,window*/
/*jslint unparam: true*/
define([
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
       merge = core.object.merge,
       isObservable = ko.isObservable,
       unwrap = ko.utils.unwrapObservable,
       toEnumerable = core.linq.enumerable.from,
       has = core.object.has;

    function wrapValueAccessor(valueAccessor, element, layout) {
        return function () {
            var panorama = valueAccessor(),
                tilesSubscription;

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

                    if (tiles === undefined) {
                        return undefined
                    }

                    if (!has(panorama, 'groupBy')) {
                        return [{ tiles: tiles }];
                    }

                    //straightforward linq grouping of tiles are passed to the pages...
                    return toEnumerable(tiles)
                        .groupBy(panorama.groupBy)
                        .select(function (tileGroup) {
                            return {
                                header: tileGroup.key(),
                                tiles: tileGroup.getSource(),
                                unitWidth: panorama.unitWidth
                            };
                        })
                        .toArray();
                }

                if (has(panorama, 'tiles')) {
                    if (isObservable(panorama.tiles)) {
                        tilesSubscription = panorama.tiles.subscribe(function (tiles) {
                            var pages = groupTilesToPages(unwrap(panorama.tiles));
                            if (has(pages)) {
                                if (pages.length > 0) {
                                    panorama.pages(pages);
                                } else {
                                    //throw "Tiles array must not be empty."
                                }
                            }
                        });

                        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                            tilesSubscription.dispose();
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

            function setupTransitions() {
                if (has(panorama.transitions, 'inTransitions')) {
                    panorama.transitions.inTransitions.unshift(layout);
                } else {
                    panorama.transitions = merge(panorama.transitions, {
                        inTransitions: [layout]
                    });
                }
            }

            setupSelectPage();
            setupPages();
            setupTiles();
            setupMessageDialog();
            setupTransitions();

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
            pages = panorama.pages,
            unitWidth = panorama.unitWidth || 140,
            redoLayout,
            calculateWidth,
            result,
            layout;

        function doLayout(isLayedOut) {
            return function () {
                var pageRegionWidth = 120, //.page-region-content padding-left value
                    $tilesContainers = $('.tiles-container'),
                    layoutWidth = isLayedOut ? 'width' : 'layout';

                // layoutWidth is a property of the page which is eiter set to 'layout' or 'width'.
                // if the page has already been layed out we only need to find the width,
                // however if the page has not been layed out (IE on resize) we need to relayout the page.
                if ($tilesContainers.length > 0) {
                    $tilesContainers.each(function (index, tileContainer) {
                        var context = ko.contextFor(tileContainer.children[0] || tileContainer).$parentContext,
                            page = has(context.$data[layoutWidth]) ? context.$data : ko.contextFor(tileContainer).$data,
                            width = has(page[layoutWidth]) ? page[layoutWidth]() : 0;

                        pageRegionWidth += width + 80;

                        $(tileContainer).width(width);
                    });

                    pageRegionWidth += "px";
                } else {
                    pageRegionWidth = "auto";
                }

                if (has(panorama.tiles) && panorama.tiles().length > 0) {
                    $('.page-region-content').css('width', pageRegionWidth);
                } else {
                    if (pageRegionWidth === "auto") {   //parseInt("auto") = NaN and messes up the layout
                        $('.page-region-content').width(120 + $('.tile-group').toArray().reduce(function (acc, x) { return acc + 80 + $(x).width(); }, 0));
                    } else {
                        $('.page-region-content').width(Math.max(120 + $('.tile-group').toArray().reduce(function (acc, x) { return acc + 80 + $(x).width(); }, 0), parseInt(pageRegionWidth)) + 80 + 'px');
                    }
                }
                $('.page-region-content').css('visibility', 'visible');
            };
        }

        redoLayout = doLayout(false);
        calculateWidth = doLayout(true);

        layout = function (complete) {
            calculateWidth();
            complete();
        };

        //TODO: why is setTimeout needed?
        $(window).resize(function () {
            setTimeout(redoLayout, 0);
        });

        ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor, element, layout),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
        //return result;
    }

    registerBindings(panoramaBindings);
    registerTemplates(panoramaTemplate);

    return {
        update: init
    };
});
/*jslint unparam: false*/

