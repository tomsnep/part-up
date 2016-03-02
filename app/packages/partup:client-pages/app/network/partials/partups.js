Template.app_network_start_partups.onCreated(function() {
    var template = this;

    template.activeImage = new ReactiveVar(template.data.partups.fetch().shift().image);
    template.maxPartups = 3;

});
Template.app_network_start_partups.helpers({
    data: function() {
        var data = Template.currentData();
        var template = Template.instance();
        var partups = data.partups.fetch();
        var partupCount = data.partups.count();

        return {
            partups: function() {
                var listPartups = [];
                _.times(template.maxPartups, function() {
                    if (!partups.length) return;
                    var partup = partups.shift();
                    partup.activityCount = partup.activity_count || Activities.findForPartup(partup).count();
                    partup.supporterCount = partup.supporters ? partup.supporters.length : 0;
                    partup.dayCount = Math.ceil(((((new Date() - new Date(partup.created_at)) / 1000) / 60) / 60) / 24);
                    listPartups.push(partup);
                });
                return listPartups;
            },
            remainingPartups: function() {
                var remaining = partupCount > template.maxPartups ? partupCount - template.maxPartups : 0;
                return remaining;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            activeImage: function() {
                return template.activeImage.get();
            }
        };
    }
});

Template.app_network_start_partups.events({
    'mouseenter [data-expand]': function(event, template) {
        template.activeImage.set(this.image);
    },
    // 'mouseleave [data-stack]': function(event, template) {
    //     template.activeImage.set(template.data.partups.fetch().shift().image);
    // }
});
