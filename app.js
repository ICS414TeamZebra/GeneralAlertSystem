const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');

const routes = {};
routes.index = require('./routes/index');
routes.login = require('./routes/login');
routes.dashboard = require('./routes/dashboard');
routes.live = require('./routes/alertLive');
routes.test = require('./routes/alertTest');
routes.cancel = require('./routes/alertCancel');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes.index);
app.use('/login', routes.login);
app.use('/dashboard', routes.dashboard);
app.use('/alert/live', routes.live);
app.use('/alert/test', routes.test);
app.use('/alert/cancel', routes.cancel);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (res.headersSent) {
    return next(err);
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
