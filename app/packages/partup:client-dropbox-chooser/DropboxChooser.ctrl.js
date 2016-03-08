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

                function totalMediaItems() {
                    return template.totalDocuments.get() + template.totalPhotos.get()
                }

                files.forEach(function(dropboxFile) {

                    if(totalMediaItems() === template.maxMediaItems) return;

                    if(dropboxHelper.fileNameIsImage(dropboxFile.name)) {
                        template.uploadingPhotos.set(true);
                        template.totalPhotos.set(
                            template.totalPhotos.get() + 1
                        );
                        dropboxHelper.partupUploadPhoto(template, dropboxFile.link);
                    }
                    else if(dropboxHelper.fileNameIsDoc(dropboxFile.name)) {
                        template.uploadingDocuments.set(true);
                        template.totalDocuments.set(
                            template.totalDocuments.get() + 1
                        );
                        dropboxHelper.partupUploadDoc(template, dropboxFile);
                    }
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
