/*global define,window,document,clearTimeout,setTimeout*/
define(['jQuery'], function ($) {
    'use strict';

    var $panorama,
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

    function findMinWidth($tiles) {
        var groupWidth = 0;

        if ($tiles.length === 0) {
            return -1;
        }
        // finding min width according to the widest tile
        /*jslint unparam:true*/
        $tiles.each(function (index, tile) {
            var tw = tileWidth($(tile));

            if (tw > groupWidth) {
                groupWidth = tw;
            }
        });
        /*jslint unparam:false*/
        return groupWidth;
    }

    function calcGroupWidth($group) {
        var $tiles = $group.find('.tile'),
            groupWidth = findMinWidth($tiles, $group),
            $groupHeight,
            i,
            tw;

        // deal with the case when there's no tiles
        if (groupWidth === -1) {
            return $group.width() + 80;
        }
        /*jslint unparam: false*/

        $group.css({
            width: 'auto',
            maxWidth: groupWidth
        });

        $groupHeight = $group.height(); //get current height

        for (i = 1; i < $tiles.length && $groupHeight > maxGroupHeight; i += 1) {
            tw = tileWidth($($tiles[i])); //get next tile
            groupWidth += tw;   //append it to the top row
            $group.css({    //set the css
                'maxWidth': groupWidth
            });
            $groupHeight = $group.height(); //get the new height
        }

        return groupWidth + 80;
    }

    function tuneUpStartMenu() {
        if (!$panorama) {
            return;
        }

        var $groups = $panorama.find('.tile-group'),
            groupsWidth = 0;

        if ($groups.length === 0) {
            return;
        }

        maxGroupHeight = $(window).height() - $($groups.get(0)).offset().top;

        /*jslint unparam: true*/
        $groups.each(function (index, group) {
            var $group = $(group),
                groupWidth = calcGroupWidth($group);

            groupsWidth += groupWidth;
        });

        if (groupsWidth > 0) {
            $panorama.css("width", 120 + groupsWidth + 20);
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
        $panorama = $('.tiles');
        tuneUpStartMenu();
    }

    init();

    return {
        doLayout: doLayout
    };
});