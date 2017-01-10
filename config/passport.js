var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy();

// Serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Middleware
passport.use('local-login', new LocalStrategy( {
        usernameField: 'email',
        passworldField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if (err) return done(err);

            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No user has been found'));
            }

            if(!user.comparePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Opps! Wrong password pal'));
            }

            return done(null, user);
        });
    }
));

//custom function to validate
exports.isAuthenticated = function(err, res, next) {
    if (res.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
