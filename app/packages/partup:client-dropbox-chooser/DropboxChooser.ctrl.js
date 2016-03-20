if (Meteor.isClient) {
    var dropboxHelper = new Partup.helpers.DropboxChooser();

    Template.DropboxChooser.helpers();

    Template.DropboxChooser.events({});

    Template.DropboxChooser.onRendered(function () {

        /*
         newmessage.html template
         */
        var template = Template.instance().parent();


        Dropbox.init({appKey: 'vn3c8yxjactncjs'});

        var $dropboxChooser = jQuery('[data-dropbox-chooser]');

        $dropboxChooser.click(dropboxChooserTrigger);

        function dropboxChooserTrigger() {

            Dropbox.choose({
                success: onFileChange,
                linkType: "direct", // or "preview"
                multiselect: true, // or true
                extensions: dropboxHelper.getAllExtensions()
            });
        }

        function totalMediaItems() {
            return template.uploadedDocuments.get().length +
                template.uploadedPhotos.get().length;
        }

        function onFileChange(files) {

            var leftOver = template.maxMediaItems - totalMediaItems();

            if (leftOver <= 0) {
                return false;
            }

            for (var i = 0; i < leftOver; i++) {

                var dropboxFile = files[i];

                if(dropboxFile) {
                    if (dropboxHelper.fileNameIsImage(dropboxFile.name)) {
                        template.uploadingPhotos.set(true);
                        template.totalPhotos.set(
                            template.totalPhotos.get() + 1
                        );
                        dropboxHelper.partupUploadPhoto(template, dropboxFile.link);
                    }
                    else if (dropboxHelper.fileNameIsDoc(dropboxFile.name)) {
                        template.uploadingDocuments.set(true);
                        template.totalDocuments.set(
                            template.totalDocuments.get() + 1
                        );
                        dropboxHelper.partupUploadDoc(template, dropboxFile);
                    }
                }
            }
        }

    });
}
