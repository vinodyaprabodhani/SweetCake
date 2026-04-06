const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.put('/item/:id', auth, cartController.updateCartItem);
router.delete('/item/:id', auth, cartController.removeFromCart);
router.delete('/clear', auth, cartController.clearCart);

module.exports = router;
