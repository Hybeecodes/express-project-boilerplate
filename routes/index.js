var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

/*
you can apply the ensureloggedIn middleware to the whole route by
router.use(ensureLoggedIn);
*/

/* GET home page. */
router.get('/',ensureLoggedIn, function(req, res, next) {
  console.log(req.user)
  res.render('index', { title: 'Express Project', user: req.user });
});

router.get('/logout',ensureLoggedIn,function(req,res,next){
  req.session.destroy(function (err) {
    res.redirect('/users/login'); //Inside a callback… bulletproof!
  });
})

module.exports = router;
