const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.user_create_get = (req, res, next) => {
  res.render("user_form");
}

exports.user_create_post = (req, res, next) => {
  res.send("user_form");
}

