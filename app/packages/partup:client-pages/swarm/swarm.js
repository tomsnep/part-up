Template.swarm.onCreated(function() {
    var template = this;
    template.networks = new ReactiveVar([]);
    template.subscribe('swarms.one', template.data.slug);
    template.subscribe('swarms.one.networks', template.data.slug);
});

Template.swarm.helpers({
    swarm: function() {
        var template = Template.instance();
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        var networks = Networks.guardedMetaFind({_id: {$in: swarm.networks}}, {limit: 25}).fetch();
        return {
            data: function() {
                return swarm;
            },
            networks: function() {
                return networks;
            }
        }
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
