require('../config/passport');

const router = require('express').Router();
const passport = require('passport');

let User = require('../models/user');

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('accounts/login', {
    messages: req.flash('success'),
    errors: req.flash('loginMessage')
  });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  User.findOne({_id: req.user._id})
  .then((user) => {
    res.render('accounts/profile', {messages: req.flash('success'), user: user});
  })
  .catch((err) => next(err));
});

router.get('/signup', (req, res) => {
  res.render('accounts/signup', {errors: req.flash('errors')});
});

router.post('/signup', (req, res, next) => {
  let user = new User();
  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.profile.picture = user.gravatar();

    // Need to be rewritten with then
    User.findOne({email: req.body.email}).then((existingUser) => {
      if (existingUser) {
        req.flash('errors', 'Account with that email address already exists');
        return res.redirect('/signup');
      } else {
        user.save().then(() => {
          req.flash('success', 'Successfully registered! You can login');
          return res.redirect('/login');
        }, (err) => next(err));
      }
    }).catch((err) => {
      console.log("hello" + err);
      next(err);
    });
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/edit-profile', (req, res) => {
  res.render('accounts/edit-profile');
});

router.post('/edit-profile', (req, res, next) => {
  User.findOne({_id: req.user._id}).then((user) => {
    if (req.body.name)
      user.profile.name = req.body.name;
    user.address = req.body.address;

    user.save().then(() => {
      req.flash('success', 'Successfully edited your profile');
      return res.redirect('/profile');
    }, (err) => next(err));
  }).catch((err) => {
    console.log("hello" + err);
    next(err);
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('loginMessage', 'You are not authorize to view that page');
    return res.redirect('/login');
  }
}

module.exports = router;
