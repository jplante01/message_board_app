const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('home', { user: req.user });
});

router.get('/create', function (req, res, next) {
  res.render('message_form', { user: req.user });
});

module.exports = router;
