var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

/*
you can apply the ensureloggedIn middleware to the whole route by
router.use(ensureLoggedIn);
*/

/* GET home page. */
router.get('/',ensureLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
