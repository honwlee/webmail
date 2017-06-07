var nodeMailer = require('./nodeMailer');
var models = require('../models');
var fileUtil = require('./fileUtil');
var IMapPop = require('./imapPop');
var Mail = models.Mail;

exports.initConnection = function(account, type, callback) {
    var key = account.imap ? "imap" : "pop3";
    var mails = [],
        stopped = true,
        opts = {
            host: account[key].host,
            port: account[key].port,
            username: account.address,
            password: account.password,
            box: type === "inbox" ? "INBOX" : "OUTBOX"
        };
    if (account.imap) {
        var imap = new IMapPop.IMAP(opts);
        imap.start();
        imap.on("imap:mail", function(data) {
            saveMail(account, data, type, function(mail) {
                mails.push(mail);
            });
        });
        setTimeout(function() {
            console.log('Timedout');
            imap.stop();
        }, 13000)

        imap.once('imap:end', function(mail) {
            callback(mails);
            console.log('IMAP END');
        });
    } else {
        opts.enabletls = false;
        opts.debug = false;
        opts.maxmsgcount = 3;
        var pop3 = new IMapPop.POP3(opts);
        pop3.connect();

        pop3.once('pop:connected', function(success) {
            pop3.start();
            console.log('pop3 mail retrieving...');
        });

        pop3.on('pop:mail', function(data) {
            saveMail(account, data, type, function(mail) {
                mails.push(mail);
            });
        });

        pop3.once('pop:error', function(err) {
            console.log(err);
        });
        pop3.once('pop:retrieve_done', function(err) {
            callback(mails);
        });
        pop3.once('pop:zero_message', function(err) {
            callback([]);
        });

    }
    // this.conn = connect.init(account, function(data) {
    //     console.log(data);
    //     console.log("###################");
    //     saveMail(account, data, callback);
    // }, recreate);
    // return this.conn;
};

exports.doLogout = function(user, cb) {
    this.conn.end ? this.conn.end() : this.conn.quit();
    cb();
};

exports.isFunction = function(obj) {
    return toString.call(obj) == '[object function]';
};

var createTransport = function(account) {
    return nodeMailer.createTransport(account);
};

exports.getMailByDate = function(date, user, cb) {
    getMailByDate(date, user, cb)
};

exports.saveMail = function(account, data, type, callback) {
    saveMail(account, data, callback);
};

var getMailByDate = function(date, account, cb) {
    Mail.findOne({ date: date, _owner: account._id }, function(err, mail) {
        if (err) throw err;
        cb(mail);
    });
};

var saveMail = function(account, data, type, callback) {
    console.log("date -------------------> " + data.date);
    console.log("subject -------------------> " + data.subject);
    getMailByDate(data.date, account, function(mail) {
        if (!mail) {
            var mail = new Mail();
            mail.date = data.date;
            mail.data = data;
            mail._owner = account._id;
            mail.type = type;
            mail.username = account.address;
            mail.save(function(err) {
                if (err) throw err;
            });
            callback(mail);
        }
    });
};

exports.getMailListByPage = function(page, user, cb) {
    Mail.find({ page: page, username: user.username }, 'data',
        function(err, list) {
            // TODO list 数据对象不仅仅包含纯 data 字段
            // 数据按时间对象排序
            if (err) throw err;
            cb(list);
        });
};

exports.updateMail = function(options, user) {
    Mail.update({ id: options.id, page: options.page, username: user.username }, function(err, mail) {
        if (err) throw err;
    });
};

exports.sendMail = function(data, account, callback) {
        var transport = createTransport(account);
        console.log("transport ----------->");
        fileUtil.saveAttachments(data.attachments, function(attachments) {
            data.attachments = attachments;
            transport.sendMail(data, function(error, info) {
                if (error) {
                    console.log('Error occured');
                    console.log(error.message);
                    return callback(error);
                }
                console.log('Message sent successfully!');

                // if you don't want to use this transport object anymore, uncomment following line
                transport.close(); // close the connection pool
                callback();
            });
        });
    }
    //exports.saveImap = function(imap) {
    //  var temp = new Temp();
    //  temp.imap = imap;
    //  temp.save(function(err) {
    //    if (err) throw err;
    //  });
    //};

//exports.getImap = function(cb) {
//  Temp.findOne(USER.name, function(err, temp) {
//    if (err) throw err;
//    cb(temp);
//  });
//};

// exports.getUnseenMail = function(imap, cb) {
//     imapModule.getUnseenMail
// };

// exports.getBoxes = function(imap, cb) {
//     imap.getBoxes(function(err, boxes) {
//         if (err) throw err;
//         var bs = [],
//             key;
//         //      console.log(boxes);
//         for (key in boxes) {
//             key && bs.push(key);
//             //        console.log('status: ' + key);
//             //        imap.status(key, function(err, box) {
//             //          console.log(key, err, box);
//             //        });
//         }
//         cb(bs);
//     });
// };

// exports.saveBoxes = function() {

// };


// function die(err) {
//     console.log('Uh oh: ' + err);
//     // process.exit(1);
// }
