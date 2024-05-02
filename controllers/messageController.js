const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.messages_index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find()
    .sort({ timestamp: -1 })
    .populate('user', 'username')
    .exec();
  
  res.render('home', { user: req.user, messages: messages, pageContent:'messageboard' });
});

exports.messages_dashboard = asyncHandler(async (req, res, next) => {
  const messages = await Message.find()
    .sort({ timestamp: -1 })
    .populate('user', 'username')
    .exec();

  res.render('home', {
    user: req.user,
    messages: messages,
    pageContent: 'dashboard',
  });
});

exports.message_create_get = (req, res, next) => {
  res.render('home', {
    user: req.user,
    pageContent: 'createMessage',
  });
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
      res.render('home', {
        errors: errors.array(),
        user: req.user,
        pageContent: 'createMessage',
        title: messageInstance.title,
        content: messageInstance.content,
      });
    } else {
      await messageInstance.save();
      res.redirect('/messages/success');
    }
  }),
];

exports.message_create_success = (req, res, next) => {
  res.render('home', {
    user: req.user,
    pageContent: 'messageCreateSuccess',
  });
};

exports.delete_message = [
  // asyncHandler(async (req, res, next) => {
  //   try {
  //     await Message.deleteOne({ _id: req.params.id });
  //     res.redirect('/');
  //   } catch (error) {
  //     // Handle any errors that occur during the deletion process
  //     console.error(error);
  //     res.status(500).send('Error deleting message');
  //   }
  // })
  asyncHandler(async (req, res, next) => {
    const messageId = req.params.id;
    const userId = req.user.id; // Assuming userId is obtained from authentication middleware

    // Find the message by ID
    const message = await Message.findById(messageId);

    if (!message) {
      // Message not found
      return res.status(404).send('Message not found');
    }

    // Check if the authenticated user is the creator of the message
    if (message.user.toString() !== userId) {
      // User is not authorized to delete this message
      return res.status(403).send('You are not authorized to delete this message');
    }

    // User is authorized, proceed with message deletion
    await Message.deleteOne({ _id: messageId });
    res.redirect('/');
  })
];

exports.group_delete_message = [
  asyncHandler(async (req, res, next) => {
    try {
      const idsToDelete  = Object.keys(req.body);

      await Message.deleteMany({ _id: { $in: idsToDelete} });
      res.redirect('/');
    } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error(error);
      res.status(500).send('Error deleting message');
    }
  })
];