Template.app_network_start_uppers.onCreated(function() {
    var template = this;
    template.subscribe('users.by_ids', template.data.uppers);
    template.maxUppers = 7;
});
Template.app_network_start_uppers.helpers({
    data: function() {
        var template = Template.instance();
        var upperIds = template.data.uppers || [];
        var upperCount = upperIds.length;
        return {
            uppers: function() {
                return Meteor.users.find({_id: {$in: upperIds}}, {limit: template.maxUppers});
            },
            remainingUppers: function() {
                var remaining = upperCount > template.maxUppers ? upperCount - template.maxUppers : 0;
                return remaining;
            }
        };
    }
});
