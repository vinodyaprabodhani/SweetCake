const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, adminController.getDashboard);
router.get('/users', auth, adminOnly, adminController.getUsers);
router.delete('/users/:id', auth, adminOnly, adminController.deleteUser);

module.exports = router;
