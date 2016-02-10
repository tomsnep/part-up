Template.modal_swarm_settings_tribes.onCreated(function() {
    this.networkSelection = new ReactiveVar();
    this.submitting = new ReactiveVar(false);
});

Template.modal_swarm_settings_tribes.helpers({
    submitting: function() {
        return Template.instance().submitting.get();
    },
    networkFieldPlaceholder: function() {
        return __('pages-modal-admin-featured-networks-form-network-placeholder');
    },
    networkLabel: function() {
        return function(network) {
            return network.name;
        };
    },
    networkSelectionReactiveVar: function() {
        return Template.instance().networkSelection;
    },
    networkQuery: function() {
        return function(query, sync, async) {
            Meteor.call('networks.autocomplete', query, function(error, networks) {
                lodash.each(networks, function(p) {
                    p.value = p.name; // what to show in the autocomplete list
                });
                async(networks);
            });
        };
    },
    networkFormvalue: function() {
        return function(network) {
            return network._id;
        };
    },
    schema: new SimpleSchema({}),
    swarm: function() {
        var template = Template.instance();
        var submitting = template.submitting.get();
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        console.log(swarm.networks)
        var networks = Networks.find({_id: {$in: swarm.networks}});
        console.log(swarm)
        return {
            data: function() {
                return swarm;
            },
            networks: function() {
                return networks;
            }
        };
    }
});

Template.modal_swarm_settings_tribes.events({
    'click [data-removenetwork]': function(event, template) {
        var networkId = this._id;
        var swarm = Swarms.findOne({slug: template.data.slug});
        Meteor.call('swarms.remove_network', swarm._id, networkId, function() {

        });
    }
})

AutoForm.addHooks('addNetworkForm', {
    onSubmit: function(doc) {
        var self = this;
        self.event.preventDefault();

        var template = self.template.parent();
        template.submitting.set(true);
        var networkId = template.networkSelection.curValue._id;
        var swarm = Swarms.findOne({slug: template.data.slug});
        Meteor.call('swarms.add_network', swarm._id, networkId, function(error) {
            if (error) return console.error(error);
            template.submitting.set(false);
            AutoForm.resetForm(self.formId);

            self.done();
        });

        return false;
    }
});
