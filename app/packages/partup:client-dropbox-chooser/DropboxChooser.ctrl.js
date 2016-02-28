if (Meteor.isClient) {

    Template.DropboxChooser.helpers({});
    Template.DropboxChooser.events({});

    Template.DropboxChooser.onRendered(function() {

        var template = Template.instance().parent();

        var button = Dropbox.createChooseButton({
            // Required. Called when a user selects an item in the Chooser.
            success: function(files) {

                template.uploadingPhotos.set(true);
                var total = template.totalPhotos.get();
                files.forEach(function(file) {
                    if (total === template.maxPhotos) return;

                    Partup.client.uploader.uploadImageByUrl(file.link, function(error, image) {
                        template.uploadingPhotos.set(false);
                        if (error) {
                            Partup.client.notify.error(TAPi18n.__(error.reason));
                            return;
                        }
                        var uploaded = template.uploadedPhotos.get();
                        uploaded.push(image._id);
                        template.uploadedPhotos.set(uploaded);
                    });
                    total++;
                    template.totalPhotos.set(total);
                });
            },
            cancel: function() {},
            linkType: "direct", // or "direct"
            multiselect: true, // or true
            extensions: ['.jpg', '.png']
        });

        document.querySelector('[data-dropbox-chooser]').appendChild(button);
    });
}