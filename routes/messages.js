const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

router.get('/', message_controller.messages_index);

router.get('/create', message_controller.message_create_get);

router.post('/create', message_controller.message_create_post);
module.exports = router;
