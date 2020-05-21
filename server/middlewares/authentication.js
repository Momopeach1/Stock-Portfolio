const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if(err) return done(err);
    if(!user) return done(null, false);

    user.comparePassword(password, (err, isMatch) => {
      if(err) return done(err);
      if(!isMatch) return done(null, false);

      return done(null, user);
    });
  });
}));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(err) return done(err, null);
    if(!user) return done(null, false);
  });
});

passport.isLoggedIn = () => (req, res, next) => (req.user? next() : res.sendStatus(401));

module.exports = passport;