var models = require('../../models');
var mailUtil = require('../../libs/mailUtil');
var Mail = models.Mail;

exports.list = function(req, res) {
    var opts = {};
    if (req.body.accountId) opts["_owner"] = req.body.accountId;
    if (req.body.type) opts.type = req.body.type;
    if (req.body.deleted) {
        opts.deleted = true;
    } else {
        if (req.body.starred) opts.starred = true;
        if (req.body.draft) opts.draft = true;
        if (req.body.flagged) opts.flagged = true;
        opts.deleted = { $ne: true };
    }
    console.log('opts is --------------->');
    console.log(req.body);
    Mail.find(opts, function(error, mails) {
        if (error) res.send(error);
        res.json(mails);
    });
};

exports.show = function(req, res) {
    Mail.findOne({ _id: req.params.id }, function(error, mail) {
        if (error) res.send(error);
        res.json(mail);
    });
}

exports.mark = function(req, res) {
    var obj = {};
    console.log(req.body);
    obj[req.body.type] = req.body.value;
    console.log(obj);
    Mail.update({
            _id: {
                $in: req.body.ids
            }
        }, {
            $set: obj
        }, { multi: true },
        function(error, mails) {
            if (error) res.send(error);
            res.json(mails);
        }
    );
}

exports.delete = function(req, res) {
    Mail.findByIdAndRemove({ _id: req.params.id }, function(error, mail) {
        if (error) res.send(error);
        res.json({ status: true });
    });
}
