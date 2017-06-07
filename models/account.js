var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    host: { type: String },
    kind: { type: String },
    port: { type: String },
    address: { type: String },
    password: { type: String },
    pop3: { type: Object },
    smtp: { type: Object },
    imap: { type: Object },
    mails: [{ type: Schema.Types.ObjectId, ref: 'Mail' }]
});

mongoose.model('Account', AccountSchema);
