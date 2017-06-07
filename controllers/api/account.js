var models = require('../../models');
var mailUtil = require('../../libs/mailUtil');
var Account = models.Account;
var Mail = models.Mail;
var mailInfo;
var fs = require('fs');
var path = require('path');

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
mailInfo = getConfig('../../data/mailInfo.json');

exports.index = function(req, res) {
    Account.find({}, function(error, accounts) {
        if (error) res.send(error);
        res.json(accounts);
    });
};
exports.add = function(req, res) {
    if (req.body._id) {
        Account.findOneAndUpdate(req.body._id, req.body, { new: true }, function(error, account) {
            if (error) res.send(error);
            res.json(account);
        })
    } else {
        req.body.pop3 = mailInfo[req.body.kind].pop3;
        req.body.smtp = mailInfo[req.body.kind].smtp;
        req.body.imap = mailInfo[req.body.kind].imap;
        var account = new Account(req.body);
        account.save(function(error, account) {
            if (error) res.send(error);
            return res.json(account);
        });
    }
};

exports.update = function(req, res) {
    Account.findOneAndUpdate(req.params.id, req.body, { new: true }, function(error, account) {
        if (error) res.send(error);
        res.json(account);
    })
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
