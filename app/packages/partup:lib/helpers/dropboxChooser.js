DropboxChooser = function(options) {
    this.options = _.defaultsDeep({
        allowedExtensions: {
            images: ['.jpg', '.png'],
            docs: ['.doc', '.docx', '.pdf']
        }
    }, options);
};

DropboxChooser.prototype.getAllExtensions = function() {
    var self = this;
    return _.chain(self.options.allowedExtensions).keys().map(function(type) {
        return self.options.allowedExtensions[type];
    }).flatten().value();
};

DropboxChooser.prototype.getExtensionFromFileName = function(filename) {
    return filename.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/)[0];
};

DropboxChooser.prototype.fileNameIsImage = function(fileName) {
  return _.include(this.options.allowedExtensions.images,
    this.getExtensionFromFileName(fileName)
  );
};

DropboxChooser.prototype.fileNameIsDoc = function(fileName) {
    return _.include(this.options.allowedExtensions.docs,
        this.getExtensionFromFileName(fileName)
    );
};


DropboxChooser.prototype.partupUploadPhoto = function(template, fileUrlLink) {

    return new Promise(function(resolve, reject) {

        Partup.client.uploader.uploadImageByUrl(fileUrlLink, function(error, image) {

            if (error) {
                Partup.client.notify.error(TAPi18n.__(error.reason));
                reject(error);
                return;
            }

            var uploaded = template.uploadedPhotos.get();
            uploaded.push(image._id);
            template.uploadedPhotos.set(uploaded);
            template.uploadingPhotos.set(false);
            resolve(uploaded);
        });
    });
};

DropboxChooser.prototype.partupUploadDoc = function(template, dropboxFile) {
    return new Promise(function(resolve, reject) {



        dropboxFile._id = new Meteor.Collection.ObjectID()._str;

        var uploaded = template.uploadedDocuments.get();
        uploaded.push(dropboxFile);
        template.uploadedDocuments.set(uploaded);
        template.uploadingDocuments.set(false);
        resolve(uploaded);

    });
};

Partup.helpers.DropboxChooser = DropboxChooser;
