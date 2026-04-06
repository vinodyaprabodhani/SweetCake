const express = require('express');
const router = express.Router();
const customOrderController = require('../controllers/customOrderController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, customOrderController.submitCustomOrder);
router.get('/my-orders', auth, customOrderController.getMyCustomOrders);
router.get('/all', auth, adminOnly, customOrderController.getAllCustomOrders);
router.put('/:id', auth, adminOnly, customOrderController.updateCustomOrder);

module.exports = router;
