const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render("user_form");
}

exports.user_create_post = [
  // validate and sanitize fields
  body('first_name', 'First name must be specified').trim().isLength({min: 1, max: 30 }).escape(),
  body('last_name', 'Last name must be specified').trim().isLength({min: 1, max: 30 }).escape(),
  body('username', 'Username must be specified').trim().isLength({min: 1, max: 30 }).escape(),
  body('password', 'Password must be specified').trim().isLength({min: 1, max: 30 }).escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a user object with escaped and trimmed data.
    const userInstance = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
    })

    if (!errors.isEmpty()) {
      res.render('user_form', {
        errors: errors.array(),
        firstName: userInstance.first_name,
        lastName: userInstance.last_name,
        username: userInstance.username,
      });
    } else {
      res.send('success')
    }
  })
]

