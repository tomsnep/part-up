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
            var uppers = partup.uppers || [];
            network_partners.push.apply(network_partners, uppers);
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
    },

    /**
     * Create tags that are common in the underlying partups of the network
     *
     * @param {Object} network
     */
    getCommonTags: function(network) {
        // Initialization
        var partup_tags = [];

        // Get the tags of all partups in this networks in one array
        Partups.find({network_id: network._id, deleted_at: {$exists: false}, archived_at: {$exists: false}}).fetch().forEach(function(partup) {
            var tags = partup.tags || [];
            partup_tags.push.apply(partup_tags, tags);
        });

        // We now have all the tags, so sort on frequency
        partup_tags = lodash.chain(partup_tags)
            .countBy()
            .pairs()
            .sortBy(1)
            .reverse()
            .pick(function(value, key) {
                return value[1] > 1; // Only collect the tags that occur more than once
            })
            .value();

        // Create an array of tag objects containing their frequency
        var common_tags = [];
        for (var key in partup_tags) {
            if (partup_tags.hasOwnProperty(key)) {
                var tagArray = partup_tags[key];

                common_tags.push({
                    tag: tagArray[0],
                    frequency: tagArray[1]
                });
            }
        }

        // Update the network
        Networks.update(network._id, {
            $set: {
                common_tags: common_tags,
                updated_at: new Date()
            }
        });
    }
};
