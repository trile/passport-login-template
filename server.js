var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();

var User = require('./models/user');


var MONGODB_URI = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGODB_URI, function(err) {
    if (err) console.log(err);
    else console.log('Connected to the database');
})

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));

app.post('/create-user', function(req, res, next) {
    var user = new User();

    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save(function(err) {
        if (err) return next(err);
        res.json('Successfully created a new user');
    })
});



app.listen(3000, function(err) {
     if (err) throw err;
     console.log("Server is running on port 3000");
 })
