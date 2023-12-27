const express = require('express');
const { requireRole } = require('../middlewares/requireRole');
const router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/messages');
});

router.get('/admin', requireRole('admin'), function(req, res, next) {
  res.render('home', {
    user: req.user,
    pageContent: 'dashboard',
  });
});


module.exports = router;
