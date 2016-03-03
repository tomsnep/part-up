Template.app_network_start_uppers.onCreated(function() {
    var template = this;
    template.MAX_UPPERS = 7;
    template.subscribe('users.by_ids', template.data.uppers.uppers);
});
Template.app_network_start_uppers.helpers({
    data: function() {
        var template = Template.instance();
        var upperIds = template.data.uppers.uppers || [];
        var upperCount = template.data.uppers.totalUppers;
        return {
            uppers: function() {
                return Meteor.users.find({_id: {$in: upperIds}}, {limit: template.MAX_UPPERS});
            },
            remainingUppers: function() {
                var remaining = upperCount > template.MAX_UPPERS ? upperCount - template.MAX_UPPERS : 0;
                return remaining;
            }
        };
    }
});
