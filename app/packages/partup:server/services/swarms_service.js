var d = Debug('services:swarms');

/**
 @namespace Partup server swarms service
 @name Partup.server.services.swarms
 @memberof Partup.server.services
 */
Partup.server.services.swarms = {
    /**
     * Update the swarm stats
     *
     * @param {Object} swarm
     */
    updateStats: function(swarm) {
        // Initialize stats counters
        var swarm_stats = {
            activity_count: 0,
            network_count: 0,
            partner_count: 0,
            partup_count: 0,
            supporter_count: 0,
            upper_count: 0
        };

        // Get all the network IDs to loop through
        var networks = swarm.networks || [];

        // Set the network count
        swarm_stats.network_count = networks.length;

        // Loop through each of the networks to get all partups
        networks.forEach(function(networkId) {
            // Retrieve the network
            var network = Networks.findOne(networkId);

            // Initialize stats counters
            var network_stats = {
                activity_count: 0,
                partner_count: 0,
                partup_count: 0,
                supporter_count: 0,
                upper_count: 0
            };

            // Store the partup IDs to loop through for the activities
            var partups = Partups.find({network_id: network._id}, {_id: 1}).fetch();
            var network_partups = [];
            partups.forEach(function(partup) {
                network_partups.push(partup._id);
            });

            // Update the partup counter with the amount of partups in this network
            network_stats.partup_count = network_partups.length;
            swarm_stats.partup_count += network_stats.partup_count;

            // Update the upper counter with the amount of uppers in this network
            var network_uppers = network.uppers || [];
            network_stats.upper_count = network_uppers.length;
            swarm_stats.upper_count += network_uppers.length;

            // Loop through each partup to get activity and supporter count
            network_partups.forEach(function(partupId) {
                // Retrieve the partup
                var partup = Partups.findOne(partupId);

                // Update the activity counter with the amount of activities in this partup
                var partup_activity_count = partup.activity_count || 0;
                network_stats.activity_count += partup_activity_count;
                swarm_stats.activity_count += partup_activity_count;

                // Update the partner counter
                var partup_partners = partup.uppers || [];
                network_stats.partner_count += partup_partners.length;
                swarm_stats.partner_count += partup_partners.length;

                // And lastly, update the supporter counter
                var partup_supporters = partup.supporters || [];
                network_stats.supporter_count += partup_supporters.length;
                swarm_stats.supporter_count += partup_supporters.length;
            });

            // Update the network with the new stats
            Networks.update(network._id, {
                $set: {
                    stats: network_stats,
                    updated_at: new Date()
                }
            });
        });

        // Update the swarm with the new stats
        Swarms.update(swarm._id, {
            $set: {
                stats: swarm_stats,
                updated_at: new Date()
            }
        });
    }
};
