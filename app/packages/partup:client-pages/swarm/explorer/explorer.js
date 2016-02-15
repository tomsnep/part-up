Template.swarm_explorer.onCreated(function() {
    this.rendered = new ReactiveVar(false);
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
                var centerRingItems = [];
                var outerRingItems = [];
                // determine total number of networks
                var total = networks.length;
                var hasItems = total ? true : false;

                // total networks in inner circle
                // 1/2 of 1/3 of total number of networks
                var numberOfInnerRingItems = Math.min(5, total); //Math.ceil((total / 3) / 2.1);

                // total networks in center circle
                // 1/3 of total number of networks
                var numberOfCenterRingItems = Math.min(9, total - numberOfInnerRingItems); //Math.ceil((total / 3));

                if (hasItems) {
                    _.times(numberOfInnerRingItems, function() {
                        innerRingItems.push(networks.pop());
                    });
                    // _.times(numberOfCenterRingItems, function() {
                    //     centerRingItems.push(networks.pop());
                    // });
                    outerRingItems = networks;
                }

                return networks ? {
                    hasItems: hasItems,
                    inner: innerRingItems,
                    // center: centerRingItems,
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
                    outer: [{
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
