const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.user_login = (req, res, next) => {
  res.render('home', {
    user: req.user,
    pageContent: 'login',
  });
};

exports.user_create_get = (req, res, next) => {
  res.render('home', {
    user: req.user,
    pageContent: 'signup',
  });
};

// Custom validator to check for unique usernames
const isUsernameUnique = async value => {
  const user = await User.findOne({ username: value });
  if (user) {
    throw new Error('Username is already in use');
  }
};

exports.user_create_post = [
  // validate and sanitize fields
  body('first_name', 'First name must be specified')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body('last_name', 'Last name must be specified')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body('username', 'Username must be specified')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .custom(isUsernameUnique),
  body('password', 'Password must be specified')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body('passwordConfirmation', 'Passwords do not match').custom(
    (value, { req }) => {
      return value === req.body.password;
    },
  ),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a user object with escaped and trimmed data.
    const userInstance = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
    });

    if (!errors.isEmpty()) {
      res.render('user_form', {
        errors: errors.array(),
        firstName: userInstance.first_name,
        lastName: userInstance.last_name,
        username: userInstance.username,
      });
    } else {
      await userInstance.save();
      res.redirect('/users/success');
    }
  }),
];

exports.user_create_success = (req, res, next) => {
  res.render('user_create_success');
};
