var OpenAm = require('./openam').OpenAm,
    openAm = new OpenAm("http://passport2.utilhub.dt.hudaokeji.com/am/"),
    models = require('../models'),
    User = models.User;

exports.ensureAuthenticated = function(req, res, next) {
    var token = req.cookies[openAm._cookieName];
    openAm.isTokenValid(token, function(results) {
        if (results && results.valid) {
            console.log(results);
            openAm.getAttributes(token, results.uid, function(data) {
                User.findOrCreateBy({
                    username: results.uid,
                    email: data.mail[0],
                    amToken: token
                }).then(function(user) {
                    req.userId = user._id;
                    return next();
                });
            });
        } else {
            res.json({ msg: "need authenticate" })
        }
    });
}
