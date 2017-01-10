var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');

var User = require('./models/user');


var MONGODB_URI = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGODB_URI, function(err) {
    if (err) console.log(err);
    else console.log('Connected to the database');
})

var app = express();

app.use(express.static(__dirname + '/public'));

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(3000, function(err) {
     if (err) throw err;
     console.log("Server is running on port 3000");
 })
