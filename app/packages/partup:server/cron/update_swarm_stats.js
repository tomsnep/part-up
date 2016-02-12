if(process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Update the stats of all swarms',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_SWARM_UPDATE_STATS);
        },
        job: function() {
            if (!process.env.NODE_ENV.match(/development/)) {
                Swarms.find().forEach(function(swarm) {
                    Partup.server.services.swarms.updateStats(swarm)
                });
            }
        }
    });
}
