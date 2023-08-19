const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Express' });
});
module.exports = router;
