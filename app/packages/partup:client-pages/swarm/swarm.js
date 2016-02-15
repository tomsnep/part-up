Template.swarm.onCreated(function() {
    var template = this;

    template.state = new ReactiveDict();
    template.state.set('contentReady', false);
    template.state.set('explorerReady', false);

    template.subscribe('swarms.one', template.data.slug, {
        onReady: function() {
            Meteor.setTimeout(function() {
                template.state.set('contentReady', true);
            }, 500);
        }
    });
    template.subscribe('swarms.one.networks', template.data.slug, {
        onReady: function() {
            Meteor.defer(function() {
                template.state.set('explorerReady', true);
            });
        }
    });
    template.relatedNetworks = new ReactiveVar([]);
    Meteor.call('swarms.get_related_networks', template.data.slug, function(error, res) {
        template.relatedNetworks.set(res);
    });
});

Template.swarm.helpers({
    data: function() {
        var template = Template.instance();
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        return {
            swarm: function() {
                return swarm;
            },
            networks: function() {
                return Networks.find({_id: {$in: swarm.networks}});
            },
            relatedNetworks: function() {
                console.log(Networks.find({_id: {$in: template.relatedNetworks.get()}}))
                return Networks.find({_id: {$in: template.relatedNetworks.get()}});
            },
            userIsSwarmAdmin: function() {
                return swarm.isSwarmAdmin(Meteor.userId());
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            contentReady: function() {
                return template.state.get('contentReady');
            },
            explorerReady: function() {
                return template.state.get('explorerReady');
            }
        };
    }
});

Template.swarm.events({
    'click [data-settings]': function(event, template) {
        event.preventDefault();
        Intent.go({
            route: 'swarm-settings-details',
            params: {
                slug: template.data.slug
            }
        });
    }
});
