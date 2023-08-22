const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users landing page');
});

// GET request for creating a new user
router.get('/create', user_controller.user_create_get);

router.post('/create', user_controller.user_create_post)

router.get('/success', user_controller.user_create_success);

module.exports = router;

