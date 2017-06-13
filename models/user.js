var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,

    userSchema = new Schema({
        username: { type: String, require: true, unique: true, index: true },
        email: { type: String },
        amToken: {type: String},
        password: { type: String },
        token: { type: String },
        accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
        createAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
userSchema.statics.findOrCreateBy = function(data) {
    return User.findOne({ username: data.username }).then(function(user){
        if(!user) user = new User();
        for(var key in data) {
            user[key] = data[key];
        }
        return user.save();
    });
};
userSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', userSchema);
