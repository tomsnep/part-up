if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Update the swarm and network stats of Part-up',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_SWARM_UPDATE_STATS);
        },
        job: function() {
            Swarms.find().forEach(function(swarm) {
                Partup.server.services.swarms.updateStats(swarm)
            });
        }
    });
}
