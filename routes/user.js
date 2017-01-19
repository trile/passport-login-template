var router = require('express').Router();
var passport = require('passport');
var passportConf = require('../config/passport');

var User = require('../models/user');

router.get('/login', function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('accounts/login', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', function(req, res, next) {
    User.findOne({_id: req.user._id}, function(err, user) {
        if (err) return next(err);
        res.render('accounts/profile', {user: user});
    })
})


router.get('/signup', function(req, res, next) {
    res.render('accounts/signup', {errors: req.flash('errors')});
})

router.post('/signup', function(req, res) {
    var user = new User();
    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();

    User.findOne({email: req.body.email}, function(err, existingUser) {
        if (existingUser) {
            req.flash('errors', 'Account with that email address already exists');
            return res.redirect('/signup');
        } else {
            user.save(function(err, user) {
                if (err) return next(err);
            })

            req.logIn(user, function (err) {
                if (err) return next(err);
                res.redirect('/profile');
            })
        }
    });
});

router.get('/logout', function(req,res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/edit-profile', function (req, res, next) {
    res.render('accounts/edit-profile', {messages: req.flash('success')});
});

router.post('/edit-profile', function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user) {
        if(err) return next(err);
        console.log("checking param")
        console.log(req.body.name);
        console.log(req.body.address);
        if(req.body.name) user.profile.name = req.body.name;
        user.address = req.body.address;

        user.save(function (err) {
            if (err) return next(err);
            console.log('success')
            req.flash('success', 'Successfully edited your profile');
            return res.redirect('/edit-profile');
        })
    })
})

module.exports = router;
