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
        var stats = {
            activity_count: 0,
            network_count: 0,
            partup_count: 0,
            supporter_count: 0,
            upper_count: 0
        };

        Log.debug('SwID', swarm._id);
        // Get all the network IDs to loop through
        var networks = swarm.networks || [];

        // Set the network count
        stats.network_count = networks.length;

        // Loop through each of the networks to get all partups
        networks.forEach(function(networkId) {
            // Retrieve the network
            var network = Networks.findOne(networkId);

            // Store the partup IDs to loop through for the activities
            var network_partups = network.partups || [];

            // Update the partup counter with the amount of partups in this network
            stats.partup_count += network_partups.length;

            // Update the upper counter with the amount of uppers in this network
            var network_uppers = network.uppers || [];
            stats.upper_count += network_uppers.length;

            // Loop through each partup to get activity and supporter count
            network_partups.forEach(function(partupId) {
                // Retrieve the partup
                var partup = Partups.findOne(partupId);

                // Update the activity counter with the amount of activities in this partup
                stats.activity_count += partup.activity_count;

                // And lastly, update the supporter counter
                var partup_supporters = partup.supporters || [];
                stats.supporter_count += partup_supporters.length;
            });
        });

        // Some logging
        Log.debug('Swarm stats calculated:', stats);

        // Update the swarm with the new stats
        Swarms.update(swarm._id, {
            $set: {
                stats: stats,
                updated_at: new Date()
            }
        });
    }
};
