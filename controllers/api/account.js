var mailUtil = require('../../libs/mailUtil');
var models = require('../../models');
var Account = models.Account;
var Mail = models.Mail;


exports.index = function(req, res) {
    console.log("req.userId:", req.userId)
    Account.find({ _owner: req.userId }).then(function(accounts) {
        res.json(accounts);
    });
};

exports.create = function(req, res) {
    req.body._owner = req.userId;
    Account.findOrCreateBy(req.body).then(function(account) {
        res.json(account);
    });
};

exports.remove = function(req, res) {
    Account.remove({
        _id: req.params.id
    }, function(error, account) {
        if (error) res.send(error);
        res.json({ msg: "account successfully deleted" });
    })
};
// mails
exports.mailList = function(req, res) {
    var opts = {};
    if (req.body.accountId) opts["_owner"] = req.body.accountId;
    if (req.body.type) opts.type = req.body.type;
    Mail.find(opts).exec(function(error, mails) {
        if (error) res.send(error);
        res.json(mails);
    });
};

exports.refresh = function(req, res) {
    var type = req.body.type || "inbox";
    console.log('type is --------------->' + type);

    Account.findOne({ _id: req.params.id }, function(error, account) {
        if (error) res.send(error);
        mailUtil.initConnection(account, type, function(mails) {
            return res.json(mails);
        });
    });
}

exports.emptyMail = function(req, res) {
    var opts = { trash: true };
    if (req.body.accountId) opts["_owner"] = req.body.accountId;
    Mail.remove(opts).exec(function(error, mails) {
        if (error) res.send(error);
        res.json({});
    });
}

exports.sendMail = function(req, res) {
    Account.findOne({ _id: req.params.id }, function(error, account) {
        if (error) res.send(error);
        var data = JSON.parse(req.body.data);
        mailUtil.sendMail(data, account, function() {
            res.json({});
        });
    });
};
