require('./config/config');
require('./db/mongoose');

const express     = require('express');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const ejs         = require('ejs');
const engine      = require('ejs-mate');
const session     = require('express-session');
const cookieParser= require('cookie-parser');
const flash       = require('express-flash');
const MongoStore  = require('connect-mongo')(session);
const passport    = require('passport');

let app = express();

app.use(express.static(__dirname + '/public'));

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ url: process.env.MONGODB_URI, autoReconnect: true})
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

let mainRoutes = require('./routes/main');
let userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

// catch 404 and forward to error handler

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('main/errors');
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

module.exports = app;
