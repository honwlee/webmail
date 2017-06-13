"use strict";

var bcrypt = require('bcryptjs'),
    EventEmitter = require("events").EventEmitter,
    util = require('util'),
    MailParser = require('mailparser').MailParser,
    pop3 = require('./poplib'),
    notifier = require('./notifier'),

    mailparser = new MailParser();
module.exports.POP3 = POP3;
module.exports.IMAP = IMAP;

function IMAP(options) {
    var self = this;

    this.mailparser = new MailParser();
    this.mails = [];
    this.imap = {
        username: options.username,
        password: options.password,
        host: options.host,
        box: options.box,
        port: options.port ? options.port : 993,
        tls: false,
        tlsOptions: { rejectUnauthorized: false }
    }
    this._notifier;
}

function POP3(options) {
    var self = this;

    this.tlserrs = options.tlserrs !== false ? true : false;
    this.enabletls = options.enabletls !== false ? true : false;
    this.debug = options.debug !== false ? true : false;
    this.port = options.port ? options.port : 995;
    this.host = options.host;
    this.interval = options.inteval ? options.interval : 5000; //default interval is 5 seconds
    this.username = options.username;
    this.maxmsgcount = options.maxmsgcount || 10;
    this.password = options.password;
    this.totalmsgcount = 0;
    this.mails = [];
    this.currmsg = 0;
    this.isValidState = true;
    this.pop_client = new pop3(this.port, this.host, {
        tlserrs: this.tlserrs,
        enabletls: this.enabletls,
        debug: this.debug
    });
    this.mailparser = new MailParser();
}

util.inherits(POP3, EventEmitter);
util.inherits(IMAP, EventEmitter);


IMAP.prototype.start = function(callback) {
    var self = this;

    this._notifier = notifier(self.imap).on('mail', function(mail) {
        self.emit('imap:mail', mail);
    }).on('end', function() {
        self.emit('imap:end', true);
    }).on('error', function(err) {
        self.emit('imap:error', err);
    }).start();

    if (callback)
        callback(null, true);
}

IMAP.prototype.stop = function() {

    var self = this;
    console.log('Closing IMAP connection.');

    self.emit('imap:stop', true);

    self._notifier.stop();

    self._notifier.on('end', function() {
        self.emit('imap:stop', true);
    });

    self._notifier.on('error', function(err) {
        self.emit('imap:error', err);
    });
}

POP3.prototype.connect = function() {
    var self = this;

    self.pop_client.on('connect', function() {
        console.log('Connect Success');
        self.pop_client.login(self.username, self.password);
    });

    self.pop_client.on("invalid-state", function(cmd) {
        console.log("Invalid state, failed. You tried calling " + cmd);
        // self.pop_client.quit();

    });

    self.pop_client.on('locked', function(cmd) {
        console.log('Current command has not finished yet. You tried calling ' + cmd);
        // self.pop_client.quit();

    });

    self.pop_client.on('login', function(status, rawdata) {
        if (status) {

            console.log('LOGIN/PASS success');
            self.emit('pop:connected', true);

        } else {

            console.log('LOGIN/PASS failed');
            self.pop_client.quit();
        }
    });

}

POP3.prototype.start = function(pop) {
    var self = this;
    if (self.isValidState)
        self.retrieve();
    // var _interval = this.interval;

    // setInterval(function() {
    //     if (self.isValidState)
    //         self.retrieve();
    //     else {
    //         self.connect();
    //     }
    // }, _interval);
}

POP3.prototype.retrieve = function() {

    var self = this;

    self.pop_client.list();
    self.pop_client.on('list', function(status, msgcount, msgnumber, data, rawdata) {

        if (status === false) {

            console.log("LIST failed");
            self.pop_client.quit();

        } else if (msgcount > 0) {

            self.emit('pop:retrieving', true);
            self.totalmsgcount = msgcount;
            self.currmsg = 1;
            console.log("LIST success with " + msgcount + " message(s)");

            self.pop_client.retr(1);

        } else {

            console.log("LIST success with 0 message(s)");
            self.emit('pop:zero_message', true);
            self.pop_client.quit();

        }
    });

    self.pop_client.on('retr', function(status, msgnumber, data, rawdata) {
        console.log("msgnumber -------------->" + msgnumber);
        console.log('data -------------->');
        console.log(data);
        if (status === true) {
            console.log("RETR success " + msgnumber);
            self.currmsg += 1;

            self.mailparser.write(new Buffer(data + "\r\n\r\n"));
            self.mailparser.end();

            self.pop_client.dele(msgnumber);

        } else {

            console.log("RETR failed for msgnumber " + msgnumber);
            self.pop_client.rset();

        }
    });

    self.pop_client.on('dele', function(status, msgnumber, data, rawdata) {

        if (status === true) {

            if (self.currmsg > Math.min(self.maxmsgcount, self.totalmsgcount)) {

                console.log('TOTAL mails ' + self.mails.length);
                self.emit('pop:retrieve_done', self.mails);

                self.pop_client.quit();
            } else {
                self.pop_client.retr(self.currmsg);
            }

        } else {

            console.log('DELE failed for msgnumber ' + msgnumber);
            self.pop_client.quit();
        }
    });

    self.pop_client.on("error", function(err) {
        self.emit('pop:error', err);
    });

    self.pop_client.on("rset", function(status, rawdata) {
        self.pop_client.quit();
    });

    self.pop_client.on('quit', function(status, rawdata) {

        if (status === true) console.log('QUIT success');
        else console.log('QUIT failed');
    });

    self.mailparser.on('end', function(mail) {

        self.mails.push(mail);
        self.emit("pop:mail", mail);

    });

    self.mailparser.on("headers", function(headers) {
        // console.log(headers.received);
    });
}
