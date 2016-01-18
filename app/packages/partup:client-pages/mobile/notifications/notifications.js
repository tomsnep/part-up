Template.mobile_notifications.onCreated(function() {
    var self = this;
    self.subscribe('notifications.for_upper', 25)
})

Template.mobile_notifications.helpers({
    notifications: function() {
        var parameters = {sort: {created_at: -1}, limit: 25};
        return Notifications.findForUser(Meteor.user(), {}, parameters);
    }
})
