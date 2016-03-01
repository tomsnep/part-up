if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Update the active partners of the network',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_UPDATE_ACTIVE_NETWORK_PARTNERS);
        },
        job: function() {
            Networks.find().forEach(function(network) {
                Partup.server.services.networks.updateActivePartners(network);
            });
        }
    });
}
