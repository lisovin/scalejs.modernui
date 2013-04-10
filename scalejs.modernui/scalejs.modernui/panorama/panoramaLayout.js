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

    function calcGroupWidth($group) {
        var $tiles = $group.find('.tile'),
            $groupHeight,
            maxWidth = 0,
            i,
            m,
            l,
            r,
            rightEdge;

        //console.log('Calculating width of ' + $group.find('.subtitle').html());

        // deal with the case when there's no tiles
        if ($tiles.length === 0) {
            return $group.width();
        }
        /*jslint unparam:true*/
        $tiles.each(function (index, tile) {
            var tw = tileWidth($(tile));

            if (tw > maxWidth) {
                maxWidth = tw;
            }
        });
        /*jslint unparam:false*/

        // initial values
        l = 0;
        r = $tiles.toArray().reduce(function (acc, t) {
            return acc + tileWidth($(t));
        }, 0);
        //console.log('r: ' + r);
        //console.log('l: ' + l);
        //console.time('suspicious loop');
        while (r - l > 161) {
            m = (l + r) / 2;
            //console.time('set css');
            $group.css({
                'width': m
            });
            //console.timeEnd('set css');
            //console.time('get height');
            $groupHeight = $group.height();
            //console.timeEnd('get height');
            if ($groupHeight < maxGroupHeight) {
                r = m;
            } else {
                l = m;
            }
            //find tile most right in first row
            //take right corner
            //
            //console.log('groupHeight: ' + $groupHeight);
            //console.log('r: ' + r);
            //console.log('l: ' + l);
            //console.log('loop');
        }
        //console.timeEnd('suspicious loop');
        //console.log('m: ' + m);
        $group.css({
            'width': r
        });
        i = 0;
        while (i < $tiles.length - 1 && $tiles.eq(i).position().left < $tiles.eq(i + 1).position().left) {
            i += 1;
        }
        // replace this:
        //for (i = 0; i < $tiles.length - 1 && $tiles.eq(i).position().left < $tiles.eq(i + 1).position().left; 
        //i += 1) {
        //}

        //console.log('index: ' + i);

        rightEdge = $tiles.eq(i).position().left + tileWidth($tiles.eq(i)) - $tiles.eq(0).position().left;

        //console.log('rightEdge: ' + rightEdge);

        $group.css({
            'width': rightEdge
        });

        return rightEdge;
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

            groupsWidth += groupWidth + 80;
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