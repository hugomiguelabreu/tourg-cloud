process.env.key= 'renatinholindo';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var guideRouter = require('./routes/guide');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true}));

app.use(bodyParser.json());

/*=========  Authentication - Passport middleware configuration ========== */

var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}                                                       /*  Strategy Options    */
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.key;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload,next){    /*  Strategy Definition */
    console.log('payload received', jwt_payload);
    next(null, {message: 'Strategy failed'});
});


passport.use(strategy);
app.use(passport.initialize());
/* ======================================================================== */


/* =============================== ROUTES ================================= */
app.use('/api/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/guide', guideRouter);
/* ======================================================================== */

app.use(function(req, res, next) {                                        /* catch 404 and forward to error handler */
    next(createError(404));
});

app.use(function(err, req, res, next) {                                   /* error handler */
    res.locals.message = err.message;     /* set locals, only providing error in development */
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);                                  /* render the error page */
    res.render('error');
});


module.exports = app;
