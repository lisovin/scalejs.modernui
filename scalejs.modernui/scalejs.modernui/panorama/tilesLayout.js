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

    function setPageWidth() {
        var tilesWidth = 0;

        $startMenu.find(".tile-group").each(function () {
            tilesWidth += $(this).outerWidth() + 80;
        });

        $startMenu.css("width", 120 + tilesWidth + 20);

        $(".page").css('width', '').css({
            width: $(document).width()
        });
    }

    /**
        * called on init 
        * and on resize window
        * and any tiles moves
        */
    function tuneUpStartMenu() {
        var $groups = $startMenu.find('.tile-group');
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
                return;
            }
            // finding min width according to the widest tile
            $tiles.each(function (index, tile) {
                var $tile = $(tile),
                    tileWidth = 161;

                if ($tile.hasClass('double')) {
                    tileWidth = 322;
                } else if ($tile.hasClass('triple')) {
                    tileWidth = 483;
                } else if ($tile.hasClass('quadro')) {
                    tileWidth = 644;
                }

                if (tileWidth > groupWidth) {
                    groupWidth = tileWidth;
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
                groupWidth += 161;
                $group.css({
                    'maxWidth': groupWidth
                });
                $groupHeight = $group.height();
            }
        });

        setPageWidth();
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

    function reset(element) {
        $startMenu = $(element).find('.tiles');
        setPageWidth();
        tuneUpStartMenu();
    }

    init();

    return {
        reset: reset
    };
});