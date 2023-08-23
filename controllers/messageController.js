const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.message_create_get = (req, res, next) => {
  res.render('message_form');
};

exports.message_create_post = [
  body('title', 'Please include a title')
    .trim()
    .isLength({ min: 1, max: 60 })
    .escape(),
  body('content', 'Please include a message')
    .trim()
    .isLength({ min: 1, max: 240 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a message object with escaped and trimmed data.
    const messageInstance = new Message({
      title: req.body.title,
      content: req.body.content,
      user: res.locals.currentUser.id,
      timestamp: new Date(),
    });

    if (!errors.isEmpty()) {
      res.render('message_form', {
        errors: errors.array(),
        title: messageInstance.title,
        content: messageInstance.content,
      });
    } else {
      await messageInstance.save();
      res.redirect('/messages/create');
    }
  }),
];

