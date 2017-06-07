var sanitize = require('validator').sanitize;
var toobusy = require('toobusy-js');
var config = require('../config').config;
var mailUtil = require('../libs/mailUtil');
var passport = require('passport');
require('../auth/passport.js');

exports.showSignin = function(req, res) {
    res.render('auth/signin.html');
};

exports.showSignup = function(req, res) {
    res.render('auth/signup.html');
};

exports.signin = function(req, res) {
    return passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
};
exports.signup = function(req, res) {
    return passport.authenticate('local-signup', {
        successRedirect: '/signin',
        failureRedirect: '/signin'
    })
}
exports.signout = function(req, res) {
    var user = req.session.user;
    if (user) {
        req.logout();
        mailUtil.doLogout(user, function(err) {
            if (err) {
                throw err;
            } else {
                console.log('signout');
                req.session.destroy();
                res.clearCookie(config.authCookieName, { path: '/' });
                res.redirect(req.headers.referer || 'home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.authUser = function(req, res, next) {
    if (req.session.user) {
        res.locals = { 'currentUser': req.session.user };
    }
    return next();
};

exports.toobusy = function(req, res, next) {
    if (toobusy()) {
        res.status(503).send('系统忙，请稍后再试');
    } else {
        next();
    }
};

// private
function genSession(user, res) {
    var authToken = encrypt(user.name + '\t' + user.pass, config.sessionSecret);
    // cookie 有效期30天
    res.cookie(config.authCookieName, authToken, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30
    });
}

function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}
