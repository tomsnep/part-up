Meteor.methods({
    /**
     * Insert a Swarm
     *
     * @param {mixed[]} fields
     */
    'swarms.insert': function(fields) {
        check(fields, Partup.schemas.forms.swarmBaseSchema);

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
    }
});
