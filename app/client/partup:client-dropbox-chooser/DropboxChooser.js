if (Meteor.isClient) {

    Template.DropboxChooser.helpers({});
    Template.DropboxChooser.events({});

    Template.DropboxChooser.onRendered(function() {

        var template = Template.instance().parent();

        var button = Dropbox.createChooseButton({
            // Required. Called when a user selects an item in the Chooser.
            success: function(files) {
                var directLinkUrl = files[0].link;
                template.uploadingPhotos.set(true);

                Partup.client.uploader.uploadImageByUrl(directLinkUrl, function(error, image) {
                    template.uploadingPhotos.set(false);
                    if (error) {
                        Partup.client.notify.error(TAPi18n.__(error.reason));
                        return;
                    }
                    var uploaded = template.uploadedPhotos.get();
                    uploaded.push(image._id);
                    template.uploadedPhotos.set(uploaded);
                });
                template.totalPhotos.set(1);
            },
            cancel: function() {},
            linkType: "direct", // or "direct"
            multiselect: false, // or true
            extensions: ['.jpg', '.png']
        });

        document.querySelector('[data-dropbox-chooser]').appendChild(button);
    });
}