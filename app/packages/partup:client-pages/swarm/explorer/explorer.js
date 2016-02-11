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

                // determine total number of networks
                var total = networks.length;

                // total networks in inner circle
                // 1/2 of 1/3 of total number of networks
                var innerLength = (total / 3) / 2.1;

                // total networks in center circle
                // 1/3 of total number of networks
                var centerLength = (total / 3);

                // total networks in outer circle
                // total of center circle networks (1/3 of total number of networks)
                // plus total of inner circle networks (1/2 of 1/3 of total number of networks)
                var outerLength = (centerLength + innerLength);

                // all values add up to total number of networks or total plus one
                // it does not matter that there is a possibility if +1
                return networks ? {
                    hasContent: total ? true : false,
                    inner: _.filter(networks, function(item, index) {
                        // return index <= 2;
                        return index <= innerLength;
                    }),
                    center: _.filter(networks, function(item, index) {
                        // return index > 2 && index <= 12;
                        return index > innerLength && index <= (centerLength + innerLength);
                    }),
                    outer: _.filter(networks, function(item, index) {
                        // return index > 12 && index <= 25;
                        return index > (centerLength + innerLength) && index <= (centerLength + innerLength + outerLength);
                    })
                } : false;
            },
        };
    },
    static: function() {
        return {
            placeholder: {
                swarmEmpty: {
                    inner: [{
                        type: 'astronaut'
                    }],
                    center: [{
                        type: 'spaceship'
                    },{
                        type: 'freakin_dog'
                    },{
                        type: 'picture'
                    }]
                },
                swarmNotFound: {
                    center: [{
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
