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
    updateActivePartners: function(network) {
        // Initialize array
        var network_partners = [];

        Partups.find({network_id: network._id, deleted_at: {$exists: false}, archived_at: {$exists: false}}).fetch().forEach(function(partup) {
            network_partners.push.apply(network_partners, partup.uppers);
        });

        // We now have all the partners, so sort on frequency
        network_partners = lodash.chain(network_partners).countBy().pairs().sortBy(1).reverse().pluck(0).value();

        // Update the network with the new stats
        Networks.update(network._id, {
            $set: {
                active_partners: network_partners.slice(0, 7), // Only store the most active 7
                updated_at: new Date()
            }
        });
    }
};
