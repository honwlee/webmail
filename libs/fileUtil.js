var path = require('path');
var Q = require('q');
var fs = require('fs');

var decodeBase64Data = function(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
};

exports.saveAttachments = function(attachments, callback) {
    var defers = [],
        files = [],
        uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    var writFile = function(attachment) {
        var deferred = Q.defer(),
            url = path.join(uploadPath, attachment.file.name),
            response = decodeBase64Data(attachment.data);
        console.log('url is ------------->' + url);

        fs.writeFile(url, response.data, function(err) {
            if (err) console.log(err);
            deferred.resolve(files.push({
                filename: attachment.file.name,
                content: response.data,
                encoding: 'base64'
            }));
        });
        return deferred.promise;
    };
    attachments.forEach(function(attachment) {
        defers.push(writFile(attachment));
    });
    return Q.all(defers).then(function() {
        callback(files);
    });
}
