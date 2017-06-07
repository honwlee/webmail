var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
    name: { type: String },
    targetId: { type: ObjectId, ref: 'Account', index: true },
    targetType: { type: ObjectId, ref: 'Account', index: true }
});
schema.index({ targetId: 1, targetType: 1 }, { unique: true });
mongoose.model('Tag', TagSchema);
