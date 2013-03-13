/// <reference path="../scripts/_references.js" />
/*global console,define,setTimeout*/
/*jslint unparam: true*/define([
    'scalejs!core',
    'jQuery',
    'knockout',
    'bPopup',
    'scalejs.statechart-scion'
], function (
    core,
    $,
    ko
) {
    /// <param name="ko" value="window.ko"/>
    'use strict';

    var array = core.array,
        merge = core.object.merge,
        builder = core.state.builder.builder({ logStatesEnteredAndExited: true }),
        statechart = builder.statechart,
        state = builder.state,
        isObservable = ko.isObservable,
        unwrap = ko.utils.unwrapObservable,
        //observable = ko.observable,
        computed = ko.computed;


    function transitionManager(element, viewModel, spec) {
        var transitionsStatechart,
            visualState = spec.visualState,
            savedNodes,
            model;

        function updateVisualState(newState) {
            // update visual state later (to make sure we are not in statechart step)
            if (isObservable(visualState)) {
                setTimeout(function () {
                    visualState(newState);
                }, 0);
            }
        }

        function renderChild() {
            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
            ko.applyBindingsToDescendants(viewModel, element);
        }

        function clearChild() {
            savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true);
            ko.virtualElements.emptyNode(element);
        }

        function runTransition(transitions) {
            var transition = transitions.shift(),
                child = ko.virtualElements.childNodes(element).filter(function (e) {
                    return e.nodeType === 1;
                })[0];

            if (transition) {
                setTimeout(function () {
                    var context = {
                        element: child,
                        viewModel: viewModel,
                        renderChild: renderChild
                    };

                    transition.call(context, function () {
                        transitionsStatechart.send('transition.finished', { transition: transition });
                    });
                }, 0);
            }
        }

        function start() {
            clearChild();

            computed({
                read: function () {
                    var state = unwrap(visualState);
                    if (state) {
                        setTimeout(function () {
                            transitionsStatechart.send(state);
                        }, 0);
                    }
                },
                disposeWhenNodeIsRemoved: element
            });

            transitionsStatechart.start();
        }

        model = merge({
            inTransitions: [],
            outTransitions: []
        }, spec);

        /*jslint white: true*/
        transitionsStatechart = statechart(
            // Initial
            state('initial')
                .onEntry(function () {
                    this.transitions = array.copy(model.inTransitions);
                })
                .on(function () {
                    return this.transitions.length > 0;
                }).goto('in.transitioning')
                .goto('in.finished'),

            state('in.transitioning')
                .onEntry(function () {
                    runTransition(this.transitions);
                })
                .on('transition.finished', function () {
                    return this.transitions.length > 0;
                }).goto('in.transitioning')
                .on('transition.finished').goto('in.finished'),

            state('in.finished')
                .onEntry(function () {
                    updateVisualState('in.finished');
                })
                .on('out.transitioning', function () {
                    return model.outTransitions.length > 0;
                }).goto('out.transitioning', function () {
                    this.transitions = array.copy(model.outTransitions);
                })
                .on('out.transitioning').goto('out.finished'),

            state('out.transitioning')
                .onEntry(function () {
                    runTransition(this.transitions);
                })
                .on('transition.finished', function () {
                    return this.transitions.length > 0;
                }).goto('out.transitioning')
                .on('transition.finished').goto('out.finished'),

            // Finished transitioning
            state('out.finished')
                .onEntry(function () {
                    updateVisualState('out.finished');
                })
                .on('in.transitioning').goto('initial')
        );
        /*jslint white: false*/

        start();
    }

    function init(        element,        valueAccessor,        allBindingsAccessor,        viewModel,        bindingContext    ) {
        return { 'controlsDescendantBindings' : true };
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        var options = valueAccessor();

        transitionManager(element, viewModel, options);
    }

    return {
        init: init,
        update: update
    };
});
/*jslint unparam: false*/

