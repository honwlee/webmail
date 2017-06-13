var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    ObjectId = Schema.ObjectId,

    MailSchema = new Schema({
        username: { type: String },
        data: { type: Object },
        date: { type: Date, index: true },
        createAt: { type: Date, default: Date.now },
        _owner: { type: ObjectId, ref: 'Account', index: true },
        type: { type: String, index: true },
        deleted: { type: Boolean, index: true },
        starred: { type: Boolean, index: true },
        flagged: { type: Boolean, index: true }
    });
MailSchema.plugin(mongoosePaginate);
mongoose.model('Mail', MailSchema);
