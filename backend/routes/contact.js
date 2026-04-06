const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', contactController.submitMessage);
router.get('/', auth, adminOnly, contactController.getMessages);
router.put('/:id/read', auth, adminOnly, contactController.markAsRead);
router.put('/:id/reply', auth, adminOnly, contactController.replyToMessage);
router.delete('/:id', auth, adminOnly, contactController.deleteMessage);

module.exports = router;
