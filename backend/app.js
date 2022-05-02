var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weaponRouter = require('./routes/weapon');
var equipRouter = require('./routes/equipment');

var moviesRouter = require('./routes/movies');


// Connect


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/weapon', weaponRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/equipment', equipRouter);

// app.post('/regist', function (req, res) {
//   var user = {
//     'name': req.body.name,
//     'age': req.body.age,
//     'sex': req.body.sex,
//     'race': req.body.race,
//     'nativePlace': req.body.nativePlace,
//     'height': req.body.height,
//     'weight': req.body.weight
//   };
//   var query = connection.query('insert into player set ?', user, function (err, result) {
//     if (err) {
//       console.error(err);
//       throw err;
//     }
//     res.status(200).send('success');
//   });
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
