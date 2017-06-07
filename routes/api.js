var mail = require('../controllers/api/mail');
var account = require('../controllers/api/account');
module.exports = function(app) {
    // api
    app.get('/api/webmail/mails/:id', mail.show);
    app.post('/api/webmail/mails', mail.list);
    app.post('/api/webmail/mails/mark', mail.mark);
    app.delete('/api/webmail/mails/:id', mail.delete);
    // accounts
    app.get('/api/webmail/accounts', account.index);
    app.post('/api/webmail/accounts/:id/refresh', account.refresh);
    app.delete('/api/webmail/accounts/:id/mails/empty', account.emptyMail);
    app.post('/api/webmail/accounts/:id/mail/send', account.sendMail);
    app.post('/api/webmail/accounts/mails', account.mailList);
    app.post('/api/webmail/accounts/add', account.add);
    app.post('/api/webmail/accounts/:id', account.update);
    app.delete('/api/webmail/accounts/:id', account.remove);
};
