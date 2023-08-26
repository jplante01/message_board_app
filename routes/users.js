const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

//Get request for login form
router.get('/login', user_controller.user_login);

router.get('/signup', user_controller.user_create_get);

// GET request for creating a new user
router.get('/create', user_controller.user_create_get);

router.post('/create', user_controller.user_create_post)

router.get('/success', user_controller.user_create_success);

module.exports = router;

