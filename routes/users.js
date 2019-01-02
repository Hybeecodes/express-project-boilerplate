var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const mail = require('../nodeMailerWithTemp');
// const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const nodemailer = require('nodemailer');
const uniString = require('unique-string');
var key = '217764a52f15fcd6e5dc68df6a385cb274d7cf379e4199e82815b3ef3aa9f1b72b51eb899957ae4c7985d66497b80c9kaFFzViUZ0FFes5p';
// Create an encryptor:
var encryptor = require('simple-encryptor')(key);

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

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}

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
});

router.get('/forgot-password',(req,res,next)=> {
  res.render('forgot-password');
});

router.post('/forgot-password',(req,res,next)=> {
  const { email } = req.body;
  User.findOne({email},(err,user)=>{
    if(user){
      let string = uniString();
      let token = `${email}_${string}`;
      // console.log(token);
      let link = `http://localhost:3000/users/reset-password?token=${token}`; // replace the localhost:3000 with your domain
      // console.log(link);
      const exp = new Date().addHours(2);
      // console.log(now);
      User.findOneAndUpdate({email},{resetPassToken:string,resetPassExp:exp}).then((user)=> {
        mail(email,link);
        return res.redirect('/users/login');
      })
    }else{
      return res.redirect('/users/forgot-password');
    }
  });
});

router.get('/reset-password',(req,res,next) => {
  let { token } = req.query;
  token = token.split('_');
  console.log(token);
  const [ email, string] = token;
  User.findOne({email,resetPassToken:token}).then((user)=> {
    console.log(user.resetPassExp)
    // console.log('time',new Date().toISOString())
    if(user.resetPassExp > Date.now()){
      res.render('reset-password',{user_id: user._id});
    }else{
      res.send("Sorry, link has expired")
    }
  })
  // console.log(email)
})

router.post('/reset-password',(req,res,next)=>{
  const { user_id, new_pass, con_pass } = req.body;
  if(new_pass === con_pass){
    let password = bcrypt.hashSync(new_pass);
    User.findByIdAndUpdate(user_id,{password},(err,user)=>{
      if(err){
        res.send("Sorry, An error occured")
      }else{
        res.send("Hey, Password Updated Succesfully")
      }
    })
  }
  
})

module.exports = router;
