Template.app_network_start_partups.helpers({
    data: function() {
        var data = Template.currentData();
        return {
            partups: function() {
                return data.partups || [];
            }
        };
    }
});
