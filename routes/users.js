var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// local strategy configuration
passport.use(new LocalStrategy(
  {usernameField:'email', passwordField: 'password'},
  function(email, password, done) {
    User.findOne({ email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

// serialize and unserialize user functions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',passport.authenticate('local',{ failureRedirect: '/users/login'}),(req,res,next)=>{
  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup',(req,res,next) => {
  const {firstname, lastname, email, password } = req.body;

  const user = new User({
    firstname,
    lastname,
    email,
    password: bcrypt.hashSync(password)
  });
  user.save((err,user)=>{
    if(user){
      res.redirect('/users/login');
    }
  })
})



module.exports = router;
