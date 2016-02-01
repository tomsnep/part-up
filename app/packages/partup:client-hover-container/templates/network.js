Template.HoverContainer_network.onCreated(function() {
    var networkSlug = this.data;
    this.subscribe('networks.one', networkSlug);
});

Template.HoverContainer_network.helpers({
    network: function() {
        var networkSlug = Template.instance().data;
        var network = Networks.guardedMetaFind({slug: networkSlug}, {limit: 1}).fetch().pop() || null;
        if (!network) return;
        return network;
    }
});
