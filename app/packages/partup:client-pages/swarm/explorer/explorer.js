Template.swarm_explorer.onCreated(function() {
    this.rendered = new ReactiveVar(false);
    this.pageLimit = 13;
});
Template.swarm_explorer.onRendered(function() {
    this.rendered.set(true);
});
Template.swarm_explorer.helpers({
    state: function() {
        var template = Template.instance();
        return {
            rendered: function() {
                return template.rendered.get();
            }
        };
    },
    data: function() {
        var data = Template.currentData();
        return {
            rings: function() {
                // check if the networks are a mongo cursor
                // if so, we know it's an existing swarm
                var networks = data.networks instanceof Mongo.Collection.Cursor ? data.networks.fetch() : false;
                var innerRingItems = [];
                var outerRingItems = [];

                // determine total number of networks
                var total = networks.length;
                var empty = total ? false : true;

                // number of inner ring items
                // 1/3 of total, max 4
                var numberOfInnerRingItems = Math.min(4, Math.ceil(total / 3));

                if (!empty) {
                    _.times(numberOfInnerRingItems, function() {
                        innerRingItems.push(networks.pop());
                    });
                    outerRingItems = networks;
                }

                return networks ? {
                    empty: empty,
                    inner: innerRingItems,
                    outer: outerRingItems
                } : false;
            },
        };
    },
    static: function() {
        return {
            placeholder: {
                swarmEmpty: {
                    inner: [{
                        type: 'spaceship'
                    },{
                        type: 'astronaut'
                    }],
                    outer: [{
                        type: 'freakin_dog'
                    },{
                        type: 'picture'
                    }]
                },
                swarmNotFound: {
                    inner: [{
                        type: 'spaceship_flying',
                        placeholderPath: 'home'
                    }]
                }
            }
        };
    }
});

Template.swarm_explorer.events({
    'click [data-findout]': function(event, template) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: window.innerHeight - 90
        }, 500);
    }
});
