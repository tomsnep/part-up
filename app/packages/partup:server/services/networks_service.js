var d = Debug('services:networks');

/**
 @namespace Partup server networks service
 @name Partup.server.services.networks
 @memberof Partup.server.services
 */
Partup.server.services.networks = {
    /**
     * Sort the network uppers based on activeness
     *
     * @param {Object} network
     */
    sortActiveUppers: function(network) {
        // Initialization
        var network_uppers = network.uppers || [];
        var network_partners = [];

        Partups.find({network_id: network._id, deleted_at: {$exists: false}, archived_at: {$exists: false}}).fetch().forEach(function(partup) {
            network_partners.push.apply(network_partners, partup.uppers);
        });

        // We now have all the partners, so sort on frequency
        network_partners = lodash.chain(network_partners).countBy().pairs().sortBy(1).reverse().pluck(0).value();

        // We only want the uppers that are member of the tribe in our array
        var sorted_network_uppers = lodash.intersection(network_partners, network_uppers);
        var leftover_uppers = lodash.difference(network_uppers, sorted_network_uppers);
        sorted_network_uppers.push.apply(sorted_network_uppers, leftover_uppers);

        // Update the network with the new stats
        Networks.update(network._id, {
            $set: {
                uppers: sorted_network_uppers,
                updated_at: new Date()
            }
        });
    }
};
