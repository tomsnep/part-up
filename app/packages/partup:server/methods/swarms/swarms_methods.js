Meteor.methods({
    /**
     * Insert a Swarm
     *
     * @param {mixed[]} fields
     */
    'swarms.insert': function(fields) {
        check(fields, Partup.schemas.forms.swarmCreate);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var swarm = {};
            swarm.name = sanitizeHtml(fields.name);
            swarm.slug = Partup.server.services.slugify.slugify(fields.name);
            swarm.networks = [];
            swarm.admin_id = user._id;
            swarm.quotes = [];
            swarm.stats = {
                activity_count: 0,
                network_count: 0,
                partup_count: 0,
                supporter_count: 0,
                upper_count: 0
            };
            swarm.shared_count = {
                facebook: 0,
                twitter: 0,
                linkedin: 0,
                email: 0
            };
            swarm.created_at = new Date();
            swarm.updated_at = new Date();
            swarm.refreshed_at = new Date(); // For the shared_count cron job

            swarm._id = Swarms.insert(swarm);

            return {
                _id: swarm._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_inserted');
        }
    },

    /**
     * Update a Swarm
     *
     * @param {String} swarmId
     * @param {mixed[]} fields
     */
    'swarms.update': function(swarmId, fields) {
        check(swarmId, String);
        check(fields, Partup.schemas.forms.swarmUpdate);

        var user = Meteor.user();
        var swarm = Swarms.findOneOrFail(swarmId);

        if (!user || !swarm.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var newSwarmFields = Partup.transformers.swarm.fromFormSwarm(fields);

            Swarms.update(swarmId, {$set: newSwarmFields});

            return {
                _id: swarm._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_updated');
        }
    },

    /**
     * Update privileged swarm fields (superadmin only)
     *
     * @param {String} swarmSlug
     * @param {mixed[]} fields
     */
    'swarms.admin_update': function(swarmSlug, fields) {
        check(swarmSlug, String);
        check(fields, Partup.schemas.forms.swarmEditAdmin);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');
        if (!User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');

        var swarm = Swarms.findOneOrFail({slug: swarmSlug});

        if (fields.admin_id) {
            var adminUser = Meteor.users.findOneOrFail(fields.admin_id);
        }

        try {
            Swarms.update(swarm._id, {$set: {admin_id: adminUser._id}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_updated');
        }
    },

    /**
     * Add a network to the swarm
     *
     * @param {String} swarmId
     * @param {String} networkId
     */
    'swarms.add_network': function(swarmId, networkId) {
        check(swarmId, String);
        check(networkId, String);

        var user = Meteor.user();
        if (!User(user).isSwarmAdmin(swarmId) || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            // Make sure the swarm and network exist
            var swarm = Swarms.findOneOrFail({_id: swarmId});
            var network = Networks.findOneOrFail({_id: networkId});

            // They do, so let's add
            swarm.addNetwork(network._id);

            // All done, now all we need to do is to update the stats
            Event.emit('partups.swarms.networks.updated', user._id, swarm);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_added_to_swarm');
        }
    },

    /**
     * Remove a network from the swarm
     *
     * @param {String} swarmId
     * @param {String} networkId
     */
    'swarms.remove_network': function(swarmId, networkId) {
        check(swarmId, String);
        check(networkId, String);

        var user = Meteor.user();
        if (!User(user).isSwarmAdmin(swarmId) || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            // Make sure the swarm and network exist
            var swarm = Swarms.findOneOrFail({_id: swarmId});
            var network = Networks.findOneOrFail({_id: networkId});

            // They do, so let's remove
            swarm.removeNetwork(network._id);

            // All done, now all we need to do is to update the stats
            Event.emit('partups.swarms.networks.updated', user._id, swarm);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_removed_from_swarm');
        }
    },

    /**
     * Remove a Swarm
     *
     * @param {String} swarmId
     */
    'swarms.remove': function(swarmId) {
        check(swarmId, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var swarm = Swarms.findOneOrFail(swarmId);
        if (swarm.networks.length > 1) {
            throw new Meteor.Error(400, 'swarm_contains_networks');
        }

        try {
            Swarms.remove(swarmId);

            return {
                _id: swarmId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_removed');
        }
    },

    /**
     * Increase email share count
     *
     * @param {String} swarmId
     */
    'swarms.increase_email_share_count': function(swarmId) {
        check(swarmId, String);

        try {
            var swarm = Swarms.findOneOrFail(swarmId);
            swarm.increaseEmailShareCount();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_email_share_count_could_not_be_updated');
        }
    },

    /**
     * Add a quote to a swarm
     *
     * @param {String} swarmId
     * @param {String} quoteId
     * @param {mixed[]} fields
     */
    'swarms.update_quote': function(swarmId, quoteId, fields) {
        check(swarmId, String);
        check(quoteId, String);
        check(fields, Partup.schemas.forms.swarmQuote);

        try {
            var upper = Meteor.users.find(fields.user_id);

            Swarms.update({_id: swarmId, 'quotes._id': quoteId}, {
                $set: {
                    'quotes.$.author': {
                        _id: upper._id,
                        name: upper.profile.name,
                        image: upper.profile.image
                    },
                    'quotes.$.content': sanitizeHtml(fields.content),
                    'quotes.$.updated_at': new Date()
                }
            });
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_quote_could_not_be_updated');
        }
    }
});
