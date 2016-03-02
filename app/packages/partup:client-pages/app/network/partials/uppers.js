Template.app_network_start_uppers.onCreated(function() {
    var template = this;
    template.subscribe('users.by_ids', template.data.uppers);
});
Template.app_network_start_uppers.helpers({
    data: function() {
        var template = Template.instance();
        var upperIds = template.data.uppers || [];
        return {
            uppers: function() {
                return Meteor.users.find({_id: {$in: upperIds}});
            }
        };
    }
});
