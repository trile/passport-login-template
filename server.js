var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session); // depends on Express session
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');


mongoose.connect(secret.MONGODB_URI, function(err) {
    if (err) console.log(err);
    else console.log('Connected to the database');
})

var app = express();

app.use(express.static(__dirname + '/public'));

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.MONGODB_URI, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.PORT, function(err) {
     if (err) throw err;
     console.log("Server is running on port " + secret.PORT);
 })
