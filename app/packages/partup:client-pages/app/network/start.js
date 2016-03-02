Template.app_network_start.onCreated(function() {
    var template = this;
    var networkSlug = template.data.networkSlug;
    template.loaded = new ReactiveVar(false);
    template.subscribe('networks.one', networkSlug, {
        onReady: function() {
            template.loaded.set(true);
        }
    });
    template.subscribe('networks.one.partups', {slug: networkSlug});
});

Template.app_network_start.helpers({
    data: function() {
        var template = Template.instance();
        var self = this;
        var network = Networks.findOne({slug: self.networkSlug});
        return {
            network: function() {
                return network;
            },
            partups: function() {
                return Partups.findForNetwork(network);
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            loaded: function() {
                return template.loaded.get();
            }
        };
    }
});
