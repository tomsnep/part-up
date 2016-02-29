Template.app_network_start.onCreated(function() {
    var template = this;
    template.loaded = new ReactiveVar(false);
    template.subscribe('networks.one', template.data.networkSlug, {
        onReady: function() {
            template.loaded.set(true);
        }
    });
});

Template.app_network_start.helpers({
    data: function() {
        var template = Template.instance();
        var self = this;
        var network = Networks.findOne({slug: self.networkSlug});
        return {
            network: function() {
                return network;
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
