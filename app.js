process.env.key= 'keykeykeykeykeykey';



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/api');
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
    limit: '5mb',
    extended: true}));

app.use(bodyParser.json({limit: '5mb'}));

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
    next(null, jwt_payload);
});


passport.use(strategy);
app.use(passport.initialize());
/* ======================================================================== */

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


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
