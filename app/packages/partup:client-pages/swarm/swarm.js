Template.swarm.onCreated(function() {
    var template = this;
    template.networks = new ReactiveVar([]);
    template.subscribe('swarms.one', template.data.slug, {
        onReady: function() {
            var swarm = Swarms.findOne({slug: template.data.slug});
            console.log(swarm)
        }
    });
});

Template.swarm.onRendered(function() {
    var template = this;
    var currentLanguage = Partup.client.language.current.get();
    HTTP.get('/networks/featured/' + currentLanguage, {}, function(error, response) {
        if (error || !response.data.networks || response.data.networks.length === 0) return;

        var result = response.data;
        var networks = lodash.chain(result.networks)
            .each(function(network) {
                Partup.client.embed.network(network, result['cfs.images.filerecord'], result.users);
            })
            .shuffle()
            // .slice(0, 5)
            .value();
        console.log(networks)
        template.networks.set(networks);
    });
});

Template.swarm.helpers({
    networks: function() {
        return Template.instance().networks.get();
    }
});
