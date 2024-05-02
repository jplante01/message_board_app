const express = require('express');
const router = express.Router();
const { requireRole } = require('../middlewares/requireRole');

const message_controller = require('../controllers/messageController');

router.get('/', message_controller.messages_index);

router.get('/admin',requireRole('admin'), message_controller.messages_dashboard)

router.get('/create', message_controller.message_create_get);

router.post('/create', message_controller.message_create_post);

router.get('/success', message_controller.message_create_success);

// Using GET to delete messages because the <a> element in PICOCSS
// has the styling wanted, and <a> can't process DELETE requests
router.get('/delete/:id', message_controller.delete_message);

router.post('/admin', requireRole('admin'), message_controller.group_delete_message);

module.exports = router;
