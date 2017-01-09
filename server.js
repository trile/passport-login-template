var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();



var MONGODB_URI = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGODB_URI, function(err) {
    if (err) console.log(err);
    else console.log('Connected to the database');
})

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));

app.listen(3000, function(err) {
     if (err) throw err;
     console.log("Server is running on port 3000");
 })
