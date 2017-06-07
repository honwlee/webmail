var nodeMailer = require('nodemailer');
exports.createTransport = function(account) {
    var obj = {
        host: account.smtp.host,
        secureConnection: false,
        port: account.smtp.port,
        auth: {
            user: account.address,
            pass: account.password
        }
    };
    return nodeMailer.createTransport(obj);
};
