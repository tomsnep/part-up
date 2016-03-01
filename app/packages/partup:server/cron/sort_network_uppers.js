if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: "Sort the uppers of the network based on active in the network's partups",
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_SORT_ACTIVE_NETWORK_UPPERS);
        },
        job: function() {
            Networks.find().forEach(function(network) {
                Partup.server.services.networks.sortActiveUppers(network);
            });
        }
    });
}
