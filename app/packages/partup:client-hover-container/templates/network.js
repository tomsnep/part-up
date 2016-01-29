Template.HoverContainer_network.onCreated(function() {
    var networkSlug = this.data;
    this.subscribe('networks.one', networkSlug);
});

Template.HoverContainer_network.helpers({
    network: function() {
        var networkSlug = Template.instance().data;
        console.log(networkSlug)
        var network = Networks.guardedMetaFind({slug: networkSlug}, {limit: 1}).fetch().pop() || null;
        console.log(network)
        if (!network) return;
        return network;
    }
});
