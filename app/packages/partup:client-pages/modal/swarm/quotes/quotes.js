Template.modal_swarm_settings_quotes.onCreated(function() {
    this.create = new ReactiveVar(false);
    // Meteor.call('swarms.get_related_uppers', )
});

Template.modal_swarm_settings_quotes.events({
    'click [data-create]': function(event, template) {
        event.preventDefault();
        template.create.set(true);
    }
});

Template.modal_swarm_settings_quotes.helpers({
    data: function() {
        var template = Template.instance();
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        return {
            swarm: function() {
                return swarm;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            create: function() {
                return template.create.get();
            }
        }
    }
});

