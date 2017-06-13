var bcrypt = require('bcryptjs'),
    mailInfo,
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    mongoosePaginate = require('mongoose-paginate'),
    accountSchema = new Schema({
        host: { type: String },
        kind: { type: String },
        port: { type: String },
        address: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
                },
                message: 'mail address is inaccurate!'
            },
            unique: true
        },
        password: { type: String, required: true },
        _owner: { type: ObjectId, ref: 'User', index: true },
        pop3: { type: Object },
        smtp: { type: Object },
        imap: { type: Object },
        mails: [{ type: Schema.Types.ObjectId, ref: 'Mail' }]
    });



function readJsonFileSync(filepath, encoding) {
    if (typeof(encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file) {
    return readJsonFileSync(path.join(__dirname, file));
}

mailInfo = getConfig('../data/mailInfo.json');

accountSchema.plugin(mongoosePaginate);
accountSchema.statics.findOrCreateBy = function(data) {
    return Account.findOne({ username: data.username }).then(function(account) {
        if (!account) account = new Account();
        for (var key in data) {
            if (key === "kind") {
                account.pop3 = mailInfo[data.kind].pop3;
                account.smtp = mailInfo[data.kind].smtp;
                account.imap = mailInfo[data.kind].imap;
            } else if (key === 'password') {
                account.password = data.password; // bcrypt.hashSync(data.password, 8);
            } else {
                account[key] = data[key];
            }
        }
        return account.save();
    });
};

var Account = mongoose.model('Account', accountSchema);
