Template.modal_swarm_settings_tribes.onCreated(function() {

});

Template.modal_swarm_settings_tribes.helpers({
    swarm: function() {
        var template = Template.instance();
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        var networks = Networks.guardedMetaFind({_id: {$in: swarm.networks}}, {limit: 25}).fetch();
        console.log(networks)
        return {
            data: function() {
                return swarm;
            },
            networks: function() {
                return networks;
            }
        }
    }
})
