var pdfExtensions = ['.pdf'];
var docExtensions = ['.doc', '.docx', '.rtf'];
var presentationExtensions = ['.pps', '.ppsx', '.ppt'];
var fallbackFileExtensions = ['.csv', '.xls', '.xlsx', '.ai', '.bmp', '.eps', '.psd', '.tiff', '.tif', '.svg'];

DropboxChooser = function(options) {
    this.options = _.extend({
        allowedExtensions: {
            images: ['.gif', '.jpg', '.jpeg', '.png'],
            docs: _.flatten([
                pdfExtensions,
                docExtensions,
                presentationExtensions,
                fallbackFileExtensions
            ])
        }
    }, options);
} || {};

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

            //re-correct the total items based on the uploaded item
            template.totalPhotos.set(uploaded.length);
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

        //re-correct the total items based on the uploaded item
        template.totalDocuments.set(uploaded.length);
        resolve(uploaded);

    });
};

Partup.helpers.DropboxChooser = DropboxChooser;

var DropboxRenderer = function() {
    var dropboxChooser = new DropboxChooser();

    return {
        getFileIdFromDirectLink: getFileIdFromDirectLink,
        createPreviewLinkFromDirectLink: createPreviewLinkFromDirectLink,
        getSvgIcon: getSvgIcon
    };

    function getFileIdFromDirectLink (fileUrl) {
        return fileUrl.match(/view\/(\w+)/)[1];
    }

    function createPreviewLinkFromDirectLink(directLinkUrl, fileName) {
        var fileId = getFileIdFromDirectLink(directLinkUrl);
        return 'https://www.dropbox.com/s/' + fileId + '/' + fileName + '?dl=0';
    }

    /**
     * @param fileName - file name of the dropbox object
     * @returns {string}
     */
    function getSvgIcon(fileName) {
        var extension = dropboxChooser.getExtensionFromFileName(fileName);
        var svgFileName = 'icon_file.svg';

        if(_.include(fallbackFileExtensions, extension)) {
            svgFileName = 'icon_file.svg';
        }
        else if(_.include(presentationExtensions, extension)) {
            svgFileName = 'icon_ppt.svg';
        }
        else if(_.include(docExtensions, extension)) {
            svgFileName = 'icon_doc.svg';
        }
        else if(_.include(pdfExtensions, extension)) {
            svgFileName = 'icon_pdf.svg';
        }

        return svgFileName;
    }
};

Partup.helpers.DropboxRenderer = DropboxRenderer;
