/**
 * Render a form to edit a single swarm's settings
 *
 * @module client-swarm-settings
 * @param {Number} slug    the slug of the swarm whose settings are rendered
 */
Template.modal_swarm_settings_details.onCreated(function() {
    var tpl = this;
    var userId = Meteor.userId();

    tpl.subscription = tpl.subscribe('swarms.one', tpl.data.slug, function() {
        var swarm = Swarms.findOne({slug: tpl.data.slug});
        console.log(swarm);
        // if (!swarm) Router.pageNotFound('swarm');
        // if (swarm.isClosedForUpper(userId)) Router.pageNotFound('swarm');
    });

    tpl.charactersLeft = new ReactiveDict();
    tpl.submitting = new ReactiveVar();
    tpl.current = new ReactiveDict();
    tpl.uploading = new ReactiveDict();

    tpl.locationSelection = new ReactiveVar();

    tpl.autorun(function() {
        var swarm = Swarms.findOne({slug: tpl.data.slug});
        if (!swarm) return;

        // if (swarm.location && swarm.location.place_id) tpl.locationSelection.set(swarm.location);

        swarm = Partup.transformers.swarm.toFormSwarm(swarm);

        var formSchema = Partup.schemas.entities.swarm._schema;
        var valueLength;

        ['description', 'title', 'introduction'].forEach(function(n) {
            valueLength = swarm[n] ? swarm[n].length : 0;
            tpl.charactersLeft.set(n, formSchema[n].max - valueLength);
        });
    });
});

Template.modal_swarm_settings_details.helpers({
    imageInput: function() {
        var template = Template.instance();
        return {
            button: 'data-image-browse',
            input: 'data-image-input',
            onFileChange: function(event) {
                Partup.client.uploader.eachFile(event, function(file) {
                    template.uploading.set('image', true);

                    Partup.client.uploader.uploadImage(file, function(error, image) {
                        template.uploading.set('image', false);

                        if (error) {
                            Partup.client.notify.error(TAPi18n.__(error.reason));
                            return;
                        }

                        template.find('[name=image]').value = image._id;
                        template.current.set('image', image._id);
                    });

                });

            }
        };
    },
    formSchema: Partup.schemas.forms.swarmUpdate,
    placeholders: {
        title: function() {
            return __('swarm-settings-form-title-placeholder');
        },
        description: function() {
            return __('swarm-settings-form-description-placeholder');
        },
        introduction: function() {
            return __('swarm-settings-form-introduction-placeholder');
        }
    },
    descriptionCharactersLeft: function() {
        return Template.instance().charactersLeft.get('description');
    },
    titleCharactersLeft: function() {
        return Template.instance().charactersLeft.get('title');
    },
    introductionCharactersLeft: function() {
        return Template.instance().charactersLeft.get('introduction');
    },
    swarm: function() {
        return Swarms.findOne({slug: this.slug});
    },
    fieldsForSwarm: function() {
        var swarm = Swarms.findOne({slug: this.slug});
        if (!swarm) return;

        return Partup.transformers.swarm.toFormSwarm(swarm);
    },
    submitting: function() {
        return Template.instance().submitting.get();
    },
    imageUploading: function() {
        return !!Template.instance().uploading.get('image');
    },
    imageUrl: function() {
        var imageId = Template.instance().current.get('image');

        if (!imageId) {
            var swarm = Swarms.findOne({slug: this.slug});
            if (swarm) imageId = swarm.image;
        }

        if (imageId) {
            var image = Images.findOne({_id: imageId});
            if (image) return Partup.helpers.url.getImageUrl(image, '360x360');
        }

        return '/images/smile.png';
    }
});

Template.modal_swarm_settings_details.events({
    'input [maxlength]': function(e, template) {
        template.charactersLeft.set(this.name, this.max - e.target.value.length);
    }
});

AutoForm.addHooks('swarmEditForm', {
    onSubmit: function(doc) {
        var self = this;
        self.event.preventDefault();
        var template = self.template.parent();
        var swarm = Swarms.findOne({slug: template.data.slug});

        template.submitting.set(true);

        Meteor.call('swarms.update', swarm._id, doc, function(err) {
            template.submitting.set(false);

            if (err && err.message) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(__('swarm-settings-form-saved'));
            self.done();
        });

        return false;
    }
});
