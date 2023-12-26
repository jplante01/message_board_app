const express = require('express');
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

function requireRole(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user[role] === true) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = router;
