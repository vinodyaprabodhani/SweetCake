const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', auth, reviewController.addReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
