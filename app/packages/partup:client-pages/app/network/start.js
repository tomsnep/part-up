Template.app_network_start.onCreated(function() {
    var template = this;
    var networkSlug = template.data.networkSlug;
    template.loaded = new ReactiveVar(false);
    template.subscribe('networks.one', networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: networkSlug});
            if (!network) Router.pageNotFound('network');
            template.loaded.set(true);
        }
    });
    template.subscribe('networks.one.partups', {slug: networkSlug});
    template.maxTags = 5;
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
            },
            tags: function() {
                var tags = [];
                var commonTags = network.common_tags || [];
                var customTags = network.tags || [];

                _.times(template.maxTags, function() {
                    var tag = commonTags.shift();
                    if (!tag) return;
                    tags.push(tag.tag);
                });

                if (tags.length === template.maxTags) return tags;

                _.times((template.maxTags - tags.length), function() {
                    var tag = customTags.shift();
                    if (!tag) return;
                    tags.push(tag);
                });

                return tags;
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
