Template.modal_swarm_settings_tribes.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set('submitting', false);

    this.networkSelection = new ReactiveVar();
});

Template.modal_swarm_settings_tribes.helpers({
    state: function() {
        var template = Template.instance();
        return {
            submitting: function() {
                return template.state.get('submitting');
            }
        };
    },
    translations: function() {
        return {
            networkFieldPlaceholder: function() {
                return __('pages-modal-admin-featured-networks-form-network-placeholder');
            }
        };
    },
    form: function() {
        var template = Template.instance();
        return {
            schema: new SimpleSchema({}),
            networkLabel: function() {
                return function(network) {
                    return network.name;
                };
            },
            networkSelectionReactiveVar: function() {
                return template.networkSelection;
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
        };
    },
    data: function() {
        var template = Template.instance();
        var submitting = template.state.get('submitting');
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return false;
        return {
            swarm: function() {
                return swarm;
            },
            networks: function() {
                return Networks.find({_id: {$in: swarm.networks}});;
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
});

AutoForm.addHooks('addNetworkForm', {
    onSubmit: function(doc) {
        var self = this;
        self.event.preventDefault();

        var template = self.template.parent();
        template.state.set('submitting', true);
        var networkId = template.networkSelection.curValue._id;
        var swarm = Swarms.findOne({slug: template.data.slug});
        Meteor.call('swarms.add_network', swarm._id, networkId, function(error) {
            if (error) return console.error(error);
            template.state.set('submitting', false);
            AutoForm.resetForm(self.formId);

            self.done();
        });

        return false;
    }
});
