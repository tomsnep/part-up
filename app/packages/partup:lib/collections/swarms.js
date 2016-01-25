/**
 * Swarm model
 *
 * @memberOf Swarms
 */
var Swarm = function(document) {
    _.extend(this, document);
};

/**
 * Check if given user is admin of this swarm
 *
 * @memberOf Swarms
 * @param {String} userId the user id of the user to be checked
 * @return {Boolean}
 */
Swarm.prototype.isSwarmAdmin = function(userId) {
    if (!userId) return false;
    return mout.lang.isString(userId) && (userId === this.admin_id);
};

/**
 * Check if given user is the super admin or admin of this swarm
 *
 * @memberOf Swarms
 * @param {String} userId the user id of the user to be checked
 * @return {Boolean}
 */
Swarm.prototype.isAdmin = function(userId) {
    if (!userId) return false;
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return false;
    return this.isSwarmAdmin(userId) || User(user).isAdmin();
};

/**
 * Add network to swarm
 *
 * @memberOf Swarms
 * @param {String} networkId the id of the tribe to be added
 */
Swarm.prototype.addNetwork = function(networkId) {
    Swarms.update(this._id, {$addToSet: {networks: networkId}});
    Networks.update(networkId, {$addToSet: {swarms: this._id}});
};

/**
 * Remove network from swarm
 *
 * @memberOf Swarms
 * @param {String} networkId the user id of the user that is leaving the swarm
 */
Swarm.prototype.removeNetwork = function(networkId) {
    Swarms.update(this._id, {$pull: {networks: networkId}});
    Networks.update(networkId, {$pull: {swarms: this._id}});
};

/**
 Swarms are entities that group networks (also known as tribes)
 @namespace Swarms
 */
Swarms = new Mongo.Collection('swarms', {
    transform: function(document) {
        return new Swarm(document);
    }
});

// Add indices
if (Meteor.isServer) {
    Swarms._ensureIndex('slug');
    Swarms._ensureIndex('admin_id');
}
