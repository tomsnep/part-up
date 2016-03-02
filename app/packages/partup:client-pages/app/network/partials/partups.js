Template.app_network_start_partups.onCreated(function() {
    var template = this;
    template.subscribe('partups.by_ids', template.data.partups);
});
Template.app_network_start_partups.helpers({
    data: function() {
        var template = Template.instance();
        var partupIds = template.data.partups || [];
        return {
            partups: function() {
                return Partups.find({_id: {$in: partupIds}});
            }
        };
    }
});
