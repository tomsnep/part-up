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

Partup.helpers.DropboxChooser = DropboxChooser;
