var auth = require('../controllers/auth');
var api = require("./api");

module.exports = function(app) {
    // url routes
    app.get('/signin', auth.showSignin);
    app.get('/signout', auth.signout);
    app.post('/signin', auth.signin());
    app.get('/signup', auth.showSignup);
    app.post('/signup', auth.signup());
    api(app);
    app.get('*', function(req, res) {
        res.render('index.html', {});
        // throw new NotFound;
    });

};
