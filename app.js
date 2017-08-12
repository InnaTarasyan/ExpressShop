var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HttpError = require('error').HttpError;
var config = require('config');
var mongoose = require('libs/mongoose');


//var users = require('./routes/users');
var engine = require('ejs-locals');


var app = express();
app.engine('ejs', engine);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var index = require('./routes/index');




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// app.use(function(req, res, next) {
//     req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//     res.send("Visits: " + req.session.numberOfVisits);
// });


app.use(express.static(path.join(__dirname, 'public')));

app.use(require('middleware/sendHttpError'));

require('routes')(app);

//
// router.get('/login', function (req, res) {
//     console.log('inna');
// });
//
// router.get('/', function (req,res) {
//     console.log('getyyy');
//     res.end('text');
// });

 app.use('/', index);
//app.use('/users', users);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
     console.log(err.message);
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }



});

module.exports = app;

