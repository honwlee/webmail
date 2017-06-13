var mail = require('../controllers/api/mail'),
    ensureAuthenticated = require('../libs/authApi').ensureAuthenticated,
    account = require('../controllers/api/account');
module.exports = function(app) {
    // api
    app.get('/api/webmail/mails/:id', ensureAuthenticated, mail.show);
    app.post('/api/webmail/mails', ensureAuthenticated, mail.list);
    app.post('/api/webmail/mails/mark', ensureAuthenticated, mail.mark);
    app.delete('/api/webmail/mails/:id', ensureAuthenticated, mail.delete);
    // accounts
    app.get('/api/webmail/accounts', ensureAuthenticated, account.index);
    app.post('/api/webmail/accounts/:id/refresh', ensureAuthenticated, account.refresh);
    app.delete('/api/webmail/accounts/:id/mails/empty', ensureAuthenticated, account.emptyMail);
    app.post('/api/webmail/accounts/:id/mail/send', ensureAuthenticated, account.sendMail);
    app.post('/api/webmail/accounts', ensureAuthenticated, account.create);
    app.delete('/api/webmail/accounts/:id', ensureAuthenticated, account.remove);
};
