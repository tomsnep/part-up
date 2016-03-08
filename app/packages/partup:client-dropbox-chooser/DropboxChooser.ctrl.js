if (Meteor.isClient) {
    var dropboxHelper = new Partup.helpers.DropboxChooser({
        allowedExtensions: {
            images: ['.jpg', '.png'],
            docs: ['.doc', '.docx', '.pdf']
        }
    });

    Template.DropboxChooser.helpers({});
    Template.DropboxChooser.events({});

    Template.DropboxChooser.onRendered(function() {

        /*
         newmessage.html template
         */
        var template = Template.instance().parent();

        Dropbox.init({ appKey: 'vn3c8yxjactncjs' });

        var button = Dropbox.createChooseButton({
            // Required. Called when a user selects an item in the Chooser.
            success: function(files) {

                template.uploadingPhotos.set(true);
                var total = template.totalPhotos.get();

                files.forEach(function(file) {
                    if (total === template.maxPhotos) return;

                    if(dropboxHelper.fileNameIsImage(file.name)) {
                        dropboxHelper.partupUploadPhoto(template, file.link);
                    }
                    else if(dropboxHelper.fileNameIsDoc(file.name)) {
                        dropboxHelper.partupUploadDoc(template, file.link);
                    }
                    total++;
                    template.totalPhotos.set(total);
                });
            },
            cancel: function() {},
            linkType: "direct", // or "direct"
            multiselect: true, // or true
            extensions: dropboxHelper.getAllExtensions()
        });

        document.querySelector('[data-dropbox-chooser]').appendChild(button);

    });
}
