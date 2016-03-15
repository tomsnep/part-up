/**
 @namespace Partup server matching service
 @name Partup.server.services.matching
 @memberof Partup.server.services
 */
Partup.server.services.matching = {
    /**
     * Match uppers for a given activity
     *
     * @param {String} activityId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForActivity: function(activityId, searchOptions) {
        var activity = Activities.findOneOrFail(activityId);
        var partup = Partups.findOneOrFail(activity.partup_id);
        var tags = partup.tags || [];
        var uppers = partup.uppers || [];

        return this.findMatchingUppers(searchOptions, tags, uppers);
    },

    /**
     * Match uppers for a given network
     *
     * @param {String} networkId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForNetwork: function(networkId, searchOptions) {
        var network = Networks.findOneOrFail(networkId);
        var tags = network.tags || [];
        var uppers = network.uppers || [];

        return this.findMatchingUppers(searchOptions, tags, uppers);
    },

    /**
     * Match uppers for a given partup
     *
     * @param {String} partupId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForPartup: function(partupId, searchOptions) {
        var partup = Partups.findOneOrFail(partupId);
        var tags = partup.tags || [];
        var uppers = partup.uppers || [];

        return this.findMatchingUppers(searchOptions, tags, uppers);
    },

    /**
     * Find upeprs that match with the provided criteria
     *
     * @param {Object} searchOptions
     * @param {[String]} tags
     * @param {[String]} excludedUppers

     * @return {[String]}
     */
    findMatchingUppers: function(searchOptions, tags, excludedUppers) {
        var selector = {};
        var options = {};
        var searchOptionsProvided = searchOptions.locationId || searchOptions.query;
        var limit = searchOptionsProvided ? 30 : 10;

        if (searchOptionsProvided) {
            if (searchOptions.locationId) {
                selector['profile.location.place_id'] = searchOptions.locationId;
            }
            if (searchOptions.query) {
                // Remove accents that might have been added to the query
                searchOptions.query = mout.string.replaceAccents(searchOptions.query.toLowerCase());
                selector['profile.normalized_name'] = new RegExp('.*' + searchOptions.query + '.*', 'i');
            }
        } else {
            // Match the uppers on the provided tags
            tags = tags || [];
            selector['profile.tags'] = {$in: tags};
        }

        // Exclude the current logged in user from the results
        selector['_id'] = {$nin: [Meteor.userId()]};

        // Exclude provided uppers from result, unless a search is happening
        if (!searchOptionsProvided) {
            excludedUppers = excludedUppers || [];
            selector['_id'] = {$nin: excludedUppers};
        }

        // Sort the uppers on participation_score
        options['sort'] = {participation_score: -1};

        // Only return the IDs
        options['fields'] = {_id: 1};

        // Limit results
        options['limit'] = limit;

        var results = Meteor.users.findActiveUsers(selector, options).fetch();

        // If there are no results, we remove some matching steps (only when no search options were provided)
        if (!searchOptionsProvided) {
            var iteration = 0;
            while (results.length === 0) {
                if (iteration === 0) delete selector['profile.tags'];

                results = Meteor.users.findActiveUsers(selector, options).fetch();
                iteration++;
            }
        }

        return results;
    }
};
