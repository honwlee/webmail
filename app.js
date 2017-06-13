var path = require('path');
var markdown = require('markdown-js');
var partials = require('express-partials');
var ejs = require('ejs');
var fs = require('fs');
var express = require('express');
var session = require('express-session');
var app = express();
var passport = require('passport');
var auth = require('./controllers/auth');
var config = require('./config').config;
var routes = require('./routes/routes');
var methodOverride = require('method-override');
var appRoot = __dirname;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
app.set('views', path.join(appRoot, 'views'));
// app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.set('view cache', false);
app.engine('html', ejs.renderFile);
app.engine('md', function(path, options, fn) {
    fs.readFile(path, 'utf8', function(err, str) {
        if (err) return fn(err);
        str = markdown.parse(str).toString();
        fn(null, str);
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(auth.authUser);
app.use(auth.toobusy);
app.use(partials());
app.use(express.static(path.join(appRoot, 'public')));

app.locals.config = config;
app.locals.csrf = function(req, res) {
    return req.session ? req.session._csrf : '';
};
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', 'http://ube.ihudao.dt.hudaokeji.com:9000');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// routes(app, agent.shield(cookieShield));
routes(app);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
app.listen(config.port, function() {
    console.log(config.host + ':' + config.port);
});
module.exports = app;
