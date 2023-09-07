const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

router.get('/', message_controller.messages_index);

router.get('/create', message_controller.message_create_get);

router.post('/create', message_controller.message_create_post);

router.get('/success', message_controller.message_create_success);

// Using GET to delete messages because the <a> element in PICOCSS
// has the styling wanted, and <a> can't process DELETE requests
router.get('/delete/:id', message_controller.delete_message);

module.exports = router;
