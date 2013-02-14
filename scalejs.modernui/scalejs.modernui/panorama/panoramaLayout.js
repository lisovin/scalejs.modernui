/*global define,window,document,clearTimeout,setTimeout*/
define(['jQuery'], function ($) {
    'use strict';

    var $startMenu,
        maxGroupHeight,
        resizeTimer;

    function subscribeScroll() {
        /*jslint unparam: true*/
        $("body").scroll(function (event, delta) {
            var scroll_value = delta * 50;
            if ($.browser.webkit) {
                this.scrollLeft -= scroll_value;
            } else {
                document.documentElement.scrollLeft -= scroll_value;
            }
            return false;
        });
        /*jslint unparam: false*/
    }

    /**
        * called on init 
        * and on resize window
        * and any tiles moves
        */
    function tileWidth($tile) {
        var result = 161;

        if ($tile.hasClass('double')) {
            result = 322;
        } else if ($tile.hasClass('triple')) {
            result = 483;
        } else if ($tile.hasClass('quadro')) {
            result = 644;
        }

        return result;
    }

    function tuneUpStartMenu() {
        var $groups = $startMenu.find('.tile-group'),
            groupsWidth = 0;

        if ($groups.length === 0) {
            return;
        }

        maxGroupHeight = $(window).height() - $($groups.get(0)).offset().top;

        /*jslint unparam: true*/
        $groups.each(function (index, group) {
            var $group = $(group),
            // finding min width for group
                groupWidth = 0,
                $tiles = $group.find('.tile'),
                counter,
                $groupHeight,
                groupHeight;

            if ($tiles.length === 0) {
                // if no tiles set max-width to "optimal" width
                groupsWidth += $group.width() + 80;
                return;
            }
            // finding min width according to the widest tile
            $tiles.each(function (index, tile) {
                var tw = tileWidth($(tile));

                if (tw > groupWidth) {
                    groupWidth = tw;
                }
            });
            /*jslint unparam: false*/

            $group.css({
                width: 'auto',
                maxWidth: groupWidth
            });

            $groupHeight = $group.height();
            while ($groupHeight > maxGroupHeight) {
                if (counter > $tiles.length) { // protection from endless loop
                    break;
                } else if ($groupHeight === groupHeight) {
                    counter += 1;
                } else {
                    counter = 1;
                }
                groupHeight = $groupHeight;
                groupWidth += tileWidth($($tiles[counter]));
                $group.css({
                    'maxWidth': groupWidth
                });
                $groupHeight = $group.height();
                groupsWidth += groupWidth + 80;
            }
        });

        if (groupsWidth > 0) {
            $startMenu.css("width", 120 + groupsWidth + 20);
        }
    }

    function subscribeResize() {
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                tuneUpStartMenu();
            }, 200);
        });
    }

    function init() {
        subscribeScroll();
        subscribeResize();
    }

    function doLayout() {
        $startMenu = $('.tiles');
        tuneUpStartMenu();
    }

    init();

    return {
        doLayout: doLayout
    };
});