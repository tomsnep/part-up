Meteor.methods({
    /**
     * Insert a Swarm
     *
     * @param {mixed[]} fields
     */
    'swarms.insert': function(fields) {
        check(fields, Partup.schemas.forms.swarmForm);

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
            swarm.activity_count = 0;
            swarm.partup_count = 0;
            swarm.upper_count = 0;
            swarm.quotes = [];
            swarm.created_at = new Date();
            swarm.updated_at = new Date();

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
     * Update privileged swarm fields (superadmin only)
     *
     * @param {String} swarmSlug
     * @param {mixed[]} fields
     */
    'swarms.admin_update': function(swarmSlug, fields) {
        check(swarmSlug, String);
        check(fields, Partup.schemas.forms.swarmForm);

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
    }
});
