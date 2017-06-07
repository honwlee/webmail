var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function(err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./mail');
require('./user');
require('./account');

exports.Mail = mongoose.model('Mail');
exports.User = mongoose.model('User');
exports.Account = mongoose.model('Account');
